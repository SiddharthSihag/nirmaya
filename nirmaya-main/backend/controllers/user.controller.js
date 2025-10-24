import { User } from "../models/user.model.js";
import { Blog } from "../models/blog.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";
const authorEmails = ["pranjal@nirmayacare.com",
   "raghav@nirmayacare.com", "poojitha@nirmayacare.com", "anusha@nirmayacare.com", "mythri@nirmayacare.com", "santhosh@nirmayacare.com","apoorva@mirmayacare.com","shamantha@nirmayacare.com","darshan@nirmayacare.com","ashritha@nirmayacare.com","crystaldalia@nirmayacare.com","rohith@nirmayacare.com","sathvick@nirmayacare.com"];
import Comment from "../models/comment.model.js";

export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      })
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters"
      });
    }

    const existingUserByEmail = await User.findOne({ email: email });

    if (existingUserByEmail) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    let role = "reader";
    if (authorEmails.includes(email)) {
      role = "author";
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role
    })

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res
      .status(201)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict"
      })
      .json({
        success: true,
        message: "Account Created Successfully",
        user
      })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to register"
    })

  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // console.log(`email:and pass word`,email,password)
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      })
    }

    let user = await User.findOne({ email });
    //console.log("userrrrrrrrr",user);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password"
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials"
      })
    }

    const token = await jwt.sign({ userId: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: '1d' })
    return res
      .status(200)
      .cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: "strict" })
      .json({
        success: true,
        message: `Welcome back ${user.firstName}`,
        user
      })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to Login",
    })
  }

}

export const logout = async (_, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully.",
      success: true
    })
  } catch (error) {
    console.log(error);
  }
}

export const updateProfile = async (req, res) => {
  try {
    const userId = req.id
    const { firstName, lastName, occupation, bio, instagram, facebook, linkedin, twitter } = req.body;
    const file = req.file;

    let cloudResponse;
    if (file) {
      const fileUri = getDataUri(file);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }


    const user = await User.findById(userId).select("-password")

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false
      })
    }

    // updating data
    if (firstName) user.firstName = firstName
    if (lastName) user.lastName = lastName
    if (occupation) user.occupation = occupation;

    if (user.role === "author") {

      if (instagram) user.instagram = instagram;
      if (facebook) user.facebook = facebook;
      if (linkedin) user.linkedin = linkedin;
      if (twitter) user.twitter = twitter;
      if (bio) user.bio = bio;
    }

    if (cloudResponse) user.photoUrl = cloudResponse.secure_url

    if (req.user.role === "reader") {
      if (req.body.dob) user.dob = req.body.dob;
      if (req.body.city) user.city = req.body.city;
    }

    await user.save()
    return res.status(200).json({
      message: "profile updated successfully",
      success: true,
      user
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile"
    })
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // exclude password field
    res.status(200).json({
      success: true,
      message: "User list fetched successfully",
      total: users.length,
      users
    });
  } catch (error) {
    console.error("Error fetching user list:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({ success: true, user });

  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};

export const getLikedArticles = async (req, res) => {
  try {
    const user = await User.findById(req.id).populate({
      path: "likedArticles",
      populate: { path: "author", select: "firstName lastName" },
    });

    return res.status(200).json({
      success: true,
      likedArticles: user.likedArticles,
    });
  } catch (error) {
    console.error("Error fetching liked articles:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch liked articles" });
  }
};

// ✅ Fetch saved blogs
export const getSavedArticles = async (req, res) => {
  try {
    const user = await User.findById(req.id).populate({
      path: "savedArticles",
      populate: { path: "author", select: "firstName lastName" },
    });

    return res.status(200).json({
      success: true,
      savedArticles: user.savedArticles,
    });
  } catch (error) {
    console.error("Error fetching saved articles:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch saved articles" });
  }
};

export const getUserComments = async (req, res) => {
  try {
    const userId = req.id;

    // ✅ Fetch all comments by the logged-in user
    const comments = await Comment.find({ userId })
      .populate("postId", "title thumbnail") // get blog title & thumbnail
      .sort({ createdAt: -1 });

    if (!comments.length) {
      return res.status(200).json({
        success: true,
        message: "No comments found",
        comments: [],
      });
    }

    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error("Error fetching user comments:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user comments",
    });
  }
};

export const getAuthorStats = async (req, res) => {
  try {
    const userId = req.id;

    // Fetch all blogs by the author
    const blogs = await Blog.find({ author: userId });

    const totalViews = blogs.reduce((sum, b) => sum + (b.views || 0), 0);
    const totalLikes = blogs.reduce((sum, b) => sum + (b.likes?.length || 0), 0);

    const blogIds = blogs.map(b => b._id);
    const totalComments = await Comment.countDocuments({ postId: { $in: blogIds } });

    return res.status(200).json({
      success: true,
      totalViews,
      totalLikes,
      totalComments,
      totalBlogs: blogs.length,
    });
  } catch (error) {
    console.error("Error fetching author stats:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch author stats",
    });
  }
};
