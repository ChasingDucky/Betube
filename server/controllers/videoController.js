import Video from '../models/Video.js';
import User from '../models/User.js';

/**
 * @desc    获取所有视频
 * @route   GET /api/videos
 * @access  Public
 */
export const getVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const videos = await Video.find({ status: 'published', isPublic: true })
      .populate('author', 'name avatar subscribers')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Video.countDocuments({
      status: 'published',
      isPublic: true,
    });

    res.json({
      videos,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error('获取视频列表错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

/**
 * @desc    获取单个视频
 * @route   GET /api/videos/:id
 * @access  Public
 */
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate(
      'author',
      'name avatar subscribers'
    );

    if (video) {
      res.json(video);
    } else {
      res.status(404).json({ message: '视频未找到' });
    }
  } catch (error) {
    console.error('获取视频错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

/**
 * @desc    上传视频
 * @route   POST /api/videos/upload
 * @access  Private
 */
export const uploadVideo = async (req, res) => {
  try {
    const { title, description, tags, category } = req.body;

    if (!req.files || !req.files.video) {
      return res.status(400).json({ message: '请上传视频文件' });
    }

    const videoFile = req.files.video[0];
    const thumbnailFile = req.files.thumbnail ? req.files.thumbnail[0] : null;

    // 创建视频记录
    const video = await Video.create({
      title,
      description,
      videoUrl: `/uploads/videos/${videoFile.filename}`,
      thumbnail: thumbnailFile
        ? `/uploads/thumbnails/${thumbnailFile.filename}`
        : '/default-thumbnail.jpg',
      tags: tags ? JSON.parse(tags) : [],
      category,
      author: req.user._id,
      status: 'published', // 实际应该是processing，等待转码
    });

    res.status(201).json({
      message: '视频上传成功',
      videoId: video._id,
      video,
    });
  } catch (error) {
    console.error('上传视频错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

/**
 * @desc    更新视频信息
 * @route   PUT /api/videos/:id
 * @access  Private
 */
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: '视频未找到' });
    }

    // 检查是否是视频所有者
    if (video.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '无权限修改此视频' });
    }

    // 更新字段
    video.title = req.body.title || video.title;
    video.description = req.body.description || video.description;
    video.tags = req.body.tags || video.tags;
    video.category = req.body.category || video.category;
    video.isPublic = req.body.isPublic ?? video.isPublic;

    const updatedVideo = await video.save();

    res.json(updatedVideo);
  } catch (error) {
    console.error('更新视频错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

/**
 * @desc    删除视频
 * @route   DELETE /api/videos/:id
 * @access  Private
 */
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ message: '视频未找到' });
    }

    // 检查是否是视频所有者
    if (video.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '无权限删除此视频' });
    }

    video.status = 'deleted';
    await video.save();

    res.json({ message: '视频已删除' });
  } catch (error) {
    console.error('删除视频错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

/**
 * @desc    增加视频观看次数
 * @route   POST /api/videos/:id/view
 * @access  Public
 */
export const incrementViews = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (video) {
      video.views += 1;
      await video.save();
      res.json({ views: video.views });
    } else {
      res.status(404).json({ message: '视频未找到' });
    }
  } catch (error) {
    console.error('增加观看次数错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

/**
 * @desc    点赞视频
 * @route   POST /api/videos/:id/like
 * @access  Private
 */
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!video) {
      return res.status(404).json({ message: '视频未找到' });
    }

    // 检查是否已点赞
    if (user.likedVideos.includes(video._id)) {
      return res.status(400).json({ message: '已经点赞过了' });
    }

    video.likes += 1;
    user.likedVideos.push(video._id);

    await video.save();
    await user.save();

    res.json({ likes: video.likes });
  } catch (error) {
    console.error('点赞视频错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

/**
 * @desc    取消点赞
 * @route   DELETE /api/videos/:id/like
 * @access  Private
 */
export const unlikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!video) {
      return res.status(404).json({ message: '视频未找到' });
    }

    if (!user.likedVideos.includes(video._id)) {
      return res.status(400).json({ message: '还未点赞' });
    }

    video.likes -= 1;
    user.likedVideos = user.likedVideos.filter(
      (id) => id.toString() !== video._id.toString()
    );

    await video.save();
    await user.save();

    res.json({ likes: video.likes });
  } catch (error) {
    console.error('取消点赞错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

/**
 * @desc    获取推荐视频
 * @route   GET /api/videos/recommended
 * @access  Public
 */
export const getRecommended = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12;

    // 简单的推荐算法：按观看次数和时间综合排序
    const videos = await Video.find({ status: 'published', isPublic: true })
      .populate('author', 'name avatar subscribers')
      .sort({ views: -1, createdAt: -1 })
      .limit(limit);

    res.json({ videos });
  } catch (error) {
    console.error('获取推荐视频错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

/**
 * @desc    获取热门视频
 * @route   GET /api/videos/trending
 * @access  Public
 */
export const getTrending = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12;

    // 获取最近7天的热门视频
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const videos = await Video.find({
      status: 'published',
      isPublic: true,
      createdAt: { $gte: sevenDaysAgo },
    })
      .populate('author', 'name avatar subscribers')
      .sort({ views: -1, likes: -1 })
      .limit(limit);

    res.json({ videos });
  } catch (error) {
    console.error('获取热门视频错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

/**
 * @desc    搜索视频
 * @route   GET /api/videos/search
 * @access  Public
 */
export const searchVideos = async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({ message: '请提供搜索关键词' });
    }

    const videos = await Video.find({
      $text: { $search: q },
      status: 'published',
      isPublic: true,
    })
      .populate('author', 'name avatar subscribers')
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(limit);

    const total = await Video.countDocuments({
      $text: { $search: q },
      status: 'published',
      isPublic: true,
    });

    res.json({
      results: videos,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error('搜索视频错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

export default {
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
};
