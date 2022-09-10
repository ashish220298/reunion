const express = require("express")
////////making router object//////////
const router = express.Router()

const authenticate = require("../middleware/MidAuth")
const userController = require("../controller/userController");
const postController = require("../controller/postController")
const commentController = require("../controller/commentController")

///////////////////////////////////////////////////////////////////////////
router.post("/register",userController.register)
router.post("/api/authenticate",userController.login)
router.post("/api/follow/:Id",authenticate.authmiddleware, userController.follow)
router.post("/api/unfollow/:Id",authenticate.authmiddleware, userController.unfollow)
router.get("/api/user",authenticate.authmiddleware, userController.getUser)
/////////////////////////////////////////////////////////////////////////////
router.post("/api/posts",authenticate.authmiddleware,postController.posts)
router.delete("/api/posts/:Id",authenticate.authmiddleware,postController.deletePost)
router.post("/api/like/:Id",authenticate.authmiddleware,postController.like)
router.post("/api/unlike/:Id",authenticate.authmiddleware,postController.unlike)
router.get("/api/posts/:Id",authenticate.authmiddleware,postController.getPostDetails)
router.get("/api/all_posts",authenticate.authmiddleware,postController.getAllPosts)
//////////////////////////////////////////////////////////////////////////////////
router.post("/api/comment/:Id",authenticate.authmiddleware,commentController.Createcomment)

/////////////////////////////////////////////////////////////////////////////////
module.exports = router