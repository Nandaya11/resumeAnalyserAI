import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.output_parsers import PydanticOutputParser
from pydantic import BaseModel, Field
from typing import List
import json
import logging

logger = logging.getLogger(__name__)

class ResumeAnalysisOutput(BaseModel):
    name: str = Field(description="Full name of the candidate")
    email: str = Field(description="Email address")
    phone: str = Field(description="Phone number")
    location: str = Field(description="Location/address")
    professional_summary: str = Field(description="Professional summary or objective")
    core_skills: List[str] = Field(description="List of technical/core skills")
    soft_skills: List[str] = Field(description="List of soft skills")
    work_experience: List[dict] = Field(description="Work experience with company, position, duration, responsibilities")
    education: List[dict] = Field(description="Education details with degree, institution, year")
    certifications: List[str] = Field(description="Professional certifications")
    resume_rating: float = Field(description="Overall resume rating out of 10")
    improvement_areas: List[str] = Field(description="Areas for improvement")
    upskill_suggestions: List[str] = Field(description="Specific upskilling recommendations")

class GeminiAnalyzer:
    def __init__(self):
        api_key = os.getenv("API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")

        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0.1,
            google_api_key=api_key
        )

        # Set up output parser
        self.parser = PydanticOutputParser(pydantic_object=ResumeAnalysisOutput)

        # Create prompt template
        self.prompt_template = PromptTemplate(
            template='''You are an expert resume analyzer and career counselor. 
            Analyze the following resume text and extract structured information.

            Resume Text:
            {resume_text}

            Please analyze this resume thoroughly and provide:
            1. Complete personal information extraction
            2. Professional summary/objective
            3. Core technical skills
            4. Soft skills
            5. Detailed work experience with specific responsibilities
            6. Education background
            7. Professional certifications
            8. Overall resume rating (1-10 scale)
            9. Specific improvement areas
            10. Targeted upskilling suggestions based on current role and industry trends

            Be specific and detailed in your analysis. Focus on:
            - Quantifiable achievements where mentioned
            - Skills relevance to current job market
            - Experience progression and career growth
            - Areas lacking that are important for the candidate's field
            - Specific technologies, tools, or skills to learn for career advancement

            {format_instructions}
            ''',
            input_variables=["resume_text"],
            partial_variables={"format_instructions": self.parser.get_format_instructions()}
        )

    async def analyze_resume(self, resume_text: str) -> dict:
        try:
            if not resume_text or len(resume_text.strip()) < 10:
                logger.error("Resume text is empty or too short")
                raise ValueError("Extracted text is too short to be a valid resume")

            logger.info(f"Analyzing resume text (length: {len(resume_text)})")
            
            # Create the prompt
            prompt = self.prompt_template.format(resume_text=resume_text)
            logger.info("Created prompt for Gemini")

            # Get response from Gemini
            try:
                response = self.llm.invoke(prompt)
                logger.info("Received response from Gemini")
                logger.info(f"Response content: {response.content[:500]}...")  # Log first 500 chars
            except Exception as gemini_error:
                logger.error(f"Gemini API error: {str(gemini_error)}")
                raise

            # Parse the response
            try:
                parsed_result = self.parser.parse(response.content)
                logger.info("Successfully parsed Gemini response")
            except Exception as parse_error:
                logger.error(f"Error parsing Gemini response: {str(parse_error)}")
                logger.error(f"Raw response content: {response.content[:500]}...")
                raise

            # Convert to dictionary format expected by the API (FIXED STRUCTURE)
            result = {
                "personal_info": {
                    "name": parsed_result.name,
                    "email": parsed_result.email,
                    "phone": parsed_result.phone
                },
                "professional_summary": parsed_result.professional_summary,
                "core_skills": parsed_result.core_skills,
                "soft_skills": parsed_result.soft_skills,
                "education": [
                    {
                        "institution": edu.get("institution", ""),
                        "degree": edu.get("degree", ""),
                        "year": edu.get("year", "")
                    }
                    for edu in parsed_result.education
                ],
                "work_experience": parsed_result.work_experience,
                "certifications": parsed_result.certifications,
                "ai_analysis": {
                    "rating": parsed_result.resume_rating,
                    "improvement_areas": parsed_result.improvement_areas,
                    "upskill_suggestions": parsed_result.upskill_suggestions
                }
            }

            return result

        except Exception as e:
            logger.error(f"Error analyzing resume with Gemini: {str(e)}")
            # Return proper structure even on error
            return {
                "personal_info": {
                    "name": "Unable to extract",
                    "email": None,
                    "phone": None
                },
                "professional_summary": "Analysis failed due to API error",
                "core_skills": [],
                "soft_skills": [],
                "education": [],
                "work_experience": [],
                "certifications": [],
                "ai_analysis": {
                    "rating": 0.0,
                    "improvement_areas": [],
                    "upskill_suggestions": []
                }
            }
    def _calculate_experience_years(self, work_experience: List[dict]) -> int:
        """Helper method to calculate total years of experience"""
        # Implement logic to parse duration and sum up years
        # For now, return a simple count
        return len(work_experience)

    def _fallback_analysis(self, resume_text: str) -> dict:
        # Basic fallback analysis without AI
        return {
            "name": "Unable to extract",
            "email": "Unable to extract",
            "phone": "Unable to extract",
            "location": "Unable to extract",
            "professional_summary": "Analysis failed - please try again",
            "core_skills": [],
            "soft_skills": [],
            "work_experience": [],
            "education": [],
            "certifications": [],
            "resume_rating": 0.0,
            "improvement_areas": ["Unable to analyze - please try uploading again"],
            "upskill_suggestions": ["Unable to analyze - please try uploading again"],
            "raw_text": resume_text
        }