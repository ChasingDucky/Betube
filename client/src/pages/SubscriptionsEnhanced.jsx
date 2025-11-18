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
  Avatar,
  Button,
  Tabs,
  Tab,
  Card,
  CardContent,
  IconButton,
  Chip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '../services/api';
import VideoCardEnhanced from '../components/VideoCardEnhanced';
import { VideoGridSkeleton } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PeopleIcon from '@mui/icons-material/People';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import useAuthStore from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SubscriptionsEnhanced = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const [tab, setTab] = useState(0);

  const { data: subscriptionsData, isLoading: loadingSubscriptions } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const response = await userAPI.getSubscriptions();
      return response.data;
    },
    enabled: isAuthenticated,
  });

  const { data: videosData, isLoading: loadingVideos } = useQuery({
    queryKey: ['subscription-videos'],
    queryFn: async () => {
      const response = await userAPI.getSubscriptionVideos();
      return response.data;
    },
    enabled: isAuthenticated && tab === 0,
  });

  const unsubscribeMutation = useMutation({
    mutationFn: (userId) => userAPI.unsubscribe(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(['subscriptions']);
      toast.success('取消订阅成功');
    },
    onError: () => {
      toast.error('操作失败，请重试');
    },
  });

  if (!isAuthenticated) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <EmptyState
          type="subscription"
          title="请先登录"
          description="登录后即可订阅你喜欢的UP主"
        />
      </Container>
    );
  }

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
                <SubscriptionsIcon sx={{ fontSize: 32, color: 'white' }} />
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
                  我的订阅
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {subscriptionsData?.subscriptions?.length || 0} 个订阅
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Slide>

        {/* 统计卡片 */}
        {subscriptionsData?.subscriptions?.length > 0 && (
          <Fade in timeout={600}>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    background: `linear-gradient(135deg,
                      ${alpha(theme.palette.primary.main, 0.1)} 0%,
                      ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: alpha(theme.palette.primary.main, 0.2),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <PeopleIcon sx={{ color: 'primary.main' }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        {subscriptionsData.subscriptions.length}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        订阅的UP主
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    background: `linear-gradient(135deg,
                      ${alpha(theme.palette.secondary.main, 0.1)} 0%,
                      ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: alpha(theme.palette.secondary.main, 0.2),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <VideoLibraryIcon sx={{ color: 'secondary.main' }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        {videosData?.videos?.length || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        新视频
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    background: `linear-gradient(135deg,
                      ${alpha(theme.palette.success.main, 0.1)} 0%,
                      ${alpha(theme.palette.success.main, 0.05)} 100%)`,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background: alpha(theme.palette.success.main, 0.2),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <NotificationsIcon sx={{ color: 'success.main' }} />
                    </Box>
                    <Box>
                      <Typography variant="h4" fontWeight={700}>
                        全部
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        开启通知
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Fade>
        )}

        {/* 标签页 */}
        <Fade in timeout={700}>
          <Paper
            elevation={0}
            sx={{
              mb: 3,
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Tabs
              value={tab}
              onChange={(e, newValue) => setTab(newValue)}
              sx={{
                px: 2,
                '& .MuiTab-root': {
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                },
              }}
            >
              <Tab label="最新视频" />
              <Tab label="订阅列表" />
            </Tabs>
          </Paper>
        </Fade>

        {/* 标签页内容 */}
        <AnimatePresence mode="wait">
          {/* 最新视频 */}
          {tab === 0 && (
            <motion.div
              key="videos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {loadingVideos ? (
                <VideoGridSkeleton count={12} />
              ) : videosData?.videos && videosData.videos.length > 0 ? (
                <Grid container spacing={3}>
                  {videosData.videos.map((video, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
                      <VideoCardEnhanced video={video} index={index} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <EmptyState
                  type="subscription"
                  title="暂无新视频"
                  description="你订阅的UP主还没有发布新内容"
                />
              )}
            </motion.div>
          )}

          {/* 订阅列表 */}
          {tab === 1 && (
            <motion.div
              key="channels"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {loadingSubscriptions ? (
                <Box>加载中...</Box>
              ) : subscriptionsData?.subscriptions &&
                subscriptionsData.subscriptions.length > 0 ? (
                <Grid container spacing={3}>
                  {subscriptionsData.subscriptions.map((channel, index) => (
                    <Grid item xs={12} sm={6} md={4} key={channel._id}>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                      >
                        <Card
                          elevation={0}
                          sx={{
                            borderRadius: 3,
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            transition: 'all 0.3s',
                            '&:hover': {
                              boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
                            },
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Stack spacing={2}>
                              {/* 头像和名称 */}
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                                sx={{ cursor: 'pointer' }}
                                onClick={() => navigate(`/user/${channel._id}`)}
                              >
                                <motion.div whileHover={{ scale: 1.1 }}>
                                  <Avatar
                                    src={channel.avatar}
                                    alt={channel.name}
                                    sx={{
                                      width: 64,
                                      height: 64,
                                      border: `3px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                    }}
                                  />
                                </motion.div>

                                <Box sx={{ flex: 1 }}>
                                  <Stack direction="row" alignItems="center" spacing={1}>
                                    <Typography variant="h6" fontWeight={700}>
                                      {channel.name}
                                    </Typography>
                                    <CheckCircleIcon
                                      sx={{
                                        fontSize: 18,
                                        color: 'primary.main',
                                      }}
                                    />
                                  </Stack>
                                  <Typography variant="body2" color="text.secondary">
                                    {channel.subscribers?.toLocaleString() || 0} 订阅者
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {channel.videoCount || 0} 个视频
                                  </Typography>
                                </Box>
                              </Stack>

                              {/* 简介 */}
                              {channel.bio && (
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                  }}
                                >
                                  {channel.bio}
                                </Typography>
                              )}

                              {/* 操作按钮 */}
                              <Stack direction="row" spacing={1}>
                                <motion.div
                                  style={{ flex: 1 }}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  <Button
                                    fullWidth
                                    variant="outlined"
                                    color="error"
                                    onClick={() => unsubscribeMutation.mutate(channel._id)}
                                    disabled={unsubscribeMutation.isPending}
                                    sx={{ borderRadius: 2 }}
                                  >
                                    取消订阅
                                  </Button>
                                </motion.div>

                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <IconButton
                                    sx={{
                                      border: `1px solid ${theme.palette.divider}`,
                                      borderRadius: 2,
                                    }}
                                  >
                                    <NotificationsIcon />
                                  </IconButton>
                                </motion.div>
                              </Stack>
                            </Stack>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <EmptyState
                  type="subscription"
                  title="还没有订阅任何UP主"
                  description="探索精彩内容，订阅你喜欢的创作者"
                  actionText="去探索"
                  onAction={() => navigate('/explore')}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
};

export default SubscriptionsEnhanced;
