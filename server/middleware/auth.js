import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * 保护路由中间件 - 验证JWT token
 */
export const protect = async (req, res, next) => {
  let token;

  // 从请求头获取token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 获取token
      token = req.headers.authorization.split(' ')[1];

      // 验证token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 获取用户信息（不包含密码）
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: '用户不存在' });
      }

      if (!req.user.isActive) {
        return res.status(401).json({ message: '账号已被禁用' });
      }

      next();
    } catch (error) {
      console.error('Token验证失败:', error);
      return res.status(401).json({ message: '未授权，token无效' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: '未授权，没有token' });
  }
};

/**
 * 管理员权限中间件
 */
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: '需要管理员权限' });
  }
};

/**
 * 可选认证中间件 - token可以不存在
 */
export const optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // token无效，但不阻止请求
      req.user = null;
    }
  }

  next();
};

export default { protect, admin, optionalAuth };
