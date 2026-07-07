import { Router } from "express";
import {
    createTweet,
    getUserTweets,
    getAllTweets,
    updateTweet,
    deleteTweet
} from "../controllers/tweet.controllers.js";
import { verifyJWT, optionalJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// Public routes (with optional auth for isLiked)
router.route("/").get(optionalJWT, getAllTweets);
router.route("/user/:userId").get(optionalJWT, getUserTweets);

// Protected routes
router.route("/").post(verifyJWT, createTweet);
router
    .route("/:tweetId")
    .patch(verifyJWT, updateTweet)
    .delete(verifyJWT, deleteTweet);

export default router;
