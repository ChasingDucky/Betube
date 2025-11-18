import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  useTheme,
  alpha,
  Fade,
  Slide,
  Stack,
  Button,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '../services/api';
import VideoCardEnhanced from '../components/VideoCardEnhanced';
import { VideoGridSkeleton } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import SortIcon from '@mui/icons-material/Sort';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import useAuthStore from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const WatchLaterEnhanced = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const [sortAnchor, setSortAnchor] = useState(null);
  const [sortBy, setSortBy] = useState('date_added');

  const { data, isLoading } = useQuery({
    queryKey: ['watchLater', sortBy],
    queryFn: async () => {
      const response = await userAPI.getWatchLater({ sort: sortBy });
      return response.data;
    },
    enabled: isAuthenticated,
  });

  const removeVideoMutation = useMutation({
    mutationFn: (videoId) => userAPI.removeFromWatchLater(videoId),
    onSuccess: () => {
      queryClient.invalidateQueries(['watchLater']);
      toast.success('已从稍后观看中移除');
    },
    onError: () => {
      toast.error('移除失败，请重试');
    },
  });

  const clearAllMutation = useMutation({
    mutationFn: () => userAPI.clearWatchLater(),
    onSuccess: () => {
      queryClient.invalidateQueries(['watchLater']);
      toast.success('已清空稍后观看列表');
    },
    onError: () => {
      toast.error('清空失败，请重试');
    },
  });

  const playAll = () => {
    if (data?.videos && data.videos.length > 0) {
      navigate(`/watch/${data.videos[0]._id}`);
    }
  };

  const shufflePlay = () => {
    if (data?.videos && data.videos.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.videos.length);
      navigate(`/watch/${data.videos[randomIndex]._id}`);
    }
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <EmptyState
          type="favorite"
          title="请先登录"
          description="登录后即可保存稍后观看的视频"
        />
      </Container>
    );
  }

  const sortOptions = [
    { label: '添加时间（新到旧）', value: 'date_added' },
    { label: '添加时间（旧到新）', value: 'date_added_asc' },
    { label: '视频标题', value: 'title' },
    { label: '观看次数', value: 'views' },
  ];

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        background: `linear-gradient(180deg,
          ${alpha(theme.palette.background.default, 1)} 0%,
          ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* 页面标题 */}
        <Slide direction="down" in timeout={500}>
          <Box sx={{ mb: 4 }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              spacing={2}
            >
              <Box>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <WatchLaterIcon sx={{ fontSize: 32, color: 'white' }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h4"
                      fontWeight={700}
                      sx={{
                        background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      稍后观看
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {data?.videos?.length || 0} 个视频
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {data?.videos?.length > 0 && (
                <Stack direction="row" spacing={1}>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="contained"
                      startIcon={<PlayArrowIcon />}
                      onClick={playAll}
                      sx={{
                        borderRadius: 2,
                        background:
                          'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                        '&:hover': {
                          boxShadow: '0 6px 24px rgba(78, 205, 196, 0.4)',
                        },
                      }}
                    >
                      播放全部
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outlined"
                      startIcon={<ShuffleIcon />}
                      onClick={shufflePlay}
                      sx={{ borderRadius: 2 }}
                    >
                      随机播放
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outlined"
                      startIcon={<SortIcon />}
                      onClick={(e) => setSortAnchor(e.currentTarget)}
                      sx={{ borderRadius: 2 }}
                    >
                      排序
                    </Button>
                  </motion.div>
                </Stack>
              )}
            </Stack>
          </Box>
        </Slide>

        {/* 统计卡片 */}
        {data?.videos?.length > 0 && (
          <Fade in timeout={600}>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    background: `linear-gradient(135deg,
                      ${alpha(theme.palette.primary.main, 0.1)} 0%,
                      ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                  }}
                >
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    总数量
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {data.videos.length}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    background: `linear-gradient(135deg,
                      ${alpha(theme.palette.secondary.main, 0.1)} 0%,
                      ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                  }}
                >
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    总时长
                  </Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {Math.floor(
                      (data.videos.reduce((sum, v) => sum + (v.duration || 0), 0) || 0) /
                        60
                    )}{' '}
                    分钟
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    background: `linear-gradient(135deg,
                      ${alpha(theme.palette.success.main, 0.1)} 0%,
                      ${alpha(theme.palette.success.main, 0.05)} 100%)`,
                  }}
                >
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    当前排序
                  </Typography>
                  <Typography variant="body1" fontWeight={700}>
                    {sortOptions.find((o) => o.value === sortBy)?.label.split('（')[0]}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Paper
                    elevation={0}
                    onClick={() => clearAllMutation.mutate()}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                      background: `linear-gradient(135deg,
                        ${alpha(theme.palette.error.main, 0.1)} 0%,
                        ${alpha(theme.palette.error.main, 0.05)} 100%)`,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: `0 4px 16px ${alpha(theme.palette.error.main, 0.2)}`,
                      },
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <DeleteSweepIcon color="error" />
                      <Box>
                        <Typography
                          variant="caption"
                          color="error.main"
                          fontWeight={600}
                        >
                          清空列表
                        </Typography>
                        <Typography variant="body2" color="error.main" fontWeight={700}>
                          移除全部
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </Fade>
        )}

        {/* 视频列表 */}
        {isLoading ? (
          <VideoGridSkeleton count={12} />
        ) : data?.videos && data.videos.length > 0 ? (
          <Fade in timeout={700}>
            <Grid container spacing={3}>
              <AnimatePresence>
                {data.videos.map((video, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        <VideoCardEnhanced video={video} index={index} />

                        {/* 移除按钮 */}
                        <motion.div
                          style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            zIndex: 10,
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => removeVideoMutation.mutate(video._id)}
                            sx={{
                              background: alpha('#000', 0.6),
                              backdropFilter: 'blur(10px)',
                              color: 'white',
                              '&:hover': {
                                background: alpha(theme.palette.error.main, 0.8),
                              },
                            }}
                          >
                            <RemoveCircleOutlineIcon fontSize="small" />
                          </IconButton>
                        </motion.div>

                        {/* 序号标签 */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            zIndex: 10,
                          }}
                        >
                          <Chip
                            label={`#${index + 1}`}
                            size="small"
                            sx={{
                              background: alpha('#000', 0.7),
                              backdropFilter: 'blur(10px)',
                              color: 'white',
                              fontWeight: 700,
                            }}
                          />
                        </Box>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          </Fade>
        ) : (
          <EmptyState
            type="favorite"
            title="稍后观看列表为空"
            description="保存你感兴趣的视频，随时观看"
            actionText="去探索"
            onAction={() => navigate('/explore')}
          />
        )}

        {/* 排序菜单 */}
        <Menu
          anchorEl={sortAnchor}
          open={Boolean(sortAnchor)}
          onClose={() => setSortAnchor(null)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              minWidth: 220,
            },
          }}
        >
          {sortOptions.map((option) => (
            <MenuItem
              key={option.value}
              onClick={() => {
                setSortBy(option.value);
                setSortAnchor(null);
              }}
              selected={sortBy === option.value}
            >
              <ListItemIcon>
                <SortIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{option.label}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </Container>
    </Box>
  );
};

export default WatchLaterEnhanced;
