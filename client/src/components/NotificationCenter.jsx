import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Badge,
  Drawer,
  Typography,
  Stack,
  Avatar,
  Divider,
  Button,
  Paper,
  Tabs,
  Tab,
  useTheme,
  alpha,
  Chip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationsIcon from '@mui/icons-material/Notifications';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CommentIcon from '@mui/icons-material/Comment';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import CloseIcon from '@mui/icons-material/Close';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { formatDistanceToNow } from '../utils/dateUtils';

// 模拟通知数据
const mockNotifications = [
  {
    id: 1,
    type: 'like',
    user: { name: 'Alice', avatar: 'https://i.pravatar.cc/150?img=1' },
    message: '点赞了你的视频《React 实战教程》',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
    video: { title: 'React 实战教程', thumbnail: null },
  },
  {
    id: 2,
    type: 'comment',
    user: { name: 'Bob', avatar: 'https://i.pravatar.cc/150?img=2' },
    message: '评论了你的视频《Vue 3.0 新特性》',
    content: '讲得很好，学到了很多！',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
  },
  {
    id: 3,
    type: 'subscribe',
    user: { name: 'Charlie', avatar: 'https://i.pravatar.cc/150?img=3' },
    message: '订阅了你',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
  },
  {
    id: 4,
    type: 'upload',
    user: { name: 'David', avatar: 'https://i.pravatar.cc/150?img=4' },
    message: '发布了新视频《TypeScript 进阶技巧》',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    read: true,
    video: { title: 'TypeScript 进阶技巧', thumbnail: null },
  },
];

const NotificationItem = ({ notification, onRead, onDelete }) => {
  const theme = useTheme();

  const getIcon = () => {
    const iconProps = { fontSize: 'small' };
    switch (notification.type) {
      case 'like':
        return <ThumbUpIcon {...iconProps} color="error" />;
      case 'comment':
        return <CommentIcon {...iconProps} color="primary" />;
      case 'subscribe':
        return <PersonAddIcon {...iconProps} color="success" />;
      case 'upload':
        return <VideoLibraryIcon {...iconProps} color="secondary" />;
      default:
        return <NotificationsIcon {...iconProps} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      whileHover={{ x: 4 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 1.5,
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          background: notification.read
            ? alpha(theme.palette.background.paper, 0.5)
            : `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, transparent 100%)`,
          cursor: 'pointer',
          transition: 'all 0.3s',
          '&:hover': {
            boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.1)}`,
          },
        }}
        onClick={() => !notification.read && onRead(notification.id)}
      >
        <Stack direction="row" spacing={2} alignItems="flex-start">
          {/* 用户头像 */}
          <Box sx={{ position: 'relative' }}>
            <Avatar src={notification.user.avatar} sx={{ width: 40, height: 40 }} />
            <Box
              sx={{
                position: 'absolute',
                bottom: -2,
                right: -2,
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: theme.palette.background.paper,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {getIcon()}
            </Box>
          </Box>

          {/* 通知内容 */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={notification.read ? 400 : 600}>
              <strong>{notification.user.name}</strong> {notification.message}
            </Typography>

            {notification.content && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: 'block',
                  mt: 0.5,
                  p: 1,
                  borderRadius: 1,
                  background: alpha(theme.palette.divider, 0.05),
                }}
              >
                "{notification.content}"
              </Typography>
            )}

            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
              <Typography variant="caption" color="text.secondary">
                {formatDistanceToNow(notification.timestamp)}
              </Typography>
              {!notification.read && (
                <FiberManualRecordIcon
                  sx={{ fontSize: 8, color: 'primary.main' }}
                />
              )}
            </Stack>
          </Box>

          {/* 删除按钮 */}
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(notification.id);
            }}
            sx={{ opacity: 0.5, '&:hover': { opacity: 1, color: 'error.main' } }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Paper>
    </motion.div>
  );
};

const NotificationCenter = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications =
    tab === 0
      ? notifications
      : notifications.filter((n) => !n.read);

  return (
    <>
      {/* 通知按钮 */}
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <IconButton onClick={() => setOpen(true)} color="inherit">
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </motion.div>

      {/* 通知抽屉 */}
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 420 },
            background: theme.palette.background.default,
          },
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* 头部 */}
          <Box
            sx={{
              p: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              color: 'white',
            }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" fontWeight={700}>
                通知中心
              </Typography>
              <IconButton
                onClick={() => setOpen(false)}
                sx={{ color: 'white' }}
              >
                <CloseIcon />
              </IconButton>
            </Stack>

            {unreadCount > 0 && (
              <Chip
                label={`${unreadCount} 条未读`}
                size="small"
                sx={{
                  mt: 1,
                  background: alpha('#fff', 0.2),
                  color: 'white',
                  fontWeight: 600,
                }}
              />
            )}
          </Box>

          {/* 标签页 */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tab}
              onChange={(e, newValue) => setTab(newValue)}
              variant="fullWidth"
            >
              <Tab label="全部" />
              <Tab label={`未读 (${unreadCount})`} />
            </Tabs>
          </Box>

          {/* 操作按钮 */}
          {notifications.length > 0 && (
            <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Stack direction="row" spacing={1}>
                {unreadCount > 0 && (
                  <Button
                    size="small"
                    startIcon={<MarkEmailReadIcon />}
                    onClick={handleMarkAllAsRead}
                    sx={{ borderRadius: 2 }}
                  >
                    全部已读
                  </Button>
                )}
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteSweepIcon />}
                  onClick={handleClearAll}
                  sx={{ borderRadius: 2 }}
                >
                  清空全部
                </Button>
              </Stack>
            </Box>
          )}

          {/* 通知列表 */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            <AnimatePresence>
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRead={handleMarkAsRead}
                    onDelete={handleDelete}
                  />
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 8,
                    }}
                  >
                    <NotificationsIcon
                      sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }}
                    />
                    <Typography variant="h6" color="text.secondary">
                      暂无{tab === 1 ? '未读' : ''}通知
                    </Typography>
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default NotificationCenter;
