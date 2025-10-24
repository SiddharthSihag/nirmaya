import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const SavedBlogs = () => {
  const [saved, setSaved] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Loading state

  useEffect(() => {
    async function fetchSaved() {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/user/saved", {
          withCredentials: true,
        });
        setSaved(res.data.savedArticles);
      } catch (error) {
        console.error("Error fetching saved blogs:", error);
      } finally {
        setLoading(false); // ✅ End loading
      }
    }
    fetchSaved();
  }, []);

  // ✅ Loading Spinner UI
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>

        {/* Loading Text */}
        <p className="text-gray-600 text-lg font-semibold animate-pulse">
          Loading your saved blogs...
        </p>
      </div>
    );
  }

  return (
    <div className="pt-20 md:ml-[320px] p-6">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6">📚 Saved Blogs </h1>

      {/* No blogs */}
      {saved.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          You haven’t saved any blogs yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {saved.map((blog) => (
            <div
              key={blog._id}
              className="border rounded-lg p-4 shadow hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white dark:bg-gray-800"
            >
              {/* ✅ Blog Thumbnail */}
              {blog.thumbnail && (
                <img
                  src={blog.thumbnail}
                  alt={blog.title}
                  className="w-full h-48 object-cover rounded-md mb-3 hover:scale-105 transition-transform duration-300"
                />
              )}

              {/* ✅ Blog Title */}
              <h2 className="text-xl font-semibold mb-2 line-clamp-1 dark:text-white">
                {blog.title}
              </h2>

              {/* ✅ Blog Meta Info */}
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                By {blog.author?.firstName} {blog.author?.lastName}
              </p>

              {/* ✅ Read More Button */}
              <Link
                to={`/blogs/${blog._id}`}
                className="text-blue-600 font-medium hover:underline transition"
              >
                Read more →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedBlogs;
