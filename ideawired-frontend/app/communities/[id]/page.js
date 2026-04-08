"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchAPI } from "../../../lib/api";
import ArticleCard from "../../../components/ArticleCard";

export default function CommunityPage() {
  const [community, setCommunity] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newArticle, setNewArticle] = useState({ title: "", content: "" });
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const communityId = params.id;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch community details and articles
    Promise.all([
      fetchAPI(`/communities/${communityId}`),
      fetchAPI(`/articles/community/${communityId}`)
    ])
      .then(([communityData, articlesData]) => {
        setCommunity(communityData);
        setArticles(articlesData);
        console.log(communityData, articlesData);
        
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching community data:", error);
        setLoading(false);
      });
  }, [communityId, router]);

  const handleCreateArticle = async (e) => {
    e.preventDefault();
    if (!newArticle.title.trim() || !newArticle.content.trim()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const articleData = {
        title: newArticle.title.trim(),
        content: newArticle.content.trim(),
        communityId: communityId
      };

      const createdArticle = await fetchAPI("/articles", "POST", articleData, token);

      // Add the new article to the list
      setArticles([createdArticle, ...articles]);
      setNewArticle({ title: "", content: "" });
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating article:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const toggleFollow = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetchAPI(`/communities/${communityId}/follow`, "POST", null, token);

      // Update community follow status
      setCommunity(prev => ({ ...prev, isFollowed: response.isFollowed }));
    } catch (error) {
      console.error("Error toggling follow:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center text-gray-600 dark:text-gray-400">
          Loading community...
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Community not found
          </h1>
          <button
            onClick={() => router.push("/communities")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            Back to Communities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Community Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {community.name}
              </h1>
              {community.description && (
                <p className="text-gray-600 dark:text-gray-400">
                  {community.description}
                </p>
              )}
            </div>
            <button
              onClick={toggleFollow}
              className={`font-medium py-2 px-6 rounded-md transition-colors duration-200 ${
                community.isFollowed
                  ? "bg-gray-600 hover:bg-gray-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {community.isFollowed ? "Unfollow" : "Follow"}
            </button>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <span>{community.followers?.length || 0} followers</span>
            <span>•</span>
            <span>{articles.length} articles</span>
          </div>
        </div>

        {/* Create Article Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            {showCreateForm ? "Cancel" : "+ Write Article"}
          </button>
        </div>

        {/* Create Article Form */}
        {showCreateForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Create New Article
            </h2>
            <form onSubmit={handleCreateArticle}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={newArticle.title}
                  onChange={(e) => setNewArticle(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter article title..."
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content
                </label>
                <textarea
                  value={newArticle.content}
                  onChange={(e) => setNewArticle(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white h-32 resize-vertical"
                  placeholder="Write your article content..."
                  required
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                >
                  {submitting ? "Publishing..." : "Publish Article"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Articles List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Articles ({articles.length})
          </h2>

          {articles.length > 0 ? (
            articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))
          ) : (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No articles yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Be the first to write an article for this community!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}