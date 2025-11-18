import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Button,
  Tabs,
  Tab,
  Grid,
  Stack,
  Paper,
  useTheme,
  alpha,
  Fade,
  Slide,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '../services/api';
import useAuthStore from '../stores/authStore';
import VideoCardEnhanced from '../components/VideoCardEnhanced';
import LoadingAnimation from '../components/LoadingAnimation';
import EmptyState from '../components/EmptyState';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PeopleIcon from '@mui/icons-material/People';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import toast from 'react-hot-toast';

const UserProfileEnhanced = () => {
  const theme = useTheme();
  const { userId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const [tab, setTab] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // 获取用户信息
  const { data: profileData, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await userAPI.getUserProfile(userId);
      return response.data;
    },
  });

  // 获取用户视频
  const { data: videosData } = useQuery({
    queryKey: ['userVideos', userId],
    queryFn: async () => {
      const response = await userAPI.getUserVideos(userId);
      return response.data;
    },
  });

  // 初始化订阅状态
  useEffect(() => {
    if (profileData && currentUser) {
      setIsSubscribed(currentUser.subscriptions?.includes(userId));
    }
  }, [profileData, currentUser, userId]);

  // 订阅/取消订阅
  const subscribeMutation = useMutation({
    mutationFn: () =>
      isSubscribed ? userAPI.unsubscribe(userId) : userAPI.subscribe(userId),
    onSuccess: () => {
      setIsSubscribed(!isSubscribed);
      toast.success(isSubscribed ? '已取消订阅' : '订阅成功！');
      queryClient.invalidateQueries(['user', userId]);
    },
    onError: () => {
      toast.error('操作失败，请重试');
    },
  });

  if (isLoading || !profileData) {
    return <LoadingAnimation message="正在加载用户信息..." />;
  }

  const isOwnProfile = currentUser?._id === userId;
  const user = profileData.user;

  // 计算统计数据
  const stats = [
    {
      icon: <VideoLibraryIcon />,
      label: '视频',
      value: user?.videoCount || videosData?.videos?.length || 0,
      color: theme.palette.primary.main,
    },
    {
      icon: <PeopleIcon />,
      label: '订阅者',
      value: user?.subscribers?.toLocaleString() || 0,
      color: theme.palette.secondary.main,
    },
    {
      icon: <VisibilityIcon />,
      label: '总观看',
      value: user?.totalViews?.toLocaleString() || 0,
      color: theme.palette.success.main,
    },
    {
      icon: <ThumbUpIcon />,
      label: '总点赞',
      value: user?.totalLikes?.toLocaleString() || 0,
      color: theme.palette.error.main,
    },
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
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* 封面横幅 */}
        <Fade in timeout={500}>
          <Box
            sx={{
              height: 200,
              borderRadius: 4,
              mb: -8,
              background: `linear-gradient(135deg,
                ${alpha(theme.palette.primary.main, 0.3)} 0%,
                ${alpha(theme.palette.secondary.main, 0.3)} 100%)`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* 装饰图案 */}
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.3)} 0%, transparent 70%)`,
              }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: -50,
                left: -50,
                width: 250,
                height: 250,
                borderRadius: '50%',
                background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.3)} 0%, transparent 70%)`,
              }}
            />
          </Box>
        </Fade>

        {/* 用户信息卡片 */}
        <Slide direction="up" in timeout={600}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              mb: 3,
              borderRadius: 4,
              background: alpha(theme.palette.background.paper, 0.9),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems="center">
              {/* 头像 */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Avatar
                  src={user?.avatar}
                  alt={user?.name}
                  sx={{
                    width: 140,
                    height: 140,
                    border: `5px solid ${theme.palette.background.paper}`,
                    boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`,
                  }}
                />
              </motion.div>

              {/* 用户信息 */}
              <Box sx={{ flex: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{
                      mb: 1,
                      background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {user?.name}
                  </Typography>

                  {user?.email && isOwnProfile && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {user.email}
                    </Typography>
                  )}

                  {user?.bio && (
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        maxWidth: 600,
                        mx: { xs: 'auto', sm: 0 },
                      }}
                    >
                      {user.bio}
                    </Typography>
                  )}

                  {/* 操作按钮 */}
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ mt: 2, justifyContent: { xs: 'center', sm: 'flex-start' } }}
                  >
                    {!isOwnProfile && (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant={isSubscribed ? 'outlined' : 'contained'}
                          size="large"
                          startIcon={
                            isSubscribed ? (
                              <NotificationsIcon />
                            ) : (
                              <NotificationsOutlinedIcon />
                            )
                          }
                          onClick={() => {
                            if (!isAuthenticated) {
                              toast.error('请先登录');
                              navigate('/login');
                              return;
                            }
                            subscribeMutation.mutate();
                          }}
                          disabled={subscribeMutation.isPending}
                          sx={{
                            borderRadius: 2,
                            fontWeight: 600,
                            px: 4,
                            background: isSubscribed
                              ? 'transparent'
                              : 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                            '&:hover': {
                              boxShadow: isSubscribed
                                ? 'none'
                                : '0 6px 24px rgba(78, 205, 196, 0.4)',
                            },
                          }}
                        >
                          {isSubscribed ? '已订阅' : '订阅'}
                        </Button>
                      </motion.div>
                    )}

                    {isOwnProfile && (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outlined"
                          size="large"
                          startIcon={<SettingsIcon />}
                          sx={{
                            borderRadius: 2,
                            fontWeight: 600,
                            px: 4,
                          }}
                        >
                          编辑资料
                        </Button>
                      </motion.div>
                    )}
                  </Stack>
                </motion.div>
              </Box>
            </Stack>
          </Paper>
        </Slide>

        {/* 统计卡片 */}
        <Fade in timeout={700}>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {stats.map((stat, index) => (
              <Grid item xs={6} sm={3} key={stat.label}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: `linear-gradient(135deg,
                        ${alpha(stat.color, 0.1)} 0%,
                        ${alpha(stat.color, 0.05)} 100%)`,
                      border: `1px solid ${alpha(stat.color, 0.2)}`,
                      transition: 'all 0.3s',
                      '&:hover': {
                        boxShadow: `0 8px 24px ${alpha(stat.color, 0.2)}`,
                      },
                    }}
                  >
                    <Stack spacing={1} alignItems="center">
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: alpha(stat.color, 0.15),
                          color: stat.color,
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Typography
                        variant="h5"
                        fontWeight={700}
                        sx={{ color: stat.color }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        {stat.label}
                      </Typography>
                    </Stack>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Fade>

        {/* 标签页 */}
        <Slide direction="up" in timeout={800}>
          <Paper
            elevation={0}
            sx={{
              mb: 3,
              borderRadius: 3,
              overflow: 'hidden',
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
                  minHeight: 56,
                },
                '& .Mui-selected': {
                  color: 'primary.main',
                },
              }}
            >
              <Tab label="视频" />
              <Tab label="关于" />
            </Tabs>
          </Paper>
        </Slide>

        {/* 标签页内容 */}
        <AnimatePresence mode="wait">
          {/* 视频列表 */}
          {tab === 0 && (
            <motion.div
              key="videos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {videosData?.videos && videosData.videos.length > 0 ? (
                <Grid container spacing={3}>
                  {videosData.videos.map((video, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
                      <VideoCardEnhanced video={video} index={index} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <EmptyState
                  type="video"
                  title={isOwnProfile ? '还没有上传视频' : '该用户还没有上传视频'}
                  description={
                    isOwnProfile
                      ? '上传你的第一个视频，开始创作之旅'
                      : '换个用户看看吧'
                  }
                  actionText={isOwnProfile ? '去上传' : null}
                  onAction={isOwnProfile ? () => navigate('/upload') : null}
                />
              )}
            </motion.div>
          )}

          {/* 关于 */}
          {tab === 1 && (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: `linear-gradient(135deg,
                    ${alpha(theme.palette.primary.main, 0.05)} 0%,
                    ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight={700}
                  sx={{
                    mb: 3,
                    background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  频道信息
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Stack spacing={3}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      简介
                    </Typography>
                    <Typography variant="body1">
                      {user?.bio || '该用户还没有填写简介'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      加入时间
                    </Typography>
                    <Typography variant="body1">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : '未知'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      统计数据
                    </Typography>
                    <Grid container spacing={2}>
                      {stats.map((stat) => (
                        <Grid item xs={6} key={stat.label}>
                          <Paper
                            elevation={0}
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              background: alpha(theme.palette.background.paper, 0.5),
                              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            }}
                          >
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                              <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                              <Box>
                                <Typography variant="h6" fontWeight={700}>
                                  {stat.value}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {stat.label}
                                </Typography>
                              </Box>
                            </Stack>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Stack>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </Box>
  );
};

export default UserProfileEnhanced;
