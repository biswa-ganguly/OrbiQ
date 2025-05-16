import React from 'react';
import ReactMarkdown from 'react-markdown';

function DisplaySummery({ aiResp, loading }) {
  // Skeleton UI: mimics paragraphs and headings with pulsing grey blocks
  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 w-3/4 bg-gray-300 rounded"></div> {/* Simulate h1 */}
        <div className="h-8 w-1/2 bg-gray-300 rounded"></div>  {/* Simulate h2 */}
        <div className="h-6 w-2/3 bg-gray-300 rounded"></div>  {/* Simulate h3 */}
        <div className="h-4 w-full bg-gray-300 rounded"></div>  {/* Paragraph lines */}
        <div className="h-4 w-full bg-gray-300 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
      </div>
    );
  }

  return (
    <div>
      <ReactMarkdown
        components={{
          h1: ({ node, ...props }) => (
            <h1 className="text-4xl font-bold text-blue-900 mb-4 leading-snug" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-3xl font-semibold text-blue-700 mb-3 leading-snug" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <h3 className="text-2xl font-semibold text-blue-600 mt-4 mb-2 leading-tight" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="text-gray-700 leading-relaxed mb-4" {...props} />
          ),
          a: ({ node, ...props }) => (
            <a
              className="text-blue-600 underline hover:text-blue-800"
              target="_blank"
              rel="noreferrer"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc list-inside space-y-2 leading-relaxed" {...props} />
          ),
          li: ({ node, ...props }) => <li className="mb-1" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="bg-gray-100 p-4 rounded-lg text-gray-700 leading-relaxed mb-6" {...props} />
          ),
          table: ({ node, ...props }) => (
            <table className="table-auto w-full text-sm text-gray-700 border-collapse border border-gray-300" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-left" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border border-gray-300 px-4 py-2" {...props} />
          ),
          code: ({ node, inline, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={okaidia}
                language={match[1]}
                PreTag="div"
                className="rounded-md overflow-auto"
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-gray-100 p-1 rounded-md" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {aiResp}
      </ReactMarkdown>
    </div>
  );
}

export default DisplaySummery;
