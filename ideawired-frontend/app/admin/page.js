"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "../../lib/api";

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [flaggedArticles, setFlaggedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [articleId, setArticleId] = useState("");
  const [reason, setReason] = useState("");

  const fetchAdminData = async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "admin") {
      router.push("/login");
      return;
    }

    try {
      setLoading(true);

      const [statsData, flaggedData] = await Promise.all([
        fetchAPI("/admin/stats", "GET", null, token),
        fetchAPI("/articles/flagged", "GET", null, token),
      ]);

      setStats(statsData);
      setFlaggedArticles(flaggedData);
    } catch (error) {
      console.error("Error loading admin dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [router]);

  const handleFlagArticle = async (event) => {
    event.preventDefault();

    if (!articleId.trim()) return;

    try {
      setActionLoading(true);
      const token = localStorage.getItem("token");

      await fetchAPI(
        `/articles/${articleId.trim()}/flag`,
        "POST",
        { reason: reason.trim() },
        token
      );

      setArticleId("");
      setReason("");
      await fetchAdminData();
    } catch (error) {
      console.error("Error flagging article:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm("Delete this article?")) return;

    try {
      const token = localStorage.getItem("token");
      await fetchAPI(`/articles/admin/${id}`, "DELETE", null, token);
      await fetchAdminData();
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-88px)] bg-gray-50 dark:bg-gray-900 px-4 py-12">
        <div className="mx-auto max-w-6xl text-center text-gray-600 dark:text-gray-400">
          Loading admin dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-88px)] bg-gray-50 dark:bg-gray-900 px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
            Admin Dashboard
          </p>
          <h1 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
            Moderation and platform stats
          </h1>
        </div>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-md ring-1 ring-gray-200 dark:ring-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Users</p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {stats?.totalUsers ?? 0}
            </p>
          </div>
          <div className="rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-md ring-1 ring-gray-200 dark:ring-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Articles</p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {stats?.totalArticles ?? 0}
            </p>
          </div>
          <div className="rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-md ring-1 ring-gray-200 dark:ring-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Flagged</p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {stats?.flaggedArticles ?? 0}
            </p>
          </div>
        </section>

        <section className="rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-md ring-1 ring-gray-200 dark:ring-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Flag an article</h2>
          <form onSubmit={handleFlagArticle} className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            <input
              value={articleId}
              onChange={(e) => setArticleId(e.target.value)}
              placeholder="Article ID"
              className="rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Reason"
              className="rounded-2xl border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
            <button
              type="submit"
              disabled={actionLoading}
              className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
            >
              {actionLoading ? "Flagging..." : "Flag"}
            </button>
          </form>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Flagged articles</h2>

          {flaggedArticles.length > 0 ? (
            <div className="space-y-4">
              {flaggedArticles.map((article) => (
                <div
                  key={article._id}
                  className="rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-md ring-1 ring-gray-200 dark:ring-gray-700"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {article.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        By {article.author?.username || "Unknown"}
                      </p>
                      <p className="mt-3 text-gray-700 dark:text-gray-300 line-clamp-3">
                        {article.content}
                      </p>
                    </div>

                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => router.push(`/article/${article._id}`)}
                        className="rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(article._id)}
                        className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <span>Flags: {article.flags?.length || 0}</span>
                    <span>Likes: {article.likes?.length || 0}</span>
                    <span>Bookmarks: {article.bookmarks?.length || 0}</span>
                  </div>

                  {article.flags?.length > 0 && (
                    <div className="mt-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Latest reason</p>
                      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                        {article.flags[article.flags.length - 1]?.reason || "No reason provided"}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-white dark:bg-gray-800 p-6 text-gray-600 shadow-md ring-1 ring-gray-200 dark:ring-gray-700">
              No flagged articles yet.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}