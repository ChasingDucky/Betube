import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Chip,
  Stack,
  Typography,
  Fade,
  Slide,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { videoAPI } from '../services/api';
import { motion } from 'framer-motion';
import VideoCardEnhanced from '../components/VideoCardEnhanced';
import LoadingAnimation from '../components/LoadingAnimation';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WhatshotIcon from '@mui/icons-material/Whatshot';

const categories = [
  { label: '推荐', value: 'recommended', icon: <WhatshotIcon /> },
  { label: '热门', value: 'trending', icon: <TrendingUpIcon /> },
  { label: '游戏', value: 'gaming' },
  { label: '音乐', value: 'music' },
  { label: '科技', value: 'tech' },
  { label: '娱乐', value: 'entertainment' },
  { label: '生活', value: 'life' },
  { label: '美食', value: 'food' },
];

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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* 顶部标题 */}
      <Slide direction="down" in timeout={500}>
        <Box sx={{ mb: 4 }}>
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
            {filter === 'recommended' ? '为你推荐' : filter === 'trending' ? '热门视频' : '精选内容'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            发现更多精彩视频内容
          </Typography>
        </Box>
      </Slide>

      {/* 分类标签 */}
      <Fade in timeout={600}>
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            mb: 4,
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': { height: 8 },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'rgba(0,0,0,0.05)',
              borderRadius: 4,
            },
          }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={category.value}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Chip
                icon={category.icon}
                label={category.label}
                onClick={() => setFilter(category.value)}
                color={filter === category.value ? 'primary' : 'default'}
                variant={filter === category.value ? 'filled' : 'outlined'}
                sx={{
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  height: 40,
                  px: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 2,
                  },
                }}
              />
            </motion.div>
          ))}
        </Stack>
      </Fade>

      {/* 视频网格 */}
      {isLoading ? (
        <LoadingAnimation message="正在加载精彩内容..." />
      ) : (
        <Grid container spacing={3}>
          {data?.videos?.map((video, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
              <VideoCardEnhanced video={video} index={index} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* 空状态 */}
      {!isLoading && (!data?.videos || data.videos.length === 0) && (
        <Fade in>
          <Box
            sx={{
              textAlign: 'center',
              py: 10,
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <PlayArrowIcon
                sx={{
                  fontSize: 80,
                  color: 'text.secondary',
                  mb: 3,
                  opacity: 0.5,
                }}
              />
            </motion.div>
            <Typography variant="h5" color="text.secondary" fontWeight={600} sx={{ mb: 1 }}>
              暂无视频
            </Typography>
            <Typography variant="body1" color="text.secondary">
              换个分类试试吧
            </Typography>
          </Box>
        </Fade>
      )}
    </Container>
  );
};

export default Home;
