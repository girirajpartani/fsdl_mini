"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { fetchAPI } from "../lib/api";

export default function ArticleCard({ article }) {
  const router = useRouter();
  const [liked, setLiked] = useState(article?.isLiked || false);
  const [bookmarked, setBookmarked] = useState(article?.isBookmarked || false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // LIKE
  const handleLike = async () => {
    try {
      setLiked((prev) => !prev);
      const token = localStorage.getItem("token");

      await fetchAPI(`/articles/${article._id}/like`, "POST", null, token);
    } catch (err) {
      console.error(err);
    }
  };

  // BOOKMARK
  const handleBookmark = async () => {
    try {
      setBookmarked((prev) => !prev);
      const token = localStorage.getItem("token");


      await fetchAPI(`/articles/${article._id}/bookmark`, "POST", null, token);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">

        {/* TITLE */}
        <div className="mb-4">
          <button
            onClick={() => router.push(`/article/${article._id}`)}
            className="text-left"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {article.title}
            </h3>
          </button>

          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <button
              onClick={() => router.push(`/profile/${article.author?._id}`)}
              className="font-medium hover:text-blue-600 dark:hover:text-blue-400"
            >
              {article.author?.username}
            </button>
            <span>•</span>
            <span>in {article.community?.name}</span>
            <span>•</span>
            <span>{formatDate(article.createdAt)}</span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="text-gray-700 dark:text-gray-300 mb-4">
          {article.content && article.content.length > 200
            ? `${article.content.substring(0, 200)}...`
            : article.content}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">

          <div className="flex items-center space-x-6 text-sm">

            {/* LIKE */}
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 transition ${
                liked ? "text-red-500" : "text-gray-500"
              }`}
            >
              <span>❤️</span>
              <span>Like</span>
            </button>

            {/* COMMENT */}
            <button
              onClick={() => router.push(`/article/${article._id}`)}
              className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
            >
              <span>💬</span>
              <span>Comments</span>
            </button>

          </div>

          {/* BOOKMARK */}
          <button
            onClick={handleBookmark}
            className={`text-xl transition ${
              bookmarked ? "text-yellow-500" : "text-gray-400"
            }`}
          >
            🔖 Bookmark
          </button>

        </div>
      </div>
  );
}