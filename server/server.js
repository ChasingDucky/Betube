import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 配置环境变量
dotenv.config();

// 数据库连接
import connectDB from './config/database.js';

// 路由
import authRoutes from './routes/authRoutes.js';
import videoRoutes from './routes/videoRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import danmakuRoutes from './routes/danmakuRoutes.js';
import userRoutes from './routes/userRoutes.js';

// 中间件
import { notFound, errorHandler } from './middleware/error.js';
import { uploadVideoWithThumbnail } from './middleware/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 连接数据库
connectDB();

const app = express();

// 基础中间件
app.use(helmet()); // 安全头
app.use(compression()); // 压缩响应
app.use(morgan('dev')); // 日志

// CORS配置
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Body解析
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API路由
app.get('/', (req, res) => {
  res.json({
    message: '🎥 Betube API Server',
    version: '1.0.0',
    status: 'running',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/videos', uploadVideoWithThumbnail, videoRoutes);
app.use('/api', commentRoutes);
app.use('/api', danmakuRoutes);
app.use('/api/users', userRoutes);

// 错误处理
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║                                           ║
║     🎬 Betube Server Started 🎬         ║
║                                           ║
║     Server: http://localhost:${PORT}      ║
║     Environment: ${process.env.NODE_ENV || 'development'}              ║
║                                           ║
╚═══════════════════════════════════════════╝
  `);
});

// 处理未捕获的异常
process.on('unhandledRejection', (err) => {
  console.error('❌ 未处理的Promise拒绝:', err);
  // 生产环境中应该优雅地关闭服务器
  // server.close(() => process.exit(1));
});

export default app;
