from sqlalchemy import Column, String, DateTime, Float, JSON, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    upload_date = Column(DateTime(timezone=True), server_default=func.now())

    name = Column(String)
    email = Column(String)
    phone = Column(String)
    location = Column(String)

    professional_summary = Column(Text)
    core_skills = Column(JSON)  
    soft_skills = Column(JSON)  
    work_experience = Column(JSON) 
    education = Column(JSON)  
    certifications = Column(JSON)  

    resume_rating = Column(Float)
    improvement_areas = Column(JSON)  
    upskill_suggestions = Column(JSON)  

    raw_text = Column(Text)