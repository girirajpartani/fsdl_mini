"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchAPI } from "../../../lib/api";

export default function ArticleDetailPage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id;

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  useEffect(() => {
    const loadArticle = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const [articleData, commentsData] = await Promise.all([
          fetchAPI(`/articles/${articleId}`, "GET", null, token),
          fetchAPI(`/comments/${articleId}`, "GET", null, token),
        ]);

        setArticle(articleData);
        setComments(commentsData);
      } catch (fetchError) {
        console.error("Error loading article:", fetchError);
        setError("Unable to load this article right now.");
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      loadArticle();
    }
  }, [articleId, router]);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    if (!commentText.trim()) return;

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");

      const createdComment = await fetchAPI(
        `/comments/${articleId}`,
        "POST",
        { text: commentText.trim() },
        token
      );

      setComments((prev) => [createdComment, ...prev]);
      setCommentText("");
    } catch (submitError) {
      console.error("Error posting comment:", submitError);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-gray-600 dark:text-gray-400">Loading article...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Article unavailable
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        <button
          onClick={() => router.back()}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← Back
        </button>

        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between gap-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => router.push(`/profile/${article.author?._id}`)}
                className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
              >
                {article.author?.username}
              </button>
              <span>•</span>
              <button
                onClick={() => router.push(`/communities/${article.community?._id}`)}
                className="hover:text-blue-600 dark:hover:text-blue-400"
              >
                in {article.community?.name}
              </button>
              <span>•</span>
              <span>{formatDate(article.createdAt)}</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span>{article.likes?.length || 0} likes</span>
              <span>{article.bookmarks?.length || 0} bookmarks</span>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {article.title}
          </h1>

          <div className="prose max-w-none prose-gray dark:prose-invert">
            <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-7">
              {article.content}
            </p>
          </div>
        </article>

        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Comments ({comments.length})
          </h2>

          <form onSubmit={handleCommentSubmit} className="mb-6 space-y-3">
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              rows={4}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                {submitting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </form>

          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className="rounded-lg border border-gray-200 dark:border-gray-700 p-4"
                >
                  <div className="flex items-center justify-between gap-4 mb-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {comment.user?.username || "Anonymous"}
                    </span>
                    <span>{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {comment.text}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                No comments yet. Be the first to respond.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}