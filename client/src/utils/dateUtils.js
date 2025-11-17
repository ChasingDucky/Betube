import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

dayjs.extend(relativeTime);
dayjs.locale('zh-cn');

/**
 * 格式化时间为相对时间
 * @param {string|Date} date - 日期
 * @returns {string} - 相对时间字符串，如"3天前"
 */
export const formatDistanceToNow = (date) => {
  return dayjs(date).fromNow();
};

/**
 * 格式化日期
 * @param {string|Date} date - 日期
 * @param {string} format - 格式化模板
 * @returns {string} - 格式化后的日期字符串
 */
export const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(date).format(format);
};

/**
 * 格式化视频时长
 * @param {number} seconds - 秒数
 * @returns {string} - 格式化后的时长，如"1:23:45"
 */
export const formatDuration = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

export default {
  formatDistanceToNow,
  formatDate,
  formatDuration,
};
