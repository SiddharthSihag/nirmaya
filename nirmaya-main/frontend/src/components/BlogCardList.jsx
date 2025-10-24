import React from 'react'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'

const BlogCardList = ({ blog }) => {
    const navigate = useNavigate()
    const date = new Date(blog.createdAt)
    const formattedDate = date.toLocaleDateString("en-GB");
    return (
        <div className="bg-white dark:bg-gray-700 dark:border-gray-600 flex flex-col md:flex-row md:gap-10 p-5 rounded-2xl mt-6 shadow-lg border  transition-all">
            <div>
            <img src={blog.thumbnail} alt="" className='rounded-lg md:w-[300px] hover:scale-105 transition-all' />


            </div>
            <div>
                <h2 className="text-2xl font-semibold mt-3 md:mt-1">{blog.title}</h2>
                
                <h3 className='text-gray-500 mt-1 '>{blog.subtitle}</h3>
                            <p className="text-xs  mt-2">
                By {blog.author.firstName} | {blog.category} | {formattedDate}
            </p>
                <Button onClick={() => navigate(`/blogs/${blog._id}`)} className="mt-4   px-4 py-2 rounded-lg text-sm ">
                    Read More
                </Button>
            </div>
        </div>
    )
}

export default BlogCardList

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent } from "./ui/card";
// import { Avatar, AvatarImage } from "./ui/avatar";
// import userLogo from "../assets/user.jpg";

// const BlogCardList = ({ blog }) => {
//   const navigate = useNavigate();

//   const changeTimeFormat = (isoDate) => {
//     const date = new Date(isoDate);
//     const options = { day: "numeric", month: "long", year: "numeric" };
//     return date.toLocaleDateString("en-GB", options);
//   };

//   return (
//     <Card
//       onClick={() => navigate(`/blogs/${blog._id}`)}
//       className="mb-6 flex flex-col md:flex-row gap-6 cursor-pointer hover:shadow-xl transition-all dark:bg-gray-800 bg-white rounded-xl overflow-hidden"
//     >
//       {/* Thumbnail Image */}
//       <div className="md:w-[300px] w-full h-[200px] flex-shrink-0">
//         <img
//           src={blog.thumbnail}
//           alt={blog.title}
//           className="w-full h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
//         />
//       </div>

//       {/* Blog Content */}
//       <CardContent className="flex flex-col justify-between p-4">
//         <div>
//           <h1 className="text-xl md:text-2xl font-semibold mb-2 line-clamp-2 dark:text-white">
//             {blog.title}
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
//             {blog.subtitle}
//           </p>

//           <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
//             <span>Published on {changeTimeFormat(blog.createdAt)}</span>
//           </div>
//         </div>

//         {/* Author Info */}
//         <div className="flex items-center gap-3 mt-3">
//           <Avatar className="w-10 h-10 border">
//             <AvatarImage src={blog?.author?.photoUrl || userLogo} />
//           </Avatar>
//           <div>
//             <p className="font-medium dark:text-gray-100">
//               {blog?.author?.firstName} {blog?.author?.lastName}
//             </p>
//             {blog?.author?.occupation && (
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 {blog.author.occupation}
//               </p>
//             )}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default BlogCardList;

// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { Card, CardContent } from "./ui/card";
// import { Button } from "./ui/button";

// const BlogCardList = ({ blog }) => {
//   const navigate = useNavigate();

//   // Format date
//   const changeTimeFormat = (isoDate) => {
//     const date = new Date(isoDate);
//     const options = { day: "numeric", month: "long", year: "numeric" };
//     return date.toLocaleDateString("en-GB", options);
//   };

//   return (
//     <Card className="mb-6 dark:bg-gray-800 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
//       {/* Thumbnail */}
//       {blog?.thumbnail && (
//         <div
//           className="w-full h-56 md:h-64 overflow-hidden cursor-pointer"
//           onClick={() => navigate(`/blogs/${blog._id}`)}
//         >
//           <img
//             src={blog.thumbnail}
//             alt={blog.title}
//             className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
//           />
//         </div>
//       )}

//       {/* Blog Info */}
//       <CardContent className="p-6">
//         {/* Title */}
//         <h1
//           className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors cursor-pointer"
//           onClick={() => navigate(`/blogs/${blog._id}`)}
//         >
//           {blog.title}
//         </h1>

//         {/* Subtitle */}
//         <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
//           {blog.subtitle}
//         </p>

//         {/* Author Info */}
//         <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
//           Written by{" "}
//           <span className="font-medium text-gray-800 dark:text-gray-200">
//             {blog?.author?.firstName} {blog?.author?.lastName}
//           </span>{" "}
//           on {changeTimeFormat(blog.createdAt)}
//         </p>

//         {/* Read More */}
//         <Button
//           onClick={() => navigate(`/blogs/${blog._id}`)}
//           className="bg-blue-600 hover:bg-blue-700 text-white"
//         >
//           Read More
//         </Button>
//       </CardContent>
//     </Card>
//   );
// };

// export default BlogCardList;
