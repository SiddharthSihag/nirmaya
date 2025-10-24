import { Blog } from "../models/blog.model.js";
import Comment from "../models/comment.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";
import { User } from "../models/user.model.js";

// Create a new blog post
export const createBlog = async (req,res) => {
    try {
        console.log("req.id:", req.id);
        const {title, category} = req.body;
        if(!title || !category) {
            return res.status(400).json({
                message:"Blog title and category is required."
            })
        }

        const blog = await Blog.create({
            title,
            category,
            author:req.id
        })

        return res.status(201).json({
            success:true,
            blog,
            message:"Blog Created Successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to create blog"
        })
    }
}

export const updateBlog = async (req, res) => {
    try {
      console.log("req.file:", req.file);
        const blogId = req.params.blogId
        const { title, subtitle, description, category } = req.body;
        const file = req.file;

        let blog = await Blog.findById(blogId).populate("author");
        if(!blog){
            return res.status(404).json({
                message:"Blog not found!"
            })
        }

        console.log("yaha tak code sahi chal raha hai")

        let thumbnail;
        try {
          if (file) {
            const fileUri = getDataUri(file)
             console.log("fileUri starts with:", fileUri.slice(0, 50)); // just to check the beginning
            thumbnail = await cloudinary.uploader.upload(fileUri)
              console.log("Cloudinary upload result:", thumbnail); // log full result
        }
        } catch (err) {
                  console.error("Cloudinary upload error:", err);
        return res.status(500).json({ 
            success: false, 
            message: "Image upload failed", 
            error: err.message 
        });
        }

        const updateData = {title, subtitle, description, category,author: req.id, thumbnail: thumbnail?.secure_url};
        blog = await Blog.findByIdAndUpdate(blogId, updateData, {new:true});

        res.status(200).json({ success: true, message: "Blog updated successfully", blog });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating blog", error: error.message });
    }
};

export const getAllBlogs = async (_, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 }).populate({
            path: 'author',
            select: 'firstName lastName photoUrl'
        }).populate({
            path: 'comments',
            sort: { createdAt: -1 },
            populate: {
                path: 'userId',
                select: 'firstName lastName photoUrl'
            }
        });
        res.status(200).json({ success: true, blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching blogs", error: error.message });
    }
};

export const getPublishedBlog = async (_, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "firstName lastName photoUrl occupation bio", // ✅ added occupation + bio
      })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: {
          path: "userId",
          select: "firstName lastName photoUrl",
        },
      });

    if (!blogs || blogs.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No published blogs found",
      });
    }

    return res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get published blogs",
    });
  }
};


export const togglePublishBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { publish } = req.query; // "true" or "false"

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found!",
      });
    }

    // Explicitly set based on query param
    blog.isPublished = publish === "true";
    await blog.save();

        if (!blog.isPublished) {
      await Comment.deleteMany({ postId: blog._id });
      console.log(`🗑 Deleted all comments for unpublished blog: ${blog.title}`);
    }

    const statusMessage = blog.isPublished ? "Published" : "Unpublished";
    return res.status(200).json({
      success: true,
      message: `Blog is ${statusMessage}`,
      blog,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update status",
      error: error.message,
    });
  }
};

export const getOwnBlogs = async (req, res) => {
    try {
        const userId = req.id; // Assuming `req.id` contains the authenticated user’s ID

        if (!userId) {
            return res.status(400).json({ message: "User ID is required." });
        }

        const blogs = await Blog.find({ author: userId }).populate({
            path: 'author',
            select: 'firstName lastName photoUrl'
        }).populate({
            path: 'comments',
            sort: { createdAt: -1 },
            populate: {
                path: 'userId',
                select: 'firstName lastName photoUrl'
            }
        });;

        if (!blogs) {
            return res.status(404).json({ message: "No blogs found.", blogs: [], success: false });
        }

        return res.status(200).json({ blogs, success: true });
    } catch (error) {
        res.status(500).json({ message: "Error fetching blogs", error: error.message });
    }
};

export const deleteBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const authorId = req.id
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ success: false, message: "Blog not found" });
        }
        if (blog.author.toString() !== authorId) {
            return res.status(403).json({ success: false, message: 'Unauthorized to delete this blog' });
        }

        // Delete blog
        await Blog.findByIdAndDelete(blogId);

        // Delete related comments
        await Comment.deleteMany({ postId: blogId });


        res.status(200).json({ success: true, message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting blog", error: error.message });
    }
};



export const likeBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.id;

    // ✅ Fetch blog and user
    const blog = await Blog.findById(blogId);
    const user = await User.findById(userId);

    if (!blog || !user) {
      return res.status(404).json({ success: false, message: "Blog or user not found" });
    }

    // ✅ Add user ID to Blog.likes
    await blog.updateOne({ $addToSet: { likes: userId } });

    // ✅ Add blog ID to User.likedArticles
    await user.updateOne({ $addToSet: { likedArticles: blogId } });

    await blog.save();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Blog liked successfully",
      blog,
    });
  } catch (error) {
    console.error("Error liking blog:", error);
    return res.status(500).json({ success: false, message: "Error liking blog" });
  }
};

export const dislikeBlog = async (req, res) => {
  try {
    const userId = req.id;
    const blogId = req.params.id;

    const blog = await Blog.findById(blogId);
    const user = await User.findById(userId);

    if (!blog || !user) {
      return res.status(404).json({ success: false, message: "Blog or user not found" });
    }

    // ✅ Remove user from Blog.likes
    await blog.updateOne({ $pull: { likes: userId } });

    // ✅ Remove blog from User.likedArticles
    await user.updateOne({ $pull: { likedArticles: blogId } });

    await blog.save();
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Blog unliked successfully",
      blog,
    });
  } catch (error) {
    console.error("Error unliking blog:", error);
    return res.status(500).json({ success: false, message: "Error unliking blog" });
  }
};


export const saveBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.id;

    const blog = await Blog.findById(blogId);
    const user = await User.findById(userId);

    if (!blog || !user) {
      return res.status(404).json({ success: false, message: "Blog or user not found" });
    }

    // ✅ Add blog to user's saved list (avoid duplicates)
    await user.updateOne({ $addToSet: { savedArticles: blogId } });
    await user.save();

    return res.status(200).json({ success: true, message: "Blog saved successfully" });
  } catch (error) {
    console.error("Error saving blog:", error);
    return res.status(500).json({ success: false, message: "Failed to save blog" });
  }
};

export const unsaveBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ✅ Remove blog from user's saved list
    await user.updateOne({ $pull: { savedArticles: blogId } });
    await user.save();

    return res.status(200).json({ success: true, message: "Blog unsaved successfully" });
  } catch (error) {
    console.error("Error unsaving blog:", error);
    return res.status(500).json({ success: false, message: "Failed to unsave blog" });
  }
};

export const getMyTotalBlogLikes = async (req, res) => {
    try {
      const userId = req.id; // assuming you use authentication middleware
  
      // Step 1: Find all blogs authored by the logged-in user
      const myBlogs = await Blog.find({ author: userId }).select("likes");
  
      // Step 2: Sum up the total likes
      const totalLikes = myBlogs.reduce((acc, blog) => acc + (blog.likes?.length || 0), 0);
  
      res.status(200).json({
        success: true,
        totalBlogs: myBlogs.length,
        totalLikes,
      });
    } catch (error) {
      console.error("Error getting total blog likes:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch total blog likes",
      });
    }
};

export const incrementBlogView = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.id; // from isAuthenticated middleware

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    // ✅ Check if user already viewed this blog
    const alreadyViewed = blog.viewedBy.some(
        (v) => v?.user && v.user.toString() === userId.toString()
    );

    if (!alreadyViewed) {
      blog.viewedBy.push(userId);
      blog.views += 1;
      await blog.save();
      console.log(`✅ View counted for user ${userId} on blog ${blogId}`);
    } else {
      console.log(`ℹ️ User ${userId} already viewed blog ${blogId}`);
    }

    return res.status(200).json({ success: true, message: "View recorded" });
  } catch (error) {
    console.error("Error incrementing blog view:", error);
    return res.status(500).json({ success: false, message: "Failed to count view" });
  }
};



export const uploadImageHandler = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    console.log("File received:", req.file);

    // ✅ Convert file to data URI
    const fileUri = getDataUri(req.file);

    // ✅ Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileUri, {
      folder: "blogs",
      resource_type: "image",
    });

    console.log("✅ Uploaded successfully:", result.secure_url);

    return res.status(200).json({
      success: true,
      url: result.secure_url, // ✅ send URL back to frontend
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "File upload failed",
    });
  }
};

