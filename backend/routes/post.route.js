import express from "express";

import { protectRoute } from "../middleware/protectRoute.js";

import { createPost } from "../controllers/post.controllers.js";
import { deletePost } from "../controllers/post.controllers.js";
import { commentOnPost } from "../controllers/post.controllers.js";
import { likeUnlikePost } from "../controllers/post.controllers.js";
import { getAllPost } from "../controllers/post.controllers.js";
import { getLikedPosts } from "../controllers/post.controllers.js";
import { getFollowingPosts } from "../controllers/post.controllers.js";
import { getUserPosts } from "../controllers/post.controllers.js";

const router = express.Router();

router.get("/all",protectRoute,getAllPost)
router.get("/following",protectRoute,getFollowingPosts)
router.get("/likes/:id",protectRoute,getLikedPosts)
router.get("/user/:username",protectRoute,getUserPosts)
router.post("/create",protectRoute,createPost)
router.post("/like/:id",protectRoute,likeUnlikePost)
router.post("/comment/:id",protectRoute,commentOnPost)
router.delete("/:id",protectRoute,deletePost)

 

export default router;