"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "../../lib/api";

export default function Communities() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  // CREATE COMMUNITY STATE
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCommunity, setNewCommunity] = useState({
    name: "",
    description: "",
  });

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const data = await fetchAPI("/communities", "GET", null, token);
        setCommunities(data);
      } catch (error) {
        console.error("Error fetching communities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // FOLLOW
  const followCommunity = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await fetchAPI(`/communities/${id}/follow`, "POST", null, token);

      // ✅ FIXED (no stale state)
      setCommunities((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, isFollowed: true } : c
        )
      );
    } catch (error) {
      console.error("Error following community:", error);
    }
  };

  // UNFOLLOW
  const unfollowCommunity = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await fetchAPI(`/communities/${id}/follow`, "DELETE", null, token);

      // ✅ FIXED
      setCommunities((prev) =>
        prev.map((c) =>
          c._id === id ? { ...c, isFollowed: false } : c
        )
      );
    } catch (error) {
      console.error("Error unfollowing community:", error);
    }
  };

  // CREATE COMMUNITY
  const createCommunity = async () => {
    if (!newCommunity.name.trim()) return;

    try {
      const token = localStorage.getItem("token");

      const data = await fetchAPI(
        "/communities",
        "POST",
        newCommunity,
        token
      );

      // Add to UI instantly
      setCommunities((prev) => [data, ...prev]);

      setNewCommunity({ name: "", description: "" });
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating community:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Communities
          </h2>

          {/* CREATE BUTTON */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
          >
            + Create
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-600 dark:text-gray-400">
            Loading communities...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communities && communities.length > 0 ? (
              communities.map((c) => (
                <div
                  key={c._id}
                  onClick={() => router.push(`/communities/${c._id}`)}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 cursor-pointer"
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {c.name}
                  </h3>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      c.isFollowed
                        ? unfollowCommunity(c._id)
                        : followCommunity(c._id);
                    }}
                    className={`w-full font-medium py-2 px-4 rounded-md ${
                      c.isFollowed
                        ? "bg-gray-600 hover:bg-gray-700 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {c.isFollowed ? "Unfollow" : "Follow"}
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-600 dark:text-gray-400">
                No communities found.
              </div>
            )}
          </div>
        )}
      </div>

      {/* CREATE COMMUNITY MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96">

            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Create Community
            </h2>

            <input
              type="text"
              placeholder="Community Name"
              value={newCommunity.name}
              onChange={(e) =>
                setNewCommunity({
                  ...newCommunity,
                  name: e.target.value,
                })
              }
              className="w-full p-2 border rounded mb-3 dark:bg-gray-700 dark:text-white"
            />

            <textarea
              placeholder="Description"
              value={newCommunity.description}
              onChange={(e) =>
                setNewCommunity({
                  ...newCommunity,
                  description: e.target.value,
                })
              }
              className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={createCommunity}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}