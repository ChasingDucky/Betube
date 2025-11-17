import User from '../models/User.js';
import Video from '../models/Video.js';

/**
 * @desc    获取用户信息
 * @route   GET /api/users/:id
 * @access  Public
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
      const videoCount = await Video.countDocuments({
        author: user._id,
        status: 'published',
      });

      res.json({
        user: {
          ...user.toObject(),
          videoCount,
        },
      });
    } else {
      res.status(404).json({ message: '用户未找到' });
    }
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

/**
 * @desc    获取用户的视频
 * @route   GET /api/users/:id/videos
 * @access  Public
 */
export const getUserVideos = async (req, res) => {
  try {
    const videos = await Video.find({
      author: req.params.id,
      status: 'published',
      isPublic: true,
    })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });

    res.json({ videos });
  } catch (error) {
    console.error('获取用户视频错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

/**
 * @desc    订阅用户
 * @route   POST /api/users/:id/subscribe
 * @access  Private
 */
export const subscribe = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!targetUser) {
      return res.status(404).json({ message: '用户未找到' });
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: '不能订阅自己' });
    }

    // 检查是否已订阅
    if (currentUser.subscriptions.includes(targetUser._id)) {
      return res.status(400).json({ message: '已经订阅过了' });
    }

    // 添加订阅
    currentUser.subscriptions.push(targetUser._id);
    targetUser.subscribers += 1;

    await currentUser.save();
    await targetUser.save();

    res.json({ message: '订阅成功', subscribers: targetUser.subscribers });
  } catch (error) {
    console.error('订阅用户错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

/**
 * @desc    取消订阅
 * @route   DELETE /api/users/:id/subscribe
 * @access  Private
 */
export const unsubscribe = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!targetUser) {
      return res.status(404).json({ message: '用户未找到' });
    }

    if (!currentUser.subscriptions.includes(targetUser._id)) {
      return res.status(400).json({ message: '还未订阅' });
    }

    // 取消订阅
    currentUser.subscriptions = currentUser.subscriptions.filter(
      (id) => id.toString() !== targetUser._id.toString()
    );
    targetUser.subscribers = Math.max(0, targetUser.subscribers - 1);

    await currentUser.save();
    await targetUser.save();

    res.json({ message: '已取消订阅', subscribers: targetUser.subscribers });
  } catch (error) {
    console.error('取消订阅错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

/**
 * @desc    获取订阅列表
 * @route   GET /api/users/subscriptions
 * @access  Private
 */
export const getSubscriptions = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      'subscriptions',
      'name avatar subscribers'
    );

    res.json({ subscriptions: user.subscriptions });
  } catch (error) {
    console.error('获取订阅列表错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

/**
 * @desc    获取观看历史
 * @route   GET /api/users/history
 * @access  Private
 */
export const getHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'history.video',
      populate: { path: 'author', select: 'name avatar' },
    });

    // 过滤掉已删除的视频
    const history = user.history.filter((item) => item.video !== null);

    res.json({ history });
  } catch (error) {
    console.error('获取历史记录错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

/**
 * @desc    添加到观看历史
 * @route   POST /api/users/history
 * @access  Private
 */
export const addToHistory = async (req, res) => {
  try {
    const { videoId } = req.body;
    const user = await User.findById(req.user._id);

    // 检查视频是否存在
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: '视频未找到' });
    }

    // 如果已在历史中，先移除
    user.history = user.history.filter(
      (item) => item.video.toString() !== videoId
    );

    // 添加到历史记录开头
    user.history.unshift({
      video: videoId,
      watchedAt: Date.now(),
    });

    // 限制历史记录数量（保留最近100条）
    if (user.history.length > 100) {
      user.history = user.history.slice(0, 100);
    }

    await user.save();

    res.json({ message: '已添加到历史记录' });
  } catch (error) {
    console.error('添加历史记录错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

export default {
  getUserProfile,
  getUserVideos,
  subscribe,
  unsubscribe,
  getSubscriptions,
  getHistory,
  addToHistory,
};
