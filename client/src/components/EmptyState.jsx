import React from 'react';
import { Box, Typography, Button, Stack, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import HistoryIcon from '@mui/icons-material/History';

const iconMap = {
  video: PlayCircleOutlineIcon,
  search: SearchOffIcon,
  library: VideoLibraryIcon,
  subscription: SubscriptionsIcon,
  favorite: FavoriteBorderIcon,
  history: HistoryIcon,
};

const EmptyState = ({
  type = 'video',
  title,
  description,
  actionText,
  onAction,
  customIcon,
}) => {
  const theme = useTheme();
  const Icon = customIcon || iconMap[type] || PlayCircleOutlineIcon;

  const defaultMessages = {
    video: {
      title: '暂无视频',
      description: '换个分类试试，或者稍后再来看看',
    },
    search: {
      title: '未找到相关内容',
      description: '试试其他关键词，或浏览热门视频',
    },
    library: {
      title: '视频库为空',
      description: '开始观看视频，自动添加到视频库',
    },
    subscription: {
      title: '还没有订阅',
      description: '订阅你喜欢的UP主，获取最新视频推送',
    },
    favorite: {
      title: '暂无喜欢的视频',
      description: '为你喜欢的视频点赞，方便下次观看',
    },
    history: {
      title: '暂无历史记录',
      description: '你观看过的视频将显示在这里',
    },
  };

  const message = defaultMessages[type] || defaultMessages.video;
  const displayTitle = title || message.title;
  const displayDescription = description || message.description;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        py: 8,
        px: 2,
        textAlign: 'center',
      }}
    >
      {/* 背景装饰 */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          pointerEvents: 'none',
          opacity: 0.05,
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 300,
              height: 300,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.3)} 0%, transparent 70%)`,
            }}
          />
        </motion.div>
      </Box>

      {/* 图标 */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
        }}
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: -10,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                zIndex: -1,
              },
            }}
          >
            <Icon
              sx={{
                fontSize: 60,
                color: theme.palette.text.secondary,
                opacity: 0.6,
              }}
            />
          </Box>
        </motion.div>
      </motion.div>

      {/* 文本内容 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          color="text.primary"
          sx={{ mb: 1.5 }}
        >
          {displayTitle}
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 400, mb: 4 }}
        >
          {displayDescription}
        </Typography>
      </motion.div>

      {/* 操作按钮 */}
      {actionText && onAction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={onAction}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 600,
                background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                boxShadow: '0 4px 16px rgba(255, 107, 107, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 24px rgba(255, 107, 107, 0.4)',
                },
              }}
            >
              {actionText}
            </Button>
          </motion.div>
        </motion.div>
      )}

      {/* 装饰点 */}
      <Stack
        direction="row"
        spacing={2}
        sx={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -8, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              }}
            />
          </motion.div>
        ))}
      </Stack>
    </Box>
  );
};

export default EmptyState;
