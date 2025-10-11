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
    core_skills = Column(JSON)  # List of skills
    soft_skills = Column(JSON)  # List of soft skills
    work_experience = Column(JSON)  # List of work experience objects
    education = Column(JSON)  # List of education objects
    certifications = Column(JSON)  # List of certifications

    resume_rating = Column(Float)
    improvement_areas = Column(JSON)  # List of improvement suggestions
    upskill_suggestions = Column(JSON)  # List of upskill recommendations

    raw_text = Column(Text)