import express from 'express';
import {
  getUserProfile,
  getUserVideos,
  subscribe,
  unsubscribe,
  getSubscriptions,
  getHistory,
  addToHistory,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/subscriptions', protect, getSubscriptions);
router.get('/history', protect, getHistory);
router.post('/history', protect, addToHistory);
router.get('/:id', getUserProfile);
router.get('/:id/videos', getUserVideos);
router.post('/:id/subscribe', protect, subscribe);
router.delete('/:id/subscribe', protect, unsubscribe);

export default router;
