
import express from "express"
import { getAllUsers, login, logout, register, updateProfile,getProfile,getLikedArticles, getSavedArticles, getUserComments,getAuthorStats  } from "../controllers/user.controller.js"
import { isAuthenticated } from "../middleware/isAuthenticated.js"
import { isAuthor } from "../middleware/isAuthor.js"
import { isReader } from "../middleware/isReader.js"
import { singleUpload } from "../middleware/multer.js"

const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/profile/update").put(isAuthenticated, singleUpload, updateProfile)
router.get('/all-users',  getAllUsers);

router.get("/liked", isAuthenticated, getLikedArticles);
router.get("/saved", isAuthenticated, getSavedArticles);
router.get("/my-comments", isAuthenticated, getUserComments);


router.get("/profile", isAuthenticated, getProfile);

router.get("/author/stats", isAuthenticated, isAuthor, getAuthorStats);

export default router;
