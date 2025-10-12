import { useState } from 'react';
import ResumeHistory from "./components/ResumeHistory";
import ResumeUpload from "./components/ResumeUpload";

function App() {
  const [activeTab, setActiveTab] = useState('analyse');

  return (
    <>
      <div className="flex justify-center p-6">
        <div className="relative inline-flex items-center bg-gray-200 rounded-full p-1">
          {/* Sliding background */}
          <div
            className={`absolute top-1 bottom-1 w-1/2 bg-blue-900 rounded-full transition-transform duration-300 ease-in-out ${
              activeTab === 'history' ? 'translate-x-full' : 'translate-x-0'
            }`}
          />
          
          {/* Analyse button */}
          <button
            onClick={() => setActiveTab('analyse')}
            className={`relative z-10 px-6 py-2 rounded-full font-medium transition-colors duration-300 ${
              activeTab === 'analyse'
                ? 'text-white'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            Analyse
          </button>
          
          {/* History button */}
          <button
            onClick={() => setActiveTab('history')}
            className={`relative z-10 px-6 py-2 rounded-full font-medium transition-colors duration-300 ${
              activeTab === 'history'
                ? 'text-white'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {activeTab === 'analyse' ? <ResumeUpload /> : <ResumeHistory />}
    </>
  );
}

export default App;