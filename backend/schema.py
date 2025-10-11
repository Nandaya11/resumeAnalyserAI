from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class PersonalInfo(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    location: Optional[str] = None

class WorkExperience(BaseModel):
    company: str
    position: str
    duration: str
    responsibilities: List[str]

class Education(BaseModel):
    degree: str
    institution: str
    year: str
    details: Optional[str] = None

class AIAnalysis(BaseModel):
    rating: float
    improvement_areas: List[str]
    upskill_suggestions: List[str]

class ResumeAnalysisResponse(BaseModel):
    personal_info: PersonalInfo
    professional_summary: Optional[str] = None
    core_skills: List[str]
    soft_skills: List[str]
    work_experience: List[WorkExperience]
    education: List[Education]
    certifications: List[str]
    ai_analysis: AIAnalysis

    class Config:
        from_attributes = True

class ResumeListItem(BaseModel):
    id: str
    filename: str
    upload_date: datetime
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    resume_rating: Optional[float] = None

    class Config:
        from_attributes = True