import mongoose from 'mongoose';

const danmakuSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, '弹幕内容不能为空'],
      maxlength: [100, '弹幕不能超过100个字符'],
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Video',
      required: true,
    },
    time: {
      type: Number, // 视频播放时间（秒）
      required: true,
      min: 0,
    },
    color: {
      type: String,
      default: '#FFFFFF',
      match: /^#[0-9A-F]{6}$/i,
    },
    type: {
      type: String,
      enum: ['scroll', 'top', 'bottom'], // 滚动、顶部、底部
      default: 'scroll',
    },
    fontSize: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium',
    },
  },
  {
    timestamps: true,
  }
);

// 索引优化 - 按视频和时间查询弹幕
danmakuSchema.index({ video: 1, time: 1 });
danmakuSchema.index({ author: 1 });

const Danmaku = mongoose.model('Danmaku', danmakuSchema);

export default Danmaku;
