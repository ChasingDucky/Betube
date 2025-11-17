# Betube - 视频播放平台

一个对标YouTube和bilibili的现代化视频播放平台，采用Material Design 3设计语言和Material You莫奈取色系统。

## 技术栈

### 前端
- **React 18** - 现代化UI框架
- **Material UI (MUI) v5** - Material Design 3组件库
- **Material You** - 动态莫奈取色系统
- **React Router** - 路由管理
- **Axios** - HTTP客户端
- **Video.js** - 视频播放器
- **React Query** - 数据获取和缓存

### 后端
- **Node.js** - 运行时环境
- **Express** - Web框架
- **MongoDB** - 数据库
- **Mongoose** - ODM
- **JWT** - 身份认证
- **Multer** - 文件上传
- **FFmpeg** - 视频处理

## 功能特性

### 核心功能
- ✨ 用户注册/登录系统
- 📹 视频上传和转码
- 🎬 高性能视频播放器（支持多清晰度）
- 💬 弹幕系统
- 💭 评论和互动
- 🔍 智能搜索
- 📊 推荐算法
- 👤 用户主页和订阅
- 📱 响应式设计

### UI特性
- 🎨 Material You动态配色
- 🔲 Material Design 3异形图标
- 🌙 深色/浅色主题切换
- ✨ 流畅的动画效果

## 项目结构

```
Betube/
├── client/                 # 前端React应用
│   ├── public/            # 静态资源
│   ├── src/
│   │   ├── components/    # React组件
│   │   ├── pages/         # 页面组件
│   │   ├── hooks/         # 自定义Hooks
│   │   ├── services/      # API服务
│   │   ├── theme/         # Material You主题
│   │   ├── utils/         # 工具函数
│   │   └── App.jsx        # 应用入口
│   └── package.json
│
├── server/                # 后端Node.js应用
│   ├── controllers/       # 控制器
│   ├── models/           # 数据模型
│   ├── routes/           # 路由
│   ├── middleware/       # 中间件
│   ├── services/         # 业务逻辑
│   ├── utils/            # 工具函数
│   ├── config/           # 配置文件
│   └── server.js         # 服务器入口
│
└── README.md
```

## 快速开始

### 🐳 Docker部署（推荐）

使用Docker是最快的开始方式：

```bash
# 克隆仓库
git clone <repository-url>
cd Betube

# 一键启动所有服务
docker-compose up -d
```

访问 http://localhost 即可使用！

📖 详细的Docker使用指南请查看 [DOCKER.md](DOCKER.md)

### 📦 手动安装

#### 前置要求
- Node.js 18+
- MongoDB 6+
- FFmpeg

#### 安装步骤

1. 克隆仓库
```bash
git clone <repository-url>
cd Betube
```

2. 安装前端依赖
```bash
cd client
npm install
```

3. 安装后端依赖
```bash
cd ../server
npm install
```

4. 配置环境变量
```bash
# 在server目录下创建.env文件
cp .env.example .env
# 编辑.env文件，填入必要的配置
```

5. 启动开发服务器
```bash
# 启动后端（在server目录）
npm run dev

# 启动前端（在client目录）
npm run dev
```

## 开发计划

- [x] 项目架构设计
- [ ] 前端基础框架
- [ ] 后端API服务
- [ ] 用户认证系统
- [ ] 视频上传功能
- [ ] 视频播放器
- [ ] 弹幕系统
- [ ] 评论系统
- [ ] 搜索功能
- [ ] 推荐算法

## License

MIT
