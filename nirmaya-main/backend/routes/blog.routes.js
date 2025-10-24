import express from "express"

import { isAuthenticated } from "../middleware/isAuthenticated.js"
import { isAuthor } from "../middleware/isAuthor.js"
import { singleUpload } from "../middleware/multer.js"
import {createBlog, deleteBlog, dislikeBlog, getAllBlogs, getMyTotalBlogLikes, getOwnBlogs, getPublishedBlog, likeBlog, togglePublishBlog, updateBlog,saveBlog,unsaveBlog,incrementBlogView,uploadImageHandler } from "../controllers/blog.controller.js"

import { upload } from "../middleware/multer.js";

const router = express.Router()
// ✅ Only authors can create blogs
router.post("/", isAuthenticated, isAuthor, createBlog);

// ✅ Only authors can update blogs
router.put("/:blogId", isAuthenticated, isAuthor, singleUpload, updateBlog);

// ✅ Only authors can publish/unpublish blogs
router.patch("/:blogId/toggle-publish", isAuthenticated, isAuthor, togglePublishBlog);

// ✅ Everyone can read blogs
router.get("/get-all-blogs", getAllBlogs);
router.get("/get-published-blogs", getPublishedBlog);

// ✅ Only logged-in users can see their own blogs
router.get("/get-own-blogs", isAuthenticated, getOwnBlogs);

// ✅ Only authors can delete blogs
router.delete("/:id", isAuthenticated, isAuthor, deleteBlog);

// ✅ Likes/dislikes → allowed for any logged-in user
router.get("/:id/like", isAuthenticated, likeBlog);
router.get("/:id/dislike", isAuthenticated, dislikeBlog);

//save/unsave 
router.get("/:id/save", isAuthenticated, saveBlog);
router.get("/:id/unsave", isAuthenticated, unsaveBlog);

// ✅ Logged-in users can check their total blog likes
router.get("/my-blogs/likes", isAuthenticated, getMyTotalBlogLikes);

//to increase the view count
router.put("/:id/view", incrementBlogView);

//to upload image in blog
router.post("/upload-image", upload.single("file"), uploadImageHandler);

export default router;