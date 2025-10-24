import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const LikedBlogs = () => {
  const [liked, setLiked] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ loading state

  useEffect(() => {
    async function fetchLiked() {
      try {
        const res = await axios.get("http://localhost:8000/api/v1/user/liked", {
          withCredentials: true,
        });
        setLiked(res.data.likedArticles || []);
      } catch (error) {
        console.error("Error fetching liked blogs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLiked();
  }, []);

  // ✅ Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin"></div>
        <p className="text-gray-600 text-lg font-semibold animate-pulse">
          Loading your liked blogs...
        </p>
      </div>
    );
  }

  return (
    <div className="pt-20 md:ml-[320px] p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ✅ Header */}
      <h1 className="text-3xl font-bold mb-8 text-center md:text-left text-gray-900 dark:text-white">
       ❤️ Liked Blogs 
      </h1>

      {/* ✅ If no liked blogs */}
      {liked.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          You haven’t liked any blogs yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {liked.map((blog) => (
            <div
              key={blog._id}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 
             rounded-xl overflow-hidden shadow-md hover:shadow-xl 
             transition-all duration-300 flex flex-col justify-between min-h-[350px]"
            >
              {/* Thumbnail */}
              {blog.thumbnail && (
                <img
                  src={blog.thumbnail}
                  alt={blog.title}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
              )}

              {/* Content */}
              <div className="p-4 flex flex-col justify-between h-full">
                <div>
                  <h2 className="text-lg md:text-xl font-semibold mb-2 line-clamp-2 text-gray-900 dark:text-gray-100">
                    {blog.title}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    By <span className="font-medium">{blog.author?.firstName} {blog.author?.lastName}</span>
                  </p>
                </div>

                <Link
                  to={`/blogs/${blog._id}`}
                  className="mt-4 inline-block text-blue-600 hover:text-blue-800 
                 dark:text-blue-400 dark:hover:text-blue-300 font-semibold text-sm transition-colors"
                >
                  Read more →
                </Link>
              </div>
            </div>

          ))}
        </div>
      )}
    </div>
  );
};

export default LikedBlogs;

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";

// const LikedBlogs = () => {
//   const [liked, setLiked] = useState([]);
//   const [loading, setLoading] = useState(true); // ✅ loading state

//   useEffect(() => {
//     async function fetchLiked() {
//       try {
//         const res = await axios.get("http://localhost:8000/api/v1/user/liked", { withCredentials: true });
//         setLiked(res.data.likedArticles || []);
//       } catch (error) {
//         console.error("Error fetching liked blogs:", error);
//       } finally {
//         setLoading(false); // ✅ stop loading after response
//       }
//     }
//     fetchLiked();
//   }, []);

//   // ✅ Loading spinner effect
//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
//         <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
//         <p className="text-gray-600 text-lg font-semibold animate-pulse">
//           Loading your liked blogs...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="pt-20 md:ml-[320px] p-6 min-h-screen">
//       <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
//         Liked Blogs ❤️
//       </h1>

//       {liked.length === 0 ? (
//         <p className="text-center text-gray-500 text-lg">No liked blogs yet.</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {liked.map((blog) => (
//             <div
//               key={blog._id}
//               className="border rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800"
//             >
//               {/* ✅ Thumbnail */}
//               {blog.thumbnail && (
//                 <img
//                   src={blog.thumbnail}
//                   alt={blog.title}
//                   className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
//                 />
//               )}

//               {/* ✅ Blog Info */}
//               <div className="p-4 flex flex-col justify-between h-full">
//                 <div>
//                   <h2 className="text-xl font-semibold mb-2 line-clamp-2">
//                     {blog.title}
//                   </h2>
//                   <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
//                     By {blog.author?.firstName} {blog.author?.lastName}
//                   </p>
//                 </div>

//                 <Link
//                   to={`/blogs/${blog._id}`}
//                   className="text-blue-500 hover:text-blue-700 text-sm font-semibold mt-3 inline-block"
//                 >
//                   Read more →
//                 </Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default LikedBlogs;

