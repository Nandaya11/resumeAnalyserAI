import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

export default function ResumeHistory() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetched, setFetched] = useState(false);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://127.0.0.1:8000/resumes');
      if (!response.ok) throw new Error('Failed to fetch resumes');
      const data = await response.json();
      setResumes(data);
      setFetched(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch resumes when the component mounts
  useEffect(() => {
    fetchResumes();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRatingColor = (rating) => {
    if (!rating) return 'text-gray-500';
    if (rating >= 8) return 'text-green-600 font-semibold';
    if (rating >= 6) return 'text-blue-600 font-semibold';
    if (rating >= 4) return 'text-yellow-600 font-semibold';
    return 'text-red-600 font-semibold';
  };

  return (
    <div className="max-w-full mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Resume History</h1>
          <p className="text-gray-600 mt-1">View all uploaded resumes and their analysis</p>
        </div>
        
        <button
          onClick={fetchResumes}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">Error: {error}</p>
        </div>
      )}

      {!fetched && !loading && (
        <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <RefreshCw className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-2">No data loaded yet</p>
          <p className="text-gray-500 text-sm">Click the Refresh button to load resume history</p>
        </div>
      )}

      {fetched && !loading && (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto border border-gray-200">
          <table className="min-w-[900px] w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <th className="px-8 py-5 text-left text-xl font-semibold text-gray-700 uppercase tracking-wider">
                  Filename
                </th>
                <th className="px-8 py-5 text-left text-xl font-semibold text-gray-700 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-8 py-5 text-left text-xl font-semibold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-8 py-5 text-left text-xl font-semibold text-gray-700 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-8 py-5 text-left text-xl font-semibold text-gray-700 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-8 py-5 text-left text-xl font-semibold text-gray-700 uppercase tracking-wider">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {resumes.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-12 text-center">
                    <div className="text-gray-500">
                      <p className="text-lg font-medium mb-1">No resumes found</p>
                      <p className="text-sm">Upload some resumes to see them here</p>
                    </div>
                  </td>
                </tr>
              ) : (
                resumes.map((resume) => (
                  <tr key={resume.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-8 py-5 text-xl font-medium text-gray-900">
                      {resume.filename}
                    </td>
                    <td className="px-8 py-5 text-xl text-gray-700">
                      {resume.name || <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-8 py-5 text-xl text-gray-700">
                      {resume.email || <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-8 py-5 text-xl text-gray-700">
                      {resume.phone || <span className="text-gray-400">-</span>}
                    </td>
                    <td className="px-8 py-5 text-xl text-gray-600">
                      {formatDate(resume.upload_date)}
                    </td>
                    <td className="px-8 py-5 text-xl">
                      {resume.resume_rating ? (
                        <span className={getRatingColor(resume.resume_rating)}>
                          {resume.resume_rating.toFixed(1)} / 10
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {fetched && resumes.length > 0 && (
        <div className="mt-4 text-sm text-gray-600 text-center">
          Showing {resumes.length} resume{resumes.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}
