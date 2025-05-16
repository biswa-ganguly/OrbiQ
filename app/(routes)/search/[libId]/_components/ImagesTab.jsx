import Image from 'next/image'
import React from 'react'

function ImagesTab({chat}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {chat.searchResult.map((item, idx) => (
        item.img ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            key={idx}
            className="block rounded overflow-hidden shadow hover:shadow-lg transition"
          >
            <Image
              src={item.thumbnail||item?.img}
              alt={item.title || "Image"}
              width={200}
              height={100}
              className="object-cover w-full h-48"
              unoptimized // optional, if using external URLs and no loader configured
            />
            <p className="text-sm mt-1 truncate">{item.title}</p>
          </a>
        ) : null
      ))}
    </div>
  )
}

export default ImagesTab