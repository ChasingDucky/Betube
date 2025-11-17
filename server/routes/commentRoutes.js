import express from 'express';
import {
  getComments,
  addComment,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
} from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// 视频评论路由
router.get('/videos/:videoId/comments', getComments);
router.post('/videos/:videoId/comments', protect, addComment);

// 单个评论操作
router.put('/comments/:id', protect, updateComment);
router.delete('/comments/:id', protect, deleteComment);
router.post('/comments/:id/like', protect, likeComment);
router.delete('/comments/:id/like', protect, unlikeComment);

export default router;
