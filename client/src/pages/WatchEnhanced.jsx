import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Avatar,
  Button,
  Stack,
  Divider,
  IconButton,
  Chip,
  Paper,
  useTheme,
  alpha,
  Fade,
  Slide,
  Tooltip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { videoAPI, userAPI } from '../services/api';
import VideoPlayer from '../components/VideoPlayer';
import CommentSection from '../components/CommentSection';
import VideoCardEnhanced from '../components/VideoCardEnhanced';
import LoadingAnimation from '../components/LoadingAnimation';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { formatDistanceToNow } from '../utils/dateUtils';
import useAuthStore from '../stores/authStore';
import toast from 'react-hot-toast';

const WatchEnhanced = () => {
  const theme = useTheme();
  const { videoId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [localLikes, setLocalLikes] = useState(0);

  // 获取视频信息
  const { data: video, isLoading } = useQuery({
    queryKey: ['video', videoId],
    queryFn: async () => {
      const response = await videoAPI.getVideoById(videoId);
      return response.data;
    },
  });

  // 获取推荐视频
  const { data: recommendedVideos } = useQuery({
    queryKey: ['recommended-videos'],
    queryFn: async () => {
      const response = await videoAPI.getRecommended();
      return response.data;
    },
  });

  // 初始化点赞状态
  useEffect(() => {
    if (video) {
      setLocalLikes(video.likes || 0);
      // 检查当前用户是否已点赞
      if (isAuthenticated && video.likedBy?.includes(user?._id)) {
        setIsLiked(true);
      }
      // 检查当前用户是否已订阅
      if (isAuthenticated && user?.subscriptions?.includes(video.author?._id)) {
        setIsSubscribed(true);
      }
    }
  }, [video, isAuthenticated, user]);

  // 增加观看次数
  useEffect(() => {
    if (videoId) {
      videoAPI.incrementViews(videoId);
      if (isAuthenticated) {
        userAPI.addToHistory(videoId);
      }
    }
  }, [videoId, isAuthenticated]);

  // 点赞/取消点赞
  const likeMutation = useMutation({
    mutationFn: () =>
      isLiked ? videoAPI.unlikeVideo(videoId) : videoAPI.likeVideo(videoId),
    onMutate: async () => {
      // 乐观更新
      const previousLiked = isLiked;
      const previousLikes = localLikes;

      setIsLiked(!isLiked);
      setLocalLikes(isLiked ? localLikes - 1 : localLikes + 1);

      return { previousLiked, previousLikes };
    },
    onError: (err, variables, context) => {
      // 回滚
      setIsLiked(context.previousLiked);
      setLocalLikes(context.previousLikes);
      toast.error('操作失败，请重试');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['video', videoId]);
    },
  });

  // 订阅/取消订阅
  const subscribeMutation = useMutation({
    mutationFn: () =>
      isSubscribed
        ? userAPI.unsubscribe(video.author._id)
        : userAPI.subscribe(video.author._id),
    onSuccess: () => {
      setIsSubscribed(!isSubscribed);
      toast.success(isSubscribed ? '已取消订阅' : '订阅成功！');
      queryClient.invalidateQueries(['video', videoId]);
    },
    onError: () => {
      toast.error('操作失败，请重试');
    },
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: video.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('链接已复制到剪贴板');
    }
  };

  const handleDownload = () => {
    toast.success('下载功能开发中');
  };

  if (isLoading || !video) {
    return <LoadingAnimation message="正在加载视频..." />;
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
      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* 主视频区域 */}
          <Grid item xs={12} lg={8}>
            <Fade in timeout={500}>
              <Box>
                {/* 视频播放器 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      width: '100%',
                      mb: 2,
                      borderRadius: 3,
                      overflow: 'hidden',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                  >
                    <VideoPlayer videoId={videoId} videoUrl={video.videoUrl} />
                  </Paper>
                </motion.div>

                {/* 视频标题 */}
                <Slide direction="right" in timeout={600}>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    sx={{
                      mb: 2,
                      background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {video.title}
                  </Typography>
                </Slide>

                {/* 标签 */}
                <Fade in timeout={700}>
                  <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                    {video.tags?.map((tag, index) => (
                      <motion.div
                        key={tag}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Chip
                          label={`#${tag}`}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            '&:hover': {
                              background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.secondary.main, 0.2)} 100%)`,
                              transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.3s',
                          }}
                        />
                      </motion.div>
                    ))}
                  </Stack>
                </Fade>

                {/* 作者信息和操作按钮 */}
                <Slide direction="up" in timeout={800}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 3,
                      background: alpha(theme.palette.background.paper, 0.8),
                      backdropFilter: 'blur(20px)',
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                  >
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      alignItems={{ xs: 'flex-start', sm: 'center' }}
                      justifyContent="space-between"
                      spacing={2}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Avatar
                            src={video.author?.avatar}
                            alt={video.author?.name}
                            sx={{
                              width: 56,
                              height: 56,
                              border: `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                              boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.2)}`,
                              cursor: 'pointer',
                            }}
                            onClick={() => navigate(`/user/${video.author._id}`)}
                          />
                        </motion.div>
                        <Box>
                          <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                            onClick={() => navigate(`/user/${video.author._id}`)}
                          >
                            {video.author?.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {video.author?.subscribers?.toLocaleString() || 0} 订阅者
                          </Typography>
                        </Box>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant={isSubscribed ? 'outlined' : 'contained'}
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
                              px: 3,
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
                      </Stack>

                      <Stack direction="row" spacing={1}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Tooltip title={isLiked ? '取消点赞' : '点赞'}>
                            <Button
                              variant="outlined"
                              startIcon={
                                <motion.div
                                  animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
                                  transition={{ duration: 0.3 }}
                                >
                                  {isLiked ? (
                                    <ThumbUpIcon color="primary" />
                                  ) : (
                                    <ThumbUpOutlinedIcon />
                                  )}
                                </motion.div>
                              }
                              onClick={() => {
                                if (!isAuthenticated) {
                                  toast.error('请先登录');
                                  navigate('/login');
                                  return;
                                }
                                likeMutation.mutate();
                              }}
                              disabled={likeMutation.isPending}
                              sx={{
                                borderRadius: 2,
                                fontWeight: 600,
                                borderColor: isLiked ? 'primary.main' : 'divider',
                              }}
                            >
                              {localLikes.toLocaleString()}
                            </Button>
                          </Tooltip>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Tooltip title="分享">
                            <IconButton
                              onClick={handleShare}
                              sx={{
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 2,
                                '&:hover': {
                                  background: alpha(theme.palette.primary.main, 0.1),
                                },
                              }}
                            >
                              <ShareIcon />
                            </IconButton>
                          </Tooltip>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Tooltip title="下载">
                            <IconButton
                              onClick={handleDownload}
                              sx={{
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 2,
                                '&:hover': {
                                  background: alpha(theme.palette.primary.main, 0.1),
                                },
                              }}
                            >
                              <DownloadIcon />
                            </IconButton>
                          </Tooltip>
                        </motion.div>
                      </Stack>
                    </Stack>
                  </Paper>
                </Slide>

                {/* 视频信息 */}
                <Fade in timeout={900}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      mb: 3,
                      borderRadius: 3,
                      background: `linear-gradient(135deg,
                        ${alpha(theme.palette.primary.main, 0.05)} 0%,
                        ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                      border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                    }}
                  >
                    <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <VisibilityIcon
                          sx={{ fontSize: 20, color: 'text.secondary' }}
                        />
                        <Typography variant="body2" fontWeight={600}>
                          {video.views?.toLocaleString() || 0} 次观看
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <AccessTimeIcon
                          sx={{ fontSize: 20, color: 'text.secondary' }}
                        />
                        <Typography variant="body2" fontWeight={600}>
                          {formatDistanceToNow(video.createdAt)}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    <AnimatePresence mode="wait">
                      <motion.div
                        key={showFullDescription ? 'full' : 'truncated'}
                        initial={{ opacity: 0, height: 'auto' }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            whiteSpace: showFullDescription ? 'pre-wrap' : 'pre-line',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: showFullDescription ? 'block' : '-webkit-box',
                            WebkitLineClamp: showFullDescription ? 'unset' : 3,
                            WebkitBoxOrient: 'vertical',
                            lineHeight: 1.6,
                          }}
                        >
                          {video.description || '暂无简介'}
                        </Typography>
                      </motion.div>
                    </AnimatePresence>

                    {video.description && video.description.length > 100 && (
                      <motion.div whileHover={{ scale: 1.02 }}>
                        <Button
                          size="small"
                          onClick={() => setShowFullDescription(!showFullDescription)}
                          sx={{
                            mt: 1,
                            fontWeight: 600,
                            color: 'primary.main',
                          }}
                        >
                          {showFullDescription ? '收起' : '展开'}
                        </Button>
                      </motion.div>
                    )}
                  </Paper>
                </Fade>

                {/* 评论区 */}
                <Fade in timeout={1000}>
                  <Box>
                    <CommentSection videoId={videoId} />
                  </Box>
                </Fade>
              </Box>
            </Fade>
          </Grid>

          {/* 推荐视频侧边栏 */}
          <Grid item xs={12} lg={4}>
            <Slide direction="left" in timeout={700}>
              <Box>
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
                  推荐视频
                </Typography>

                <Stack spacing={2}>
                  {recommendedVideos?.videos?.slice(0, 10).map((recommendedVideo, index) => (
                    <motion.div
                      key={recommendedVideo._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Box
                        onClick={() => navigate(`/watch/${recommendedVideo._id}`)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            p: 1.5,
                            borderRadius: 2,
                            transition: 'all 0.3s',
                            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                            '&:hover': {
                              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                              transform: 'translateX(-4px)',
                              background: alpha(theme.palette.primary.main, 0.03),
                            },
                          }}
                        >
                          <Stack direction="row" spacing={1.5}>
                            <Box
                              sx={{
                                width: 168,
                                height: 94,
                                borderRadius: 1.5,
                                overflow: 'hidden',
                                flexShrink: 0,
                                position: 'relative',
                              }}
                            >
                              <img
                                src={recommendedVideo.thumbnail}
                                alt={recommendedVideo.title}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                }}
                              />
                              <Box
                                sx={{
                                  position: 'absolute',
                                  bottom: 4,
                                  right: 4,
                                  px: 0.5,
                                  py: 0.25,
                                  borderRadius: 0.5,
                                  background: 'rgba(0, 0, 0, 0.8)',
                                }}
                              >
                                <Typography variant="caption" color="white" fontWeight={600}>
                                  {recommendedVideo.duration || '00:00'}
                                </Typography>
                              </Box>
                            </Box>

                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                variant="body2"
                                fontWeight={600}
                                sx={{
                                  mb: 0.5,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  lineHeight: 1.4,
                                }}
                              >
                                {recommendedVideo.title}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: 'block', mb: 0.5 }}
                              >
                                {recommendedVideo.author?.name}
                              </Typography>
                              <Stack direction="row" spacing={1}>
                                <Typography variant="caption" color="text.secondary">
                                  {recommendedVideo.views?.toLocaleString() || 0} 次观看
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  •
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {formatDistanceToNow(recommendedVideo.createdAt)}
                                </Typography>
                              </Stack>
                            </Box>
                          </Stack>
                        </Paper>
                      </Box>
                    </motion.div>
                  ))}
                </Stack>
              </Box>
            </Slide>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default WatchEnhanced;
