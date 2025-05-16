// ./_components/NewsCard.jsx
import React from 'react';

function NewsCard({ news, variant = "normal" }) {
  const isLarge = variant === "large";

  return (
    <div className={`bg-white rounded-2xl shadow-lg cursor-pointer overflow-hidden transition-transform duration-300 hover:scale-[1.02] ${isLarge ? 'col-span-2 row-span-2' : ''}`} onClick={()=>window.open(news?.url, "_blank")}>
      <img
        src={news?.thumbnail?.original ||news?.profile?.img }
        alt={news?.title}
        width={700}
        height={400}
        className={`w-full ${isLarge ? 'h-88' : 'h-48'} object-cover`}
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{news?.title}</h2>
        <p
          className="text-gray-600 text-sm line-clamp-3"
          dangerouslySetInnerHTML={{ __html: news?.description }}
        />
      </div>
    </div>
  );
}

export default NewsCard;
