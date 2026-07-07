import { Router } from "express";
import {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
} from "../controllers/comment.controllers.js";
import { verifyJWT, optionalJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

// Public routes (with optional auth)
router.route("/:videoId").get(optionalJWT, getVideoComments);

// Protected routes
router.route("/:videoId").post(verifyJWT, addComment);
router
    .route("/c/:commentId")
    .patch(verifyJWT, updateComment)
    .delete(verifyJWT, deleteComment);

export default router;
