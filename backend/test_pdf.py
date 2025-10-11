from resume_parser import ResumeParser
import sys

def test_pdf_reading():
    try:
        parser = ResumeParser()
        with open(sys.argv[1], 'rb') as file:
            content = file.read()
            text = parser.extract_text_from_pdf(content)
            print("Successfully extracted text from PDF:")
            print("-" * 50)
            print(text[:500])  # Print first 500 characters
    except Exception as e:
        print(f"Error: {str(e)}")
