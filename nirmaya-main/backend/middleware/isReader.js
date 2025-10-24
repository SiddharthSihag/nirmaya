// middlewares/isReader.js
export const isReader = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    if (user.role !== "reader") {
      return res.status(403).json({ message: "Reader access required", success: false });
    }

    console.log("✅ Reader verified");
    next();
  } catch (error) {
    console.error("Reader check error:", error.message);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};
