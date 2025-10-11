import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <>
    <div className="flex  bg-blue-900 items-center justify-center shadow-xl h-32">
      <h1 className="text-5xl px-4 py-2 text-white">
        RESUME Analyser
      </h1>
    </div>
    </>
    <App />
  </StrictMode>,
)
