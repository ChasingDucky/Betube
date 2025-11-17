# 使用Node.js 18 Alpine版本（更轻量）
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 安装FFmpeg（用于视频处理）
RUN apk add --no-cache ffmpeg

# 复制package.json和package-lock.json
COPY package*.json ./

# 安装依赖（仅生产依赖）
RUN npm ci --only=production

# 复制应用代码
COPY . .

# 创建上传目录
RUN mkdir -p uploads/videos uploads/thumbnails

# 设置环境变量
ENV NODE_ENV=production

# 暴露端口
EXPOSE 5000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 启动应用
CMD ["node", "server.js"]
