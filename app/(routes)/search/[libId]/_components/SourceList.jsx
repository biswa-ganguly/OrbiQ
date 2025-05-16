import Image from 'next/image';
import React from 'react';

function SourceList({ webResult, loadingSearch }) {
  // Number of skeleton items to show
  const skeletonCount = 6;

  return (
    <div>
      <div className='flex gap-4 flex-wrap'>
        {loadingSearch
          ? Array.from({ length: skeletonCount }).map((_, idx) => (
              <div
                key={idx}
                className="p-3 bg-accent rounded-lg w-[200px] animate-pulse"
              >
                <div className="flex gap-2 items-center">
                  <div className="bg-gray-300 rounded-full w-5 h-5" />
                  <div className="bg-gray-300 rounded w-24 h-3" />
                </div>
                <div className="bg-gray-300 rounded w-full h-10 mt-2" />
              </div>
            ))
          : webResult.map((item, index) => (
              <div
                key={index}
                className="p-3 bg-accent rounded-lg w-[200px] cursor-pointer hover:bg-[#e1e3da]"
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
    </div>
  );
}

export default SourceList;
