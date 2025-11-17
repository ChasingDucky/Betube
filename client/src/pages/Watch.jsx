import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
} from '@mui/material';
import { useQuery, useMutation } from '@tanstack/react-query';
import { videoAPI, userAPI } from '../services/api';
import VideoPlayer from '../components/VideoPlayer';
import CommentSection from '../components/CommentSection';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ShareIcon from '@mui/icons-material/Share';
import DownloadIcon from '@mui/icons-material/Download';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { formatDistanceToNow } from '../utils/dateUtils';
import useAuthStore from '../stores/authStore';

const Watch = () => {
  const { videoId } = useParams();
  const { isAuthenticated } = useAuthStore();
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // 获取视频信息
  const { data: video, isLoading } = useQuery({
    queryKey: ['video', videoId],
    queryFn: async () => {
      const response = await videoAPI.getVideoById(videoId);
      return response.data;
    },
  });

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
    onSuccess: () => {
      setIsLiked(!isLiked);
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
    },
  });

  if (isLoading || !video) {
    return <Box>加载中...</Box>;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Grid container spacing={3}>
        {/* 主视频区域 */}
        <Grid item xs={12} lg={8}>
          {/* 视频播放器 */}
          <Box sx={{ width: '100%', mb: 2 }}>
            <VideoPlayer videoId={videoId} videoUrl={video.videoUrl} />
          </Box>

          {/* 视频标题和分类 */}
          <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
            {video.title}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            {video.tags?.map((tag) => (
              <Chip key={tag} label={tag} size="small" />
            ))}
          </Stack>

          {/* 作者信息和操作按钮 */}
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 2 }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                src={video.author?.avatar}
                alt={video.author?.name}
                sx={{ width: 48, height: 48 }}
              />
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {video.author?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {video.author?.subscribers?.toLocaleString() || 0} 订阅者
                </Typography>
              </Box>
              <Button
                variant={isSubscribed ? 'outlined' : 'contained'}
                startIcon={
                  isSubscribed ? (
                    <NotificationsIcon />
                  ) : (
                    <NotificationsOutlinedIcon />
                  )
                }
                onClick={() => subscribeMutation.mutate()}
                disabled={!isAuthenticated}
                sx={{ ml: 2 }}
              >
                {isSubscribed ? '已订阅' : '订阅'}
              </Button>
            </Stack>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={isLiked ? <ThumbUpIcon /> : <ThumbUpOutlinedIcon />}
                onClick={() => likeMutation.mutate()}
                disabled={!isAuthenticated}
              >
                {video.likes?.toLocaleString() || 0}
              </Button>
              <IconButton>
                <ShareIcon />
              </IconButton>
              <IconButton>
                <DownloadIcon />
              </IconButton>
            </Stack>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {/* 视频信息 */}
          <Paper
            sx={{
              p: 2,
              backgroundColor: 'action.hover',
              borderRadius: 2,
              mb: 3,
            }}
          >
            <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
              <Typography variant="body2" fontWeight={600}>
                {video.views?.toLocaleString() || 0} 次观看
              </Typography>
              <Typography variant="body2" fontWeight={600}>
                {formatDistanceToNow(video.createdAt)}
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              sx={{
                whiteSpace: showFullDescription ? 'pre-wrap' : 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {video.description}
            </Typography>
            {video.description?.length > 100 && (
              <Button
                size="small"
                onClick={() => setShowFullDescription(!showFullDescription)}
                sx={{ mt: 1 }}
              >
                {showFullDescription ? '收起' : '展开'}
              </Button>
            )}
          </Paper>

          {/* 评论区 */}
          <CommentSection videoId={videoId} />
        </Grid>

        {/* 推荐视频侧边栏 */}
        <Grid item xs={12} lg={4}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            推荐视频
          </Typography>
          {/* 这里可以添加推荐视频列表 */}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Watch;
