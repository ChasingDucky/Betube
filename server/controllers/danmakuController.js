import Danmaku from '../models/Danmaku.js';
import Video from '../models/Video.js';

/**
 * @desc    获取视频弹幕
 * @route   GET /api/videos/:videoId/danmaku
 * @access  Public
 */
export const getDanmaku = async (req, res) => {
  try {
    const { videoId } = req.params;

    const danmaku = await Danmaku.find({ video: videoId })
      .populate('author', 'name')
      .sort({ time: 1 }); // 按时间排序

    res.json({ danmaku });
  } catch (error) {
    console.error('获取弹幕错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

/**
 * @desc    发送弹幕
 * @route   POST /api/videos/:videoId/danmaku
 * @access  Private
 */
export const sendDanmaku = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { text, time, color, type, fontSize } = req.body;

    // 检查视频是否存在
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: '视频未找到' });
    }

    if (!video.allowDanmaku) {
      return res.status(403).json({ message: '该视频不允许弹幕' });
    }

    // 创建弹幕
    const danmaku = await Danmaku.create({
      text,
      time,
      color: color || '#FFFFFF',
      type: type || 'scroll',
      fontSize: fontSize || 'medium',
      author: req.user._id,
      video: videoId,
    });

    const populatedDanmaku = await Danmaku.findById(danmaku._id).populate(
      'author',
      'name'
    );

    res.status(201).json(populatedDanmaku);
  } catch (error) {
    console.error('发送弹幕错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

export default {
  getDanmaku,
  sendDanmaku,
};
