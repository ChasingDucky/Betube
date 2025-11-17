# Betube 部署指南

本文档提供Betube视频平台的完整部署说明。

## 系统要求

- Node.js 18.x 或更高版本
- MongoDB 6.0 或更高版本
- npm 或 yarn
- 至少2GB可用内存
- 推荐：FFmpeg（用于视频转码）

## 本地开发环境搭建

### 1. 克隆仓库

```bash
git clone <repository-url>
cd Betube
```

### 2. 安装MongoDB

#### macOS (使用Homebrew)
```bash
brew tap mongodb/brew
brew install mongodb-community@6.0
brew services start mongodb-community@6.0
```

#### Ubuntu/Debian
```bash
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Windows
下载并安装 [MongoDB Community Edition](https://www.mongodb.com/try/download/community)

### 3. 配置环境变量

#### 后端环境变量
```bash
cd server
cp .env.example .env
```

编辑 `server/.env`：
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/betube
JWT_SECRET=your-super-secret-jwt-key-please-change-in-production
JWT_EXPIRE=7d
MAX_FILE_SIZE=524288000
UPLOAD_PATH=./uploads
CLIENT_URL=http://localhost:3000
```

#### 前端环境变量
```bash
cd client
cp .env.example .env
```

编辑 `client/.env`：
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. 安装依赖

#### 后端
```bash
cd server
npm install
```

#### 前端
```bash
cd client
npm install
```

### 5. 启动服务

#### 启动后端服务器
```bash
cd server
npm run dev
```

后端将在 http://localhost:5000 运行

#### 启动前端开发服务器
```bash
cd client
npm run dev
```

前端将在 http://localhost:3000 运行

### 6. 访问应用

打开浏览器访问 http://localhost:3000

## 生产环境部署

### 1. 构建前端

```bash
cd client
npm run build
```

构建输出将在 `client/dist` 目录

### 2. 配置生产环境变量

```bash
cd server
cp .env.example .env
```

编辑 `.env` 并设置生产环境配置：
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db-url/betube
JWT_SECRET=your-very-secure-random-string
JWT_EXPIRE=7d
MAX_FILE_SIZE=524288000
CLIENT_URL=https://your-domain.com
```

### 3. 使用PM2部署（推荐）

#### 安装PM2
```bash
npm install -g pm2
```

#### 启动应用
```bash
cd server
pm2 start server.js --name betube-api
pm2 save
pm2 startup
```

### 4. Nginx配置（推荐）

创建Nginx配置文件 `/etc/nginx/sites-available/betube`：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/Betube/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # API代理
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 上传文件
    location /uploads {
        alias /path/to/Betube/server/uploads;
    }

    client_max_body_size 500M;
}
```

启用配置：
```bash
sudo ln -s /etc/nginx/sites-available/betube /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL证书配置（使用Let's Encrypt）

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Docker部署（可选）

### 创建 Dockerfile（后端）

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]
```

### 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    restart: always
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_DATABASE: betube

  backend:
    build: ./server
    restart: always
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongodb:27017/betube
    depends_on:
      - mongodb
    volumes:
      - ./server/uploads:/app/uploads

  frontend:
    build: ./client
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

### 启动Docker容器

```bash
docker-compose up -d
```

## 性能优化建议

### 1. MongoDB索引优化
确保所有查询都有适当的索引，主要索引已在模型中定义。

### 2. 视频CDN
考虑使用CDN服务（如Cloudflare、AWS CloudFront）来分发视频内容。

### 3. 视频转码
实现视频转码功能，生成多种清晰度版本：
- 使用FFmpeg
- 考虑使用云转码服务（AWS MediaConvert、Google Transcoder API）

### 4. 缓存策略
- 使用Redis缓存热门视频数据
- 实现HTTP缓存头
- 使用Service Worker进行前端缓存

### 5. 负载均衡
使用Nginx或HAProxy进行负载均衡：
```nginx
upstream backend {
    least_conn;
    server backend1.example.com;
    server backend2.example.com;
    server backend3.example.com;
}
```

## 监控和日志

### 1. 应用监控
- 使用PM2的内置监控
- 集成New Relic或Datadog

### 2. 日志管理
```bash
# 查看PM2日志
pm2 logs betube-api

# 设置日志轮转
pm2 install pm2-logrotate
```

### 3. 数据库备份
```bash
# MongoDB备份
mongodump --db betube --out /backup/$(date +%Y%m%d)

# 设置定时备份（crontab）
0 2 * * * mongodump --db betube --out /backup/$(date +\%Y\%m\%d)
```

## 故障排除

### 常见问题

1. **MongoDB连接失败**
   - 检查MongoDB服务是否运行：`sudo systemctl status mongod`
   - 验证连接字符串是否正确

2. **文件上传失败**
   - 检查uploads目录权限
   - 确认MAX_FILE_SIZE设置

3. **跨域问题**
   - 确认CORS配置正确
   - 检查CLIENT_URL环境变量

4. **视频播放问题**
   - 确认视频文件格式支持
   - 检查服务器MIME类型配置

## 安全建议

1. **定期更新依赖**
   ```bash
   npm audit
   npm update
   ```

2. **使用HTTPS**
   - 所有生产环境必须使用HTTPS
   - 配置HSTS头

3. **限流保护**
   - 使用express-rate-limit
   - 在Nginx层面配置限流

4. **输入验证**
   - 所有用户输入都已使用express-validator验证
   - 防止XSS和SQL注入

5. **定期备份**
   - 数据库每日备份
   - 上传文件定期备份

## 联系支持

如有问题，请提交Issue或联系开发团队。

---

**祝部署顺利！🚀**
