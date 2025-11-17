import Comment from '../models/Comment.js';
import Video from '../models/Video.js';

/**
 * @desc    获取视频评论
 * @route   GET /api/videos/:videoId/comments
 * @access  Public
 */
export const getComments = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { sort = 'latest' } = req.query;

    // 只获取顶级评论（没有父评论的）
    const sortOption = sort === 'hot' ? { likes: -1 } : { createdAt: -1 };

    const comments = await Comment.find({
      video: videoId,
      parentComment: null,
      isDeleted: false,
    })
      .populate('author', 'name avatar')
      .populate({
        path: 'replies',
        populate: { path: 'author', select: 'name avatar' },
        match: { isDeleted: false },
      })
      .sort(sortOption);

    const total = await Comment.countDocuments({
      video: videoId,
      isDeleted: false,
    });

    res.json({
      comments,
      total,
    });
  } catch (error) {
    console.error('获取评论错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

/**
 * @desc    添加评论
 * @route   POST /api/videos/:videoId/comments
 * @access  Private
 */
export const addComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { content, parentId } = req.body;

    // 检查视频是否存在
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ message: '视频未找到' });
    }

    if (!video.allowComments) {
      return res.status(403).json({ message: '该视频不允许评论' });
    }

    // 创建评论
    const comment = await Comment.create({
      content,
      author: req.user._id,
      video: videoId,
      parentComment: parentId || null,
    });

    // 如果是回复，将其添加到父评论的replies数组
    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (parentComment) {
        parentComment.replies.push(comment._id);
        await parentComment.save();
      }
    }

    const populatedComment = await Comment.findById(comment._id).populate(
      'author',
      'name avatar'
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    console.error('添加评论错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

/**
 * @desc    更新评论
 * @route   PUT /api/comments/:id
 * @access  Private
 */
export const updateComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: '评论未找到' });
    }

    // 检查是否是评论作者
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '无权限修改此评论' });
    }

    comment.content = req.body.content || comment.content;
    const updatedComment = await comment.save();

    res.json(updatedComment);
  } catch (error) {
    console.error('更新评论错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

/**
 * @desc    删除评论
 * @route   DELETE /api/comments/:id
 * @access  Private
 */
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: '评论未找到' });
    }

    // 检查是否是评论作者
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: '无权限删除此评论' });
    }

    comment.isDeleted = true;
    await comment.save();

    res.json({ message: '评论已删除' });
  } catch (error) {
    console.error('删除评论错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

/**
 * @desc    点赞评论
 * @route   POST /api/comments/:id/like
 * @access  Private
 */
export const likeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: '评论未找到' });
    }

    comment.likes += 1;
    await comment.save();

    res.json({ likes: comment.likes });
  } catch (error) {
    console.error('点赞评论错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

/**
 * @desc    取消点赞评论
 * @route   DELETE /api/comments/:id/like
 * @access  Private
 */
export const unlikeComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: '评论未找到' });
    }

    comment.likes = Math.max(0, comment.likes - 1);
    await comment.save();

    res.json({ likes: comment.likes });
  } catch (error) {
    console.error('取消点赞评论错误:', error);
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
};

export default {
  getComments,
  addComment,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment,
};
