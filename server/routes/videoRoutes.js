import express from 'express';
import {
  getVideos,
  getVideoById,
  uploadVideo,
  updateVideo,
  deleteVideo,
  incrementViews,
  likeVideo,
  unlikeVideo,
  getRecommended,
  getTrending,
  searchVideos,
} from '../controllers/videoController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getVideos);
router.get('/recommended', getRecommended);
router.get('/trending', getTrending);
router.get('/search', searchVideos);
router.get('/:id', getVideoById);
router.post('/upload', protect, uploadVideo);
router.put('/:id', protect, updateVideo);
router.delete('/:id', protect, deleteVideo);
router.post('/:id/view', incrementViews);
router.post('/:id/like', protect, likeVideo);
router.delete('/:id/like', protect, unlikeVideo);

export default router;
