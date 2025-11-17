import jwt from 'jsonwebtoken';

/**
 * 生成JWT Token
 * @param {string} id - 用户ID
 * @returns {string} - JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

/**
 * 验证JWT Token
 * @param {string} token - JWT token
 * @returns {object} - 解码后的payload
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('无效的token');
  }
};

export default generateToken;
