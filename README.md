# Resume-analyses (via AI)

this project is divided into 2 parts (frontend and backend)

# Backend : 
    - Used FastAPI with Langchain
    - Used MyPDF2 and Gemini AI to read and analyze resume
    - Used Supabase 
    - File Structure : 
        -database.py (db connection)
        -models.py (table structure for db)
        -schema.py 
        -gemini_analyser.py (interaction with Gemini with resume text and prompt)
        -resume_parser.py (extract text from resume pdf)
        -main.py (3 routes)
            - GET("/") : stablish connection only
            - GET("/resumes") : list all the previously analysed resumes
            - POST("/upload-resume") : req file(string type) and analyse with AI and then store key info to DB 

# Frontend : 
    - Used ReactJS with Tailwind 
    - has 2 components (ResumeUpload | ResumeHistory)
        - ResumeUpload: calls the API after taking pdf as input : POST("/upload-resume")
        - ResumeHistory: calls API : GET("/resumes") only when rendering the first time and when you click the refresh button


# DEMO :
<video src="https://github.com/user-attachments/assets/9bfbb9be-c19a-4637-9cad-7a1218219f1c" controls width="640">
  Your browser does not support the video tag.
</video>

# SCREENSHOTS : 
<img width="1897" height="900" alt="Image" src="https://github.com/user-attachments/assets/f6ba9e1a-cd0c-437d-8f81-916268323eff" />
<img width="1897" height="900" alt="Image" src="https://github.com/user-attachments/assets/ffc2312d-1553-4669-8928-7553ab3400e2" />
<img width="1897" height="900" alt="Image" src="https://github.com/user-attachments/assets/cbbfc559-ac93-4234-9dc2-bcb04cd682f7" />
<img width="1897" height="900" alt="Image" src="https://github.com/user-attachments/assets/d089b750-51e3-42ee-8bed-9574d150499c" />
