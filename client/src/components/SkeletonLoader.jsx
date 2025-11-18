import React from 'react';
import { Box, Grid, Paper, Skeleton, Stack, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';

// 视频卡片骨架屏
export const VideoCardSkeleton = () => {
  const theme = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        {/* 缩略图骨架 */}
        <Skeleton
          variant="rectangular"
          animation="wave"
          sx={{
            width: '100%',
            paddingTop: '56.25%', // 16:9
            background: `linear-gradient(90deg,
              ${alpha(theme.palette.primary.main, 0.05)} 0%,
              ${alpha(theme.palette.secondary.main, 0.05)} 50%,
              ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
          }}
        />

        {/* 内容骨架 */}
        <Box sx={{ p: 2 }}>
          <Stack direction="row" spacing={1.5} sx={{ mb: 1.5 }}>
            <Skeleton
              variant="circular"
              width={40}
              height={40}
              animation="wave"
            />
            <Box sx={{ flex: 1 }}>
              <Skeleton
                variant="text"
                animation="wave"
                sx={{ fontSize: '1rem', mb: 0.5 }}
              />
              <Skeleton
                variant="text"
                animation="wave"
                sx={{ fontSize: '0.875rem', width: '60%' }}
              />
            </Box>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Skeleton variant="text" animation="wave" sx={{ width: '30%' }} />
            <Skeleton variant="text" animation="wave" sx={{ width: '30%' }} />
          </Stack>
        </Box>
      </Paper>
    </motion.div>
  );
};

// 视频网格骨架屏
export const VideoGridSkeleton = ({ count = 8 }) => {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <VideoCardSkeleton />
        </Grid>
      ))}
    </Grid>
  );
};

// 用户资料骨架屏
export const UserProfileSkeleton = () => {
  const theme = useTheme();

  return (
    <Box>
      {/* 封面 */}
      <Skeleton
        variant="rectangular"
        animation="wave"
        sx={{
          height: 200,
          borderRadius: 4,
          mb: -8,
        }}
      />

      {/* 用户卡片 */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 3,
          borderRadius: 4,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Stack direction="row" spacing={3} alignItems="center">
          <Skeleton
            variant="circular"
            width={140}
            height={140}
            animation="wave"
          />
          <Box sx={{ flex: 1 }}>
            <Skeleton
              variant="text"
              animation="wave"
              sx={{ fontSize: '2rem', width: '40%', mb: 1 }}
            />
            <Skeleton
              variant="text"
              animation="wave"
              sx={{ fontSize: '1rem', width: '60%', mb: 2 }}
            />
            <Skeleton
              variant="rectangular"
              animation="wave"
              sx={{ width: 120, height: 40, borderRadius: 2 }}
            />
          </Box>
        </Stack>
      </Paper>

      {/* 统计卡片 */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={6} sm={3} key={i}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              }}
            >
              <Stack spacing={1} alignItems="center">
                <Skeleton variant="rectangular" width={48} height={48} sx={{ borderRadius: 2 }} />
                <Skeleton variant="text" width={60} sx={{ fontSize: '1.5rem' }} />
                <Skeleton variant="text" width={80} />
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// 评论骨架屏
export const CommentSkeleton = () => {
  const theme = useTheme();

  return (
    <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
      <Skeleton variant="circular" width={40} height={40} animation="wave" />
      <Box sx={{ flex: 1 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 0.5 }}>
          <Skeleton variant="text" width={100} animation="wave" />
          <Skeleton variant="text" width={80} animation="wave" />
        </Stack>
        <Skeleton variant="text" animation="wave" sx={{ width: '90%', mb: 0.5 }} />
        <Skeleton variant="text" animation="wave" sx={{ width: '70%', mb: 1 }} />
        <Stack direction="row" spacing={2}>
          <Skeleton variant="text" width={60} animation="wave" />
          <Skeleton variant="text" width={60} animation="wave" />
        </Stack>
      </Box>
    </Stack>
  );
};

// 评论区骨架屏
export const CommentsSkeleton = ({ count = 5 }) => {
  return (
    <Box>
      {Array.from({ length: count }).map((_, index) => (
        <CommentSkeleton key={index} />
      ))}
    </Box>
  );
};

// 视频播放页骨架屏
export const WatchPageSkeleton = () => {
  const theme = useTheme();

  return (
    <Box sx={{ py: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          {/* 播放器 */}
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{
              width: '100%',
              paddingTop: '56.25%',
              borderRadius: 3,
              mb: 2,
            }}
          />

          {/* 标题 */}
          <Skeleton
            variant="text"
            animation="wave"
            sx={{ fontSize: '2rem', mb: 2 }}
          />

          {/* 标签 */}
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                width={80}
                height={28}
                sx={{ borderRadius: 2 }}
              />
            ))}
          </Stack>

          {/* 作者信息 */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Skeleton variant="circular" width={56} height={56} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width={150} sx={{ fontSize: '1.2rem' }} />
                <Skeleton variant="text" width={100} />
              </Box>
              <Skeleton variant="rectangular" width={100} height={40} sx={{ borderRadius: 2 }} />
            </Stack>
          </Paper>

          {/* 描述 */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="100%" />
            <Skeleton variant="text" width="80%" />
          </Paper>

          {/* 评论 */}
          <CommentsSkeleton count={3} />
        </Grid>

        {/* 推荐视频 */}
        <Grid item xs={12} lg={4}>
          <Skeleton variant="text" sx={{ fontSize: '1.5rem', mb: 3 }} />
          <Stack spacing={2}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Paper
                key={i}
                elevation={0}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <Stack direction="row" spacing={1.5}>
                  <Skeleton
                    variant="rectangular"
                    width={168}
                    height={94}
                    sx={{ borderRadius: 1.5 }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" sx={{ fontSize: '0.9rem', mb: 0.5 }} />
                    <Skeleton variant="text" sx={{ fontSize: '0.9rem', mb: 0.5 }} />
                    <Skeleton variant="text" width="60%" />
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

// 搜索页骨架屏
export const SearchPageSkeleton = () => {
  return (
    <Box>
      {/* 搜索框 */}
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" sx={{ fontSize: '2rem', mb: 2, width: '30%' }} />
        <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 3, mb: 2 }} />
      </Box>

      {/* 筛选 */}
      <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} variant="rectangular" width={100} height={40} sx={{ borderRadius: 2 }} />
        ))}
      </Stack>

      {/* 结果 */}
      <VideoGridSkeleton count={12} />
    </Box>
  );
};

export default {
  VideoCardSkeleton,
  VideoGridSkeleton,
  UserProfileSkeleton,
  CommentSkeleton,
  CommentsSkeleton,
  WatchPageSkeleton,
  SearchPageSkeleton,
};
