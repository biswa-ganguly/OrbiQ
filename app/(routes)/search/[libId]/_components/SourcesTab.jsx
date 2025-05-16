import React from "react";

function SourcesTab({ chat }) {
  if (!chat?.searchResult || chat.searchResult.length === 0) {
    return <p className="text-gray-500">No sources found.</p>;
  }

  return (
    <div className="space-y-4">
      {chat.searchResult.map((item, idx) => (
        <div
          key={idx}
          className="p-4 border border-gray-200 rounded-md hover:shadow-sm transition-shadow flex items-start space-x-4"
        >
          { (item.img || item.thumbnail) && (
            <img
              src={item.img || item.thumbnail}
              alt={item.title || "source icon"}
              className="w-10 h-10 object-cover rounded"
            />
          )}

          <div className="flex-1">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-lg font-semibold hover:underline flex items-center"
            >
              {item.title || item.long_name || "Untitled Source"}
            </a>
            {item.long_name && (
              <p className="text-sm text-gray-400 mt-1">{item.long_name}</p>
            )}
            {item.description && (
              <p className="mt-2 text-gray-700 text-sm line-clamp-3">
                <span dangerouslySetInnerHTML={{ __html: item.description }} />
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SourcesTab;
