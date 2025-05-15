import { LucideImage, LucideInfo, LucideList, LucideSparkles, LucideVideo } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import AnswerDisplay from './AnswerDisplay';

const tabs = [
  { label: 'Answer', icon: LucideSparkles },
  { label: 'Images', icon: LucideImage },
  { label: 'Videos', icon: LucideVideo },
  { label: 'Sources', icon: LucideList },
];

function DisplayResult({ searchInputRecord }) {
  const [activeTab, setActiveTab] = useState('Answer');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch from API when searchInputRecord changes
  useEffect(() => {
    if (!searchInputRecord?.searchInput) return;
  
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/google-search-api?q=${encodeURIComponent(searchInputRecord.searchInput)}`);
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }
        const data = await res.json();
  
        // Console log the full data object stringified for better visibility
        console.log('Fetched data:', JSON.stringify(data, null, 2));
  
        setResults(data);
      } catch (err) {
        console.error('Search API Error:', err);
        setError(err.message || 'Failed to fetch search results');
      } finally {
        setLoading(false);
      }
    };
  
    fetchResults();
  }, [searchInputRecord]);
  
  return (
    <div>
      <div className='mt-7'>
        <h2 className='font-medium text-3xl line-clamp-2'>{searchInputRecord?.searchInput}</h2>
        
        <div className="flex items-center space-x-6 border-b border-gray-200 pb-2 mt-6">
          {tabs.map(({ label, icon: Icon, badge }) => (
            <button
              key={label}
              onClick={() => setActiveTab(label)}
              className={`flex items-center gap-1 relative text-sm font-medium text-gray-700 hover:text-black ${activeTab === label ? 'text-black' : ''}`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
              {badge && (
                <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                  {badge}
                </span>
              )}
              {activeTab === label && (
                <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-black rounded"></span>
              )}
            </button>
          ))}
          <div className="ml-auto text-sm text-gray-500">
            1 task <span className="ml-1">↗</span>
          </div>
        </div>

        <div className="mt-4">
          {activeTab === 'Answer' && (
            <AnswerDisplay results={results} loading={loading} error={error} />
          )}
          {activeTab === 'Images' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-4">
              {results.filter(item => item.pagemap?.cse_image?.[0]?.src).map((item, index) => (
                <a 
                  key={index}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                    <img 
                      src={item.pagemap?.cse_image?.[0]?.src} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                      onError={(e) => {e.target.src = '/api/placeholder/400/400'}}
                    />
                  </div>
                  <p className="text-xs text-gray-700 mt-1 line-clamp-2 group-hover:text-blue-600">
                    {item.title}
                  </p>
                </a>
              ))}
              {loading && (
                <div className="col-span-full flex justify-center py-8">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                </div>
              )}
              {(!loading && (!results || results.length === 0)) && (
                <div className="col-span-full py-8 text-center text-gray-500">
                  No image results found
                </div>
              )}
            </div>
          )}
          {activeTab === 'Videos' && (
            <div className="py-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Video search functionality coming soon
                </div>
              )}
            </div>
          )}
          {activeTab === 'Sources' && (
            <div className="py-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {results.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center mr-3 text-xs text-gray-700">
                        {index + 1}
                      </div>
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {item.displayLink}
                      </a>
                    </div>
                  ))}
                  {(!results || results.length === 0) && (
                    <div className="text-center py-4 text-gray-500">
                      No sources found
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DisplayResult;