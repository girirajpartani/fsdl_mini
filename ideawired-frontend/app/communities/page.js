"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAPI } from "../../lib/api";

export default function Communities() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchAPI("/communities", "GET", null, token)
      .then((data) => {
        setCommunities(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching communities:", error);
        setLoading(false);
      });
  }, [router]);

  const followCommunity = async (id) => {
    try {
      console.log("Following community:", id);
      const token = localStorage.getItem("token");
      const response = await fetchAPI(`/communities/${id}/follow`, "POST", null, token);
      console.log("Follow response:", response);
      
      // Update local state to reflect the change
      setCommunities(communities.map(c => 
        c._id === id ? { ...c, isFollowed: true } : c
      ));
    } catch (error) {
      console.error("Error following community:", error);
    }
  };

  const unfollowCommunity = async (id) => {
    try {
      console.log("Unfollowing community:", id);
      const token = localStorage.getItem("token");
      console.log("Token:", token ? "present" : "missing");
      const response = await fetchAPI(`/communities/${id}/follow`, "DELETE", null, token);
      console.log("Unfollow response:", response);
      
      // Update local state to reflect the change
      setCommunities(communities.map(c => 
        c._id === id ? { ...c, isFollowed: false } : c
      ));
    } catch (error) {
      console.error("Error unfollowing community:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Communities
        </h2>

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
                      e.stopPropagation(); // Prevent navigation when clicking follow button
                      c.isFollowed ? unfollowCommunity(c._id) : followCommunity(c._id);
                    }}
                    className={`w-full font-medium py-2 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      c.isFollowed 
                        ? "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500" 
                        : "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"
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
    </div>
  );
}