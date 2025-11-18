import React from 'react';
import { Box, Typography, useTheme, alpha, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

/**
 * 增强版加载动画组件
 * 提供多种加载样式选择
 */

// 默认加载动画 - 旋转Logo
export const DefaultLoader = ({ message = '加载中...' }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        gap: 3,
      }}
    >
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
          }}
        >
          <PlayCircleIcon sx={{ fontSize: 48, color: 'white' }} />
        </Box>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Typography variant="h6" color="text.secondary" fontWeight={600}>
          {message}
        </Typography>
      </motion.div>

      {/* 脉冲圆环 */}
      <Box sx={{ position: 'relative' }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 100,
              height: 100,
              borderRadius: '50%',
              border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
            animate={{
              scale: [1, 2, 2],
              opacity: [0.5, 0.2, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.6,
              ease: 'easeOut',
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

// 进度条加载动画
export const ProgressLoader = ({ message = '加载中...', progress = null }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        gap: 3,
        px: 4,
      }}
    >
      <Typography variant="h6" color="text.secondary" fontWeight={600}>
        {message}
      </Typography>

      <Box sx={{ width: '100%', maxWidth: 400 }}>
        <Box
          sx={{
            height: 8,
            borderRadius: 4,
            background: alpha(theme.palette.divider, 0.1),
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <motion.div
            style={{
              height: '100%',
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              borderRadius: 4,
            }}
            initial={{ width: '0%' }}
            animate={{
              width: progress !== null ? `${progress}%` : ['0%', '100%'],
            }}
            transition={
              progress !== null
                ? { duration: 0.3 }
                : {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
            }
          />

          {progress === null && (
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(90deg, transparent, ${alpha('#fff', 0.3)}, transparent)`,
              }}
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}
        </Box>

        {progress !== null && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', textAlign: 'center', mt: 1 }}
          >
            {progress}%
          </Typography>
        )}
      </Box>
    </Box>
  );
};

// 点状加载动画
export const DotsLoader = ({ message = '加载中...' }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        gap: 3,
      }}
    >
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            }}
            animate={{
              y: [0, -20, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </Box>

      <Typography variant="body1" color="text.secondary" fontWeight={600}>
        {message}
      </Typography>
    </Box>
  );
};

// 旋转圆圈加载动画
export const SpinnerLoader = ({ message = '加载中...', size = 60 }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        gap: 3,
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CircularProgress
          size={size}
          thickness={4}
          sx={{
            color: theme.palette.primary.main,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />

        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <PlayCircleIcon
              sx={{
                fontSize: size * 0.5,
                color: theme.palette.primary.main,
              }}
            />
          </motion.div>
        </Box>
      </Box>

      <Typography variant="body1" color="text.secondary" fontWeight={600}>
        {message}
      </Typography>
    </Box>
  );
};

// 脉冲加载动画
export const PulseLoader = ({ message = '加载中...' }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        gap: 3,
      }}
    >
      <Box sx={{ position: 'relative', width: 100, height: 100 }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.3)} 0%, ${alpha(theme.palette.secondary.main, 0.3)} 100%)`,
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 0, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'easeInOut',
            }}
          />
        ))}

        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 60,
            height: 60,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PlayCircleIcon sx={{ fontSize: 36, color: 'white' }} />
        </Box>
      </Box>

      <Typography variant="body1" color="text.secondary" fontWeight={600}>
        {message}
      </Typography>
    </Box>
  );
};

// 主加载组件 - 可选择样式
const LoadingEnhanced = ({
  message = '加载中...',
  variant = 'default',
  progress = null,
  size = 60,
}) => {
  const loaders = {
    default: <DefaultLoader message={message} />,
    progress: <ProgressLoader message={message} progress={progress} />,
    dots: <DotsLoader message={message} />,
    spinner: <SpinnerLoader message={message} size={size} />,
    pulse: <PulseLoader message={message} />,
  };

  return loaders[variant] || loaders.default;
};

export default LoadingEnhanced;
