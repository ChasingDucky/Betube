import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
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
} from '@mui/material';
import { useQuery, useMutation } from '@tanstack/react-query';
import { userAPI } from '../services/api';
import useAuthStore from '../stores/authStore';

const UserProfile = () => {
  const { userId } = useParams();
  const { user: currentUser } = useAuthStore();
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

  // 订阅/取消订阅
  const subscribeMutation = useMutation({
    mutationFn: () =>
      isSubscribed ? userAPI.unsubscribe(userId) : userAPI.subscribe(userId),
    onSuccess: () => {
      setIsSubscribed(!isSubscribed);
    },
  });

  if (isLoading) {
    return <Box>加载中...</Box>;
  }

  const isOwnProfile = currentUser?._id === userId;

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* 用户头部 */}
      <Paper sx={{ p: 4, mb: 3, borderRadius: 3 }}>
        <Stack direction="row" spacing={3} alignItems="center">
          <Avatar
            src={profileData?.user?.avatar}
            alt={profileData?.user?.name}
            sx={{ width: 120, height: 120 }}
          />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
              {profileData?.user?.name}
            </Typography>
            <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {profileData?.user?.subscribers?.toLocaleString() || 0} 订阅者
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profileData?.user?.videoCount || 0} 个视频
              </Typography>
            </Stack>
            {!isOwnProfile && (
              <Button
                variant={isSubscribed ? 'outlined' : 'contained'}
                onClick={() => subscribeMutation.mutate()}
              >
                {isSubscribed ? '已订阅' : '订阅'}
              </Button>
            )}
          </Box>
        </Stack>

        {profileData?.user?.bio && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            {profileData.user.bio}
          </Typography>
        )}
      </Paper>

      {/* 标签页 */}
      <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="视频" />
        <Tab label="关于" />
      </Tabs>

      {/* 视频列表 */}
      {tab === 0 && (
        <Grid container spacing={2}>
          {videosData?.videos?.map((video) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
              {/* 使用VideoCard组件 */}
              <Box>{video.title}</Box>
            </Grid>
          ))}
        </Grid>
      )}

      {/* 关于 */}
      {tab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            频道信息
          </Typography>
          <Typography variant="body1">
            {profileData?.user?.bio || '该用户还没有填写简介'}
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default UserProfile;
