import React from 'react'
import { Button } from './ui/button'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaHeart, FaCommentDots } from "react-icons/fa"

const BlogCard = ({ blog }) => {
  const navigate = useNavigate()
  const date = new Date(blog.createdAt)
  const formattedDate = date.toLocaleDateString("en-GB")

  return (
    <div className="bg-white dark:bg-gray-800 dark:border-gray-700 p-3 rounded-xl shadow-md border hover:shadow-lg hover:scale-[1.03] transition-all duration-300 cursor-pointer flex flex-col justify-between h-full">

      {/* Top content (Thumbnail, Title, Subtitle, etc.) */}
      <div>
        <img
          src={blog.thumbnail}
          alt={blog.title}
          className="rounded-lg w-full h-32 object-cover mb-2"
        />

        <p className="text-xs text-gray-500 mt-1">
          By {blog.author.firstName} | {blog.category} | {formattedDate}
        </p>

        <h2 className="text-base font-semibold mt-1 line-clamp-1">
          {blog.title}
        </h2>

        <h3 className="text-sm text-gray-500 mt-1 line-clamp-2">
          {blog.subtitle}
        </h3>

        <Button
          onClick={() => navigate(`/blogs/${blog._id}`)}
          className="mt-3 text-xs px-3 py-1.5 rounded-md"
        >
          Read More
        </Button>
      </div>

      {/* Bottom (Stats Section) */}
      <div className="flex items-center gap-4 mt-5 text-gray-600 text-xs">
        <div className="flex items-center gap-1">
          <FaEye className="text-gray-500" />
          <span>{blog.views || 0}</span>
        </div>

        <div className="flex items-center gap-1">
          <FaHeart className="text-red-500" />
          <span>{Array.isArray(blog.likes) ? blog.likes.length : blog.likes || 0}</span>
        </div>

        <div className="flex items-center gap-1">
          <FaCommentDots className="text-blue-500" />
          <span>{blog.comments?.length || 0}</span>
        </div>
      </div>
    </div>
  )
}

export default BlogCard
