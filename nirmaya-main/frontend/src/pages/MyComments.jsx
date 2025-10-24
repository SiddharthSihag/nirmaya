import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Card } from "../components/ui/card";

const MyComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/user/my-comments", {
          withCredentials: true,
        });
        if (res.data.success) {
          setComments(res.data.comments);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  // ✅ Loading spinner effect (centered)
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        {/* Spinning Loader */}
        <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>

        {/* Loading Text */}
        <p className="text-gray-600 text-lg font-semibold animate-pulse">
          Loading your comments...
        </p>
      </div>
    );
  }

  return (
    <div className="pt-20 md:ml-[320px] p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">💬 My Comments</h1>

        {comments.length === 0 ? (
          <p className="text-gray-500 text-center mt-10">
            You haven’t commented on any blogs yet.
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card
                key={comment._id}
                className="p-4 flex flex-col md:flex-row md:items-center gap-4 hover:shadow-lg transition-shadow duration-300"
              >
                {/* ✅ Thumbnail */}
                {comment.postId?.thumbnail && (
                  <img
                    src={comment.postId.thumbnail}
                    alt={comment.postId.title}
                    className="w-24 h-16 rounded-md object-cover hover:scale-105 transition-transform duration-300"
                  />
                )}

                {/* ✅ Comment Content */}
                <div className="flex-1">
                  <p className="text-gray-800 dark:text-gray-200 line-clamp-2">{comment.content}</p>

                  <div className="text-sm text-gray-500 flex justify-between mt-2">
                    <span>📝 {comment.postId?.title || "Deleted Blog"}</span>
                    <Link
                      to={`/blogs/${comment.postId?._id}#comment-${comment._id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyComments;
