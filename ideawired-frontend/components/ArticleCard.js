"use client";

export default function ArticleCard({ article }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 leading-tight">
            {article.title}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
            <span className="font-medium">{article.author?.username}</span>
            <span>•</span>
            <span>in {article.community?.name}</span>
            <span>•</span>
            <span>{formatDate(article.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
        {article.content && article.content.length > 200
          ? `${article.content.substring(0, 200)}...`
          : article.content
        }
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
          <button className="flex items-center space-x-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>Comments</span>
          </button>
        </div>

        <button className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </button>
      </div>
    </div>
  );
}