import { User } from "../models/user.model.js";

export const isAuthor = async (req, res, next) => {
  try {
    const user = req.user; 



    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    if (user.role !== "author") {
      return res.status(403).json({ message: "Access denied", success: false });
    }

    
        console.log("Author verified")
    next();
  } catch (error) {
    
    console.error("Authorization error:", error.message);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};