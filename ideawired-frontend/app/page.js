"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "../lib/api";
import ArticleCard from "../components/ArticleCard";

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchAPI("/articles/feed", "GET", null, token)
      .then((data) => {
        setArticles(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching feed:", error);
        setLoading(false);
      });
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Your Feed
        </h1>

        {loading ? (
          <div className="text-center text-gray-600 dark:text-gray-400">
            Loading your feed...
          </div>
        ) : (
          <div className="space-y-6">
            {articles && articles.length > 0 ? (
              articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No articles in your feed yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Follow some communities to see articles from them here.
                </p>
                <button
                  onClick={() => router.push("/communities")}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                >
                  Browse Communities
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}