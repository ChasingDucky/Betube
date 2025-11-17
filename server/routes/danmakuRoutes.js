import express from 'express';
import { getDanmaku, sendDanmaku } from '../controllers/danmakuController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/videos/:videoId/danmaku', getDanmaku);
router.post('/videos/:videoId/danmaku', protect, sendDanmaku);

export default router;
