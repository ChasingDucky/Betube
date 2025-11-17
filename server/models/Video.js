import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, '请提供视频标题'],
      trim: true,
      maxlength: [100, '标题不能超过100个字符'],
    },
    description: {
      type: String,
      maxlength: [5000, '描述不能超过5000个字符'],
    },
    videoUrl: {
      type: String,
      required: [true, '视频文件路径不能为空'],
    },
    thumbnail: {
      type: String,
      default: '/default-thumbnail.jpg',
    },
    duration: {
      type: Number, // 秒数
      default: 0,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    dislikes: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    category: {
      type: String,
      enum: [
        'gaming',
        'music',
        'tech',
        'entertainment',
        'life',
        'food',
        'sports',
        'education',
        'other',
      ],
      default: 'other',
    },
    status: {
      type: String,
      enum: ['processing', 'published', 'private', 'deleted'],
      default: 'processing',
    },
    quality: {
      type: Map,
      of: String, // { '360p': 'path/to/360p.mp4', '720p': 'path/to/720p.mp4', ... }
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    allowComments: {
      type: Boolean,
      default: true,
    },
    allowDanmaku: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// 索引优化
videoSchema.index({ author: 1, createdAt: -1 });
videoSchema.index({ tags: 1 });
videoSchema.index({ category: 1 });
videoSchema.index({ views: -1 });
videoSchema.index({ createdAt: -1 });
videoSchema.index({ title: 'text', description: 'text' }); // 文本搜索

const Video = mongoose.model('Video', videoSchema);

export default Video;
