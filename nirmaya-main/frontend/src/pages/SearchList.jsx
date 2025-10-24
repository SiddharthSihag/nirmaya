// import BlogCard from '../components/BlogCard';
// import React, { useEffect } from 'react'
// import { useSelector } from 'react-redux';
// import { useLocation } from 'react-router-dom';

// const SearchList = () => {
//     const location = useLocation();
//     const params = new URLSearchParams(location.search);
//     const query = params.get('q');
//     const { blog } = useSelector(store => store.blog)

//     console.log(blog);


//     const filteredBlogs = blog.filter(
//         (blog) =>
//             blog.title.toLowerCase().includes(query) ||
//             blog.subtitle.toLowerCase().includes(query) ||
//             blog.category.toLowerCase() === query.toLowerCase()
//     );
   
//     useEffect(()=>{
//         window.scrollTo(0,0)
//     },[])
//     return (
//         <div className='pt-32'>
//             <div className='max-w-6xl mx-auto'>
//                 <h2 className='mb-5'>Search Results for: "{query}"</h2>
//                 {/* Here you can fetch data or display filtered results based on the query */}
//                 <div className='grid grid-cols-3 gap-7 my-10'>
//                     {
//                         filteredBlogs.map((blog, index) => {
//                             return <BlogCard  blog={blog} />
//                         })
//                     }

//                 </div>

//             </div>
//         </div>
//     )
// }

// export default SearchList

import BlogCard from '../components/BlogCard';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const SearchList = () => {
  const location = useLocation();
    const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const query = params.get('q')?.toLowerCase() || ''; // ✅ handle null safely

  const { blog } = useSelector(store => store.blog);

  // ✅ Safe filtering with optional chaining
  const filteredBlogs = blog.filter((b) => {
    const titleMatch = b?.title?.toLowerCase()?.includes(query);
    const subtitleMatch = b?.subtitle?.toLowerCase()?.includes(query);
    const categoryMatch = b?.category?.toLowerCase() === query;
    const authorMatch = b?.author?.firstName?.toLowerCase()?.includes(query);

    return titleMatch || subtitleMatch || categoryMatch || authorMatch;
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32">
      <div className="max-w-6xl mx-auto">
                {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-5 py-2.5 rounded-full hover:bg-gray-900 transition-all shadow-md hover:shadow-lg mb-10"
        >
              ← Back
        </button>
        <h2 className="mb-5">Search Results for: "{query}"</h2>

        {filteredBlogs.length === 0 ? (
          <p className="text-gray-500">No results found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 my-10">
            {filteredBlogs.map((blog, index) => (
              <BlogCard key={index} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchList;

