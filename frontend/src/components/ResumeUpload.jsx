import React, { useState } from "react";
import { Upload, FileText, Star, TrendingUp, Award, Briefcase, GraduationCap, User } from "lucide-react";

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setResponse(null);
    } else {
      alert("Please select a valid PDF file!");
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("No file selected!");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/upload-resume", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error(err);
      alert("Error processing file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return "text-green-600";
    if (rating >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Resume Analyzer
            </h1>
            <p className="text-gray-600">
              Upload your resume and get AI-powered insights
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center w-full py-8 px-4 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
              >
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm font-medium text-gray-700">
                    {file ? file.name : "Click to upload PDF"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF files only, max 10MB
                  </p>
                </div>
              </label>
            </div>

            <button
              onClick={handleUpload}
              disabled={isUploading || !file}
              className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all transform hover:scale-105 ${
                isUploading || !file
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              }`}
            >
              {isUploading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing Resume...
                </span>
              ) : (
                "Analyze Resume"
              )}
            </button>
          </div>
        </div>


        {response && (
          <div className="space-y-6">

            {response.personal_info && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <User className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-semibold text-gray-800">{response.personal_info.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-800">{response.personal_info.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-semibold text-gray-800">{response.personal_info.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-semibold text-gray-800">{response.personal_info.location}</p>
                  </div>
                </div>
              </div>
            )}

            {response.ai_analysis && (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-6 h-6" />
                      <h2 className="text-2xl font-bold">AI Rating</h2>
                    </div>
                    <p className="text-purple-100">Overall resume quality score</p>
                  </div>
                  <div className="text-6xl font-bold">{response.ai_analysis.rating}/10</div>
                </div>
              </div>
            )}

            {response.professional_summary && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-3">Professional Summary</h2>
                <p className="text-gray-700 leading-relaxed">{response.professional_summary}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {response.core_skills && response.core_skills.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Core Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {response.core_skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {response.soft_skills && response.soft_skills.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Soft Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {response.soft_skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Work Experience */}
            {response.work_experience && response.work_experience.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Work Experience</h2>
                </div>
                <div className="space-y-6">
                  {response.work_experience.map((job, idx) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4">
                      <h3 className="text-lg font-bold text-gray-800">{job.position}</h3>
                      <p className="text-blue-600 font-medium">{job.company}</p>
                      <p className="text-sm text-gray-500 mb-2">{job.duration}</p>
                      <ul className="list-disc list-inside space-y-1">
                        {job.responsibilities.map((resp, i) => (
                          <li key={i} className="text-gray-700 text-sm">{resp}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {response.education && response.education.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Education</h2>
                </div>
                <div className="space-y-4">
                  {response.education.map((edu, idx) => (
                    <div key={idx} className="border-l-4 border-green-500 pl-4">
                      <h3 className="text-lg font-bold text-gray-800">{edu.degree}</h3>
                      <p className="text-green-600 font-medium">{edu.institution}</p>
                      <p className="text-sm text-gray-500">{edu.year}</p>
                      {edu.details && <p className="text-gray-700 text-sm mt-1">{edu.details}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {response.certifications && response.certifications.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-6 h-6 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Certifications</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {response.certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                      <Award className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                      <span className="text-gray-800 text-sm">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {response.ai_analysis && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {response.ai_analysis.improvement_areas && response.ai_analysis.improvement_areas.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="w-6 h-6 text-orange-600" />
                      <h2 className="text-xl font-bold text-gray-800">Improvement Areas</h2>
                    </div>
                    <ul className="space-y-2">
                      {response.ai_analysis.improvement_areas.map((area, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-orange-500 mt-1">•</span>
                          <span className="text-gray-700 text-sm">{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {response.ai_analysis.upskill_suggestions && response.ai_analysis.upskill_suggestions.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="w-6 h-6 text-purple-600" />
                      <h2 className="text-xl font-bold text-gray-800">Upskill Suggestions</h2>
                    </div>
                    <ul className="space-y-2">
                      {response.ai_analysis.upskill_suggestions.map((suggestion, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-purple-500 mt-1">•</span>
                          <span className="text-gray-700 text-sm">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;