import Image from 'next/image';
import React, { useState } from 'react';

function SourceList({ webResult, loadingSearch }) {
  const skeletonCount = 6;
  const initialVisibleCount = 4; // show first 4 items on small screens
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);

  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 640;
  const showLoadMore = isSmallScreen && visibleCount < webResult.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 4); // load 4 more at a time
  };

  const visibleResults = isSmallScreen
    ? webResult.slice(0, visibleCount)
    : webResult;

  return (
    <div>
      <div className="flex gap-4 flex-wrap justify-center sm:justify-start">
        {loadingSearch
          ? Array.from({ length: skeletonCount }).map((_, idx) => (
              <div
                key={idx}
                className="p-3 bg-accent rounded-lg w-full sm:w-[200px] animate-pulse"
              >
                <div className="flex gap-2 items-center">
                  <div className="bg-gray-300 rounded-full w-5 h-5" />
                  <div className="bg-gray-300 rounded w-24 h-3" />
                </div>
                <div className="bg-gray-300 rounded w-full h-10 mt-2" />
              </div>
            ))
          : visibleResults.map((item, index) => (
              <div
                key={index}
                className="p-3 bg-accent rounded-lg w-full sm:w-[200px] cursor-pointer hover:bg-[#e1e3da]"
                onClick={() => window.open(item.url, '_blank')}
              >
                <div className="flex gap-2 items-center">
                  <Image
                    src={item?.img}
                    alt={item?.name || 'icon'}
                    width={20}
                    height={20}
                  />
                  <h2 className="text-xs text-gray-500">{item?.long_name}</h2>
                </div>
                <h2 className="line-clamp-2 text-black text-xs mt-1">
                  {item?.description}
                </h2>
              </div>
            ))}
      </div>

      {/* Load More Button - only on small screens */}
      {showLoadMore && (
        <div className="mt-4 flex justify-center sm:hidden">
          <button
            onClick={handleLoadMore}
            className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default SourceList;
