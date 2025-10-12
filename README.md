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
    <video src="./Assets/demo.webm" controls width="640" />


# SCREENSHOTS : 
   <img src="./assets/1.png" width="500" alt="App Screenshot">
   <img src="./assets/2.png" width="500" alt="App Screenshot">
   <img src="./assets/3.png" width="500" alt="App Screenshot">
   <img src="./assets/4.png" width="500" alt="App Screenshot">