import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const LoadingAnimation = ({ message = '加载中...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: 3,
      }}
    >
      {/* 动画图标 */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 360],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <PlayArrowIcon sx={{ fontSize: 48, color: 'white' }} />
        </Box>
      </motion.div>

      {/* 加载条 */}
      <Box sx={{ position: 'relative' }}>
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: 'primary.main',
          }}
        />
      </Box>

      {/* 加载文本 */}
      <motion.div
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Typography
          variant="h6"
          color="text.secondary"
          fontWeight={500}
        >
          {message}
        </Typography>
      </motion.div>

      {/* 装饰点 */}
      <Box sx={{ display: 'flex', gap: 1.5, mt: 2 }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          >
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #FF6B6B, #4ECDC4)',
              }}
            />
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

export default LoadingAnimation;
