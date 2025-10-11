from fastapi import FastAPI, File, UploadFile, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import models
import schema
import database
from typing import List
import logging
from resume_parser import ResumeParser
from gemini_analyser import GeminiAnalyzer
from datetime import datetime
import uuid



logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


app = FastAPI(title="Resume Analyzer API",version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=database.engine)

resume_parser = ResumeParser()
gemini_analyzer = GeminiAnalyzer()


@app.get("/")
def read_root():
    return {"message": "Hello, FastAPI!"}

@app.get("/resumes", response_model=List[schema.ResumeListItem])
def get_all_resumes(db: Session = Depends(database.get_db)):
    resumes = db.query(models.Resume).all()
    return resumes


@app.post("/api/upload-resume", response_model=schema.ResumeAnalysisResponse)
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(database.get_db)
):
    try:
        # Validate file type
        if not file.filename.endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Only PDF files are supported")

        # Read file content
        logger.info(f"Reading uploaded file: {file.filename}")
        content = await file.read()
        
        if len(content) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty")

        # Extract text from PDF
        try:
            extracted_text = resume_parser.extract_text_from_pdf(content)
            logger.info(f"Successfully extracted {len(extracted_text)} characters from PDF")
        except Exception as pdf_error:
            logger.error(f"PDF extraction error: {str(pdf_error)}")
            raise HTTPException(status_code=400, detail=f"Error extracting text from PDF: {str(pdf_error)}")

        # Validate extracted text
        if not extracted_text or len(extracted_text.strip()) < 10:
            raise HTTPException(status_code=400, detail="Could not extract meaningful text from the PDF")

        # Parse resume using Gemini AI
        try:
            analysis_result = await gemini_analyzer.analyze_resume(extracted_text)
            logger.info("Successfully analyzed resume with Gemini AI")
        except Exception as gemini_error:
            logger.error(f"Gemini analysis error: {str(gemini_error)}")
            raise HTTPException(status_code=500, detail=f"Error analyzing resume: {str(gemini_error)}")

        # Flatten the nested structure for database storage
        db_resume = models.Resume(
            id=str(uuid.uuid4()),
            filename=file.filename,
            upload_date=datetime.utcnow(),
            # Personal info
            name=analysis_result["personal_info"]["name"],
            email=analysis_result["personal_info"]["email"],
            phone=analysis_result["personal_info"]["phone"],
            # AI Analysis
            resume_rating=analysis_result["ai_analysis"]["rating"],
            # Other fields (assuming these exist in your Resume model)
            work_experience=analysis_result.get("work_experience"),
            education=analysis_result.get("education"),
            certifications=analysis_result.get("certifications"),
        )

        db.add(db_resume)
        db.commit()
        db.refresh(db_resume)

        logger.info(f"Resume uploaded and analyzed: {file.filename}")

        # Return the nested structure as expected by the response model
        return schema.ResumeAnalysisResponse(**analysis_result)

    except Exception as e:
        logger.error(f"Error processing resume: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error processing resume: {str(e)}")