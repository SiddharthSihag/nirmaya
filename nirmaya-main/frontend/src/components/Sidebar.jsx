
import { ChartColumnBig, FolderPlus, SquareUser } from 'lucide-react';
import { LiaCommentSolid } from "react-icons/lia";
import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaEdit, FaRegEdit } from 'react-icons/fa';
import { MdBookmark } from "react-icons/md";
import { FaHeart } from 'react-icons/fa6';

const Sidebar = ({ user }) => {
  return (
    <div className="hidden mt-10 fixed md:block border-r-2 dark:bg-gray-800 bg-white border-gray-300 dark:border-gray-600 w-[310px] p-10 space-y-2 h-screen z-10">

      <div className="text-center pt-10 px-3 space-y-2">
        {/* Common for all users */}
        <NavLink
          to="/dashboard/profile"
          className={({ isActive }) =>
            `text-xl whitespace-nowrap ${
              isActive
                ? "bg-gray-800 dark:bg-gray-900 text-gray-200"
                : "bg-transparent"
            } flex items-center gap-3 font-semibold cursor-pointer p-3 rounded-2xl w-full transition`
          }
        >
          <SquareUser />
          <span>My Profile</span>
        </NavLink>

        {user?.role === "author" ? (
          <>
            {/* Author-only */}
            <NavLink
              to="/dashboard/stats-details"
              className={({ isActive }) =>
                `text-xl whitespace-nowrap ${
                  isActive
                    ? "bg-gray-800 dark:bg-gray-900 text-gray-200"
                    : "bg-transparent"
                } flex items-center gap-3 font-semibold cursor-pointer p-3 rounded-2xl w-full transition`
              }
            >
              <ChartColumnBig />
              <span>My Articles</span>
            </NavLink>

            <NavLink
              to="/dashboard/comments"
              className={({ isActive }) =>
                `text-xl whitespace-nowrap ${
                  isActive
                    ? "bg-gray-800 dark:bg-gray-900 text-gray-200"
                    : "bg-transparent"
                } flex items-center gap-3 font-semibold cursor-pointer p-3 rounded-2xl w-full transition`
              }
            >
              <LiaCommentSolid />
              <span>Comments</span>
            </NavLink>

            <NavLink
              to="/dashboard/write-blog"
              className={({ isActive }) =>
                `text-xl whitespace-nowrap ${
                  isActive
                    ? "bg-gray-800 dark:bg-gray-900 text-gray-200"
                    : "bg-transparent"
                } flex items-center gap-3 font-semibold cursor-pointer p-3 rounded-2xl w-full transition`
              }
            >
              <FaRegEdit />
              <span>Write Article</span>
            </NavLink>
          </>
        ) : (
          <>
            {/* Reader-only */}
            <NavLink
              to="/dashboard/liked"
              className={({ isActive }) =>
                `text-xl whitespace-nowrap ${
                  isActive
                    ? "bg-gray-800 dark:bg-gray-900 text-gray-200"
                    : "bg-transparent"
                } flex items-center gap-3 font-semibold cursor-pointer p-3 rounded-2xl w-full transition`
              }
            >
              <FaHeart />
              <span>Liked</span>
            </NavLink>

            <NavLink
              to="/dashboard/my-comments"
              className={({ isActive }) =>
                `text-xl whitespace-nowrap ${
                  isActive
                    ? "bg-gray-800 dark:bg-gray-900 text-gray-200"
                    : "bg-transparent"
                } flex items-center gap-3 font-semibold cursor-pointer p-3 rounded-2xl w-full transition`
              }
            >
              <LiaCommentSolid />
              <span>My Comments</span>
            </NavLink>

            <NavLink
              to="/dashboard/saved"
              className={({ isActive }) =>
                `text-xl whitespace-nowrap ${
                  isActive
                    ? "bg-gray-800 dark:bg-gray-900 text-gray-200"
                    : "bg-transparent"
                } flex items-center gap-3 font-semibold cursor-pointer p-3 rounded-2xl w-full transition`
              }
            >
              <MdBookmark />
              <span>Saved</span>
            </NavLink>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
