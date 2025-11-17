import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Stack,
  Skeleton,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { videoAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from '../utils/dateUtils';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const VideoCard = ({ video }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleClick = () => {
    navigate(`/watch/${video._id}`);
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
        {!imageLoaded && (
          <Skeleton
            variant="rectangular"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          />
        )}
        <CardMedia
          component="img"
          image={video.thumbnail || '/default-thumbnail.jpg'}
          alt={video.title}
          onLoad={() => setImageLoaded(true)}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            padding: '2px 6px',
            borderRadius: 1,
            fontSize: '0.75rem',
            fontWeight: 500,
          }}
        >
          {video.duration || '00:00'}
        </Box>
      </Box>
      <CardContent>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Avatar
            src={video.author?.avatar}
            alt={video.author?.name}
            sx={{ width: 36, height: 36, mt: 0.5 }}
          />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              fontWeight={500}
              sx={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.4,
                mb: 0.5,
              }}
            >
              {video.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {video.author?.name}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="caption" color="text.secondary">
                {video.views?.toLocaleString() || 0} 次观看
              </Typography>
              <Typography variant="caption" color="text.secondary">
                •
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatDistanceToNow(video.createdAt)}
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

const VideoCardSkeleton = () => (
  <Card>
    <Skeleton variant="rectangular" sx={{ paddingTop: '56.25%' }} />
    <CardContent>
      <Stack direction="row" spacing={1.5}>
        <Skeleton variant="circular" width={36} height={36} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </Box>
      </Stack>
    </CardContent>
  </Card>
);

const Home = () => {
  const [filter, setFilter] = useState('recommended');

  const { data, isLoading, error } = useQuery({
    queryKey: ['videos', filter],
    queryFn: async () => {
      const response =
        filter === 'trending'
          ? await videoAPI.getTrending()
          : await videoAPI.getRecommended();
      return response.data;
    },
  });

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* 分类标签 */}
      <Stack
        direction="row"
        spacing={1}
        sx={{
          mb: 3,
          overflowX: 'auto',
          '&::-webkit-scrollbar': { height: 8 },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: 4,
          },
        }}
      >
        <Chip
          label="推荐"
          onClick={() => setFilter('recommended')}
          color={filter === 'recommended' ? 'primary' : 'default'}
          sx={{ fontWeight: 500 }}
        />
        <Chip
          label="热门"
          onClick={() => setFilter('trending')}
          color={filter === 'trending' ? 'primary' : 'default'}
          sx={{ fontWeight: 500 }}
        />
        <Chip label="游戏" sx={{ fontWeight: 500 }} />
        <Chip label="音乐" sx={{ fontWeight: 500 }} />
        <Chip label="科技" sx={{ fontWeight: 500 }} />
        <Chip label="娱乐" sx={{ fontWeight: 500 }} />
        <Chip label="生活" sx={{ fontWeight: 500 }} />
        <Chip label="美食" sx={{ fontWeight: 500 }} />
      </Stack>

      {/* 视频网格 */}
      <Grid container spacing={2}>
        {isLoading
          ? Array.from({ length: 12 }).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <VideoCardSkeleton />
              </Grid>
            ))
          : data?.videos?.map((video) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
                <VideoCard video={video} />
              </Grid>
            ))}
      </Grid>

      {/* 空状态 */}
      {!isLoading && (!data?.videos || data.videos.length === 0) && (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
          }}
        >
          <PlayArrowIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            暂无视频
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Home;
