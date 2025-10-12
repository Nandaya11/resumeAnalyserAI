import PyPDF2
import io
import re
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class ResumeParser:
    def __init__(self):
        self.phone_pattern = re.compile(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}')
        self.email_pattern = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b')

    def extract_text_from_pdf(self, pdf_content: bytes) -> str:
        try:
            pdf_file = io.BytesIO(pdf_content)

            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            if len(pdf_reader.pages) == 0:
                logger.error("PDF has no pages")
                raise Exception("PDF file appears to be empty")

            text = ""
            for i, page in enumerate(pdf_reader.pages):
                page_text = page.extract_text()
                logger.info(f"Extracted {len(page_text)} characters from page {i+1}")
                text += page_text + "\n"

            final_text = text.strip()
            if not final_text:
                logger.error("No text extracted from PDF")
                raise Exception("Could not extract any text from PDF")

            logger.info(f"Successfully extracted {len(final_text)} characters from PDF")
            logger.info(f"First 200 characters: {final_text[:200]}")
            return final_text

        except Exception as e:
            logger.error(f"Error extracting text from PDF: {str(e)}")
            raise Exception("Failed to extract text from PDF")

    def extract_basic_info(self, text: str) -> dict:
        # Extract email
        email_match = self.email_pattern.search(text)
        email = email_match.group() if email_match else None

        # Extract phone
        phone_match = self.phone_pattern.search(text)
        phone = phone_match.group() if phone_match else None

        return {
            "email": email,
            "phone": phone
        }