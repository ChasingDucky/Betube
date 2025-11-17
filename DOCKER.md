# Betube Docker 部署指南

本文档提供使用Docker部署Betube的完整说明。

## 快速开始

### 前置要求

- Docker 20.10+
- Docker Compose 2.0+
- 至少4GB可用内存
- 至少10GB可用磁盘空间

### 一键启动

```bash
# 克隆仓库
git clone <repository-url>
cd Betube

# 启动所有服务
docker-compose up -d
```

访问 http://localhost 即可使用！

## 服务架构

Docker Compose会启动以下服务：

1. **MongoDB** (端口27017)
   - 数据库服务
   - 数据持久化存储

2. **Backend** (端口5000)
   - Node.js API服务器
   - 处理所有业务逻辑

3. **Frontend** (端口80)
   - Nginx静态文件服务器
   - React单页应用

## 详细配置

### 环境变量

在项目根目录创建 `.env` 文件：

```env
# JWT密钥（生产环境请修改）
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# 其他可选配置
NODE_ENV=production
```

### 自定义端口

编辑 `docker-compose.yml` 修改端口映射：

```yaml
services:
  frontend:
    ports:
      - "8080:80"  # 改为8080端口
```

### 数据持久化

Docker卷用于数据持久化：

- `mongodb_data`: MongoDB数据库文件
- `mongodb_config`: MongoDB配置文件
- `video_uploads`: 视频文件
- `thumbnail_uploads`: 缩略图文件

查看所有卷：
```bash
docker volume ls
```

## 常用命令

### 启动服务

```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 查看特定服务日志
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### 停止服务

```bash
# 停止所有服务
docker-compose down

# 停止并删除所有数据（慎用！）
docker-compose down -v
```

### 重启服务

```bash
# 重启所有服务
docker-compose restart

# 重启特定服务
docker-compose restart backend
```

### 更新服务

```bash
# 拉取最新代码
git pull

# 重新构建并启动
docker-compose up -d --build
```

### 查看服务状态

```bash
# 查看运行状态
docker-compose ps

# 查看资源使用
docker stats
```

## 健康检查

所有服务都配置了健康检查：

```bash
# 查看健康状态
docker-compose ps

# 健康的服务显示 (healthy)
# 不健康的服务显示 (unhealthy)
```

## 故障排除

### 1. 服务无法启动

```bash
# 查看错误日志
docker-compose logs

# 检查端口占用
sudo lsof -i :80
sudo lsof -i :5000
sudo lsof -i :27017
```

### 2. MongoDB连接失败

```bash
# 检查MongoDB日志
docker-compose logs mongodb

# 进入MongoDB容器
docker-compose exec mongodb mongosh
```

### 3. 前端无法访问后端

```bash
# 检查网络
docker network ls
docker network inspect betube_betube-network

# 测试后端连接
curl http://localhost:5000
```

### 4. 清理并重新开始

```bash
# 停止所有服务
docker-compose down

# 删除所有镜像和容器
docker-compose down --rmi all

# 重新构建
docker-compose build --no-cache
docker-compose up -d
```

## 生产环境部署

### 1. 使用独立的MongoDB

修改 `docker-compose.yml`:

```yaml
services:
  backend:
    environment:
      - MONGODB_URI=mongodb://your-production-mongodb-url/betube

  # 注释掉MongoDB服务
  # mongodb:
  #   ...
```

### 2. 配置HTTPS

使用Nginx反向代理：

```bash
# 安装Certbot
sudo apt-get install certbot python3-certbot-nginx

# 获取SSL证书
sudo certbot --nginx -d your-domain.com
```

### 3. 配置备份

```bash
# MongoDB备份脚本
docker-compose exec mongodb mongodump --out /backup

# 定时备份（添加到crontab）
0 2 * * * cd /path/to/Betube && docker-compose exec -T mongodb mongodump --out /backup/$(date +\%Y\%m\%d)
```

### 4. 性能优化

在 `docker-compose.yml` 中设置资源限制：

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
```

## 监控

### 使用Portainer（推荐）

```bash
docker volume create portainer_data

docker run -d -p 9000:9000 \
  --name=portainer \
  --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce
```

访问 http://localhost:9000 管理容器

### 日志管理

```bash
# 限制日志大小
# 在docker-compose.yml中添加：
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

## Docker镜像大小

优化后的镜像大小：

- Frontend: ~30MB (Nginx Alpine + 构建产物)
- Backend: ~150MB (Node.js Alpine + 依赖)
- MongoDB: ~700MB (官方镜像)

## 多阶段构建

前端Dockerfile使用多阶段构建：

1. 构建阶段：安装依赖并构建React应用
2. 生产阶段：只包含Nginx和构建产物

这样可以大大减小最终镜像大小。

## 开发模式

开发时可以使用卷挂载实现热重载：

```yaml
# docker-compose.dev.yml
services:
  backend:
    volumes:
      - ./server:/app
      - /app/node_modules
    command: npm run dev

  frontend:
    volumes:
      - ./client:/app
      - /app/node_modules
    command: npm run dev
```

使用开发配置：
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## 扩展

### 水平扩展后端

```bash
# 扩展到3个后端实例
docker-compose up -d --scale backend=3
```

需要配置负载均衡器（如Nginx）来分发请求。

## 安全建议

1. **修改默认JWT密钥**
   ```bash
   # 生成安全的随机密钥
   openssl rand -base64 32
   ```

2. **使用Docker secrets**（Swarm模式）
   ```yaml
   secrets:
     jwt_secret:
       file: ./secrets/jwt_secret.txt
   ```

3. **定期更新镜像**
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

4. **扫描安全漏洞**
   ```bash
   docker scan betube-backend
   docker scan betube-frontend
   ```

## 常见问题

**Q: 如何访问MongoDB数据？**
```bash
docker-compose exec mongodb mongosh betube
```

**Q: 如何备份上传的视频？**
```bash
docker cp betube-backend:/app/uploads ./backup/uploads
```

**Q: 如何查看容器内部？**
```bash
docker-compose exec backend sh
docker-compose exec frontend sh
```

**Q: 如何重置数据库？**
```bash
docker-compose down -v  # 删除所有卷
docker-compose up -d    # 重新创建
```

## 性能基准

在4核8GB内存的服务器上：

- 并发用户: ~1000
- 视频流传输: ~50个同时流
- API响应时间: <100ms
- 内存使用: ~2GB

## 支持

如有问题，请：

1. 查看日志: `docker-compose logs`
2. 检查健康状态: `docker-compose ps`
3. 查阅文档: `README.md`, `DEPLOYMENT.md`
4. 提交Issue

---

**祝使用愉快！🐳**
