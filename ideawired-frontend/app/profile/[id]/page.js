"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchAPI } from "../../../lib/api";
import ArticleCard from "../../../components/ArticleCard";

export default function ProfilePage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await fetchAPI(`/users/${userId}`, "GET", null, token);
        setProfile(data);
      } catch (fetchError) {
        console.error("Error loading profile:", fetchError);
        setError("Unable to load this profile right now.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadProfile();
    }
  }, [router, userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-gray-600 dark:text-gray-400">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Profile unavailable
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

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-8">
        <button
          onClick={() => router.back()}
          className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← Back
        </button>

        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2">
                User Profile
              </p>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {profile.user.username}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Joined {new Date(profile.user.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>

            <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile.articleCount}
                </p>
                <p>Articles</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {profile.user.role}
                </p>
                <p>Role</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Articles by {profile.user.username}
            </h2>
          </div>

          {profile.articles.length > 0 ? (
            <div className="space-y-6">
              {profile.articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-gray-600 dark:text-gray-400">
              This user has not written any articles yet.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}