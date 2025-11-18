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
  Card,
  CardMedia,
  CardContent,
  Chip,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { videoAPI } from '../services/api';
import VideoCardEnhanced from '../components/VideoCardEnhanced';
import { VideoGridSkeleton } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { useNavigate } from 'react-router-dom';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import ComputerIcon from '@mui/icons-material/Computer';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import HomeIcon from '@mui/icons-material/Home';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

const categories = [
  {
    name: '游戏',
    value: 'gaming',
    icon: <SportsEsportsIcon />,
    color: '#9C27B0',
    gradient: 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
    description: '热门游戏视频和直播',
  },
  {
    name: '音乐',
    value: 'music',
    icon: <MusicNoteIcon />,
    color: '#F44336',
    gradient: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
    description: 'MV、翻唱和音乐现场',
  },
  {
    name: '科技',
    value: 'tech',
    icon: <ComputerIcon />,
    color: '#2196F3',
    gradient: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
    description: '数码评测和科技资讯',
  },
  {
    name: '娱乐',
    value: 'entertainment',
    icon: <TheaterComedyIcon />,
    color: '#FF9800',
    gradient: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
    description: '综艺、影视和搞笑',
  },
  {
    name: '生活',
    value: 'life',
    icon: <HomeIcon />,
    color: '#4CAF50',
    gradient: 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
    description: 'Vlog和生活分享',
  },
  {
    name: '美食',
    value: 'food',
    icon: <RestaurantIcon />,
    color: '#FF5722',
    gradient: 'linear-gradient(135deg, #FF5722 0%, #E64A19 100%)',
    description: '美食教程和探店',
  },
  {
    name: '运动',
    value: 'sports',
    icon: <FitnessCenterIcon />,
    color: '#00BCD4',
    gradient: 'linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)',
    description: '健身教学和体育赛事',
  },
  {
    name: '教育',
    value: 'education',
    icon: <SchoolIcon />,
    color: '#673AB7',
    gradient: 'linear-gradient(135deg, #673AB7 0%, #512DA8 100%)',
    description: '知识分享和技能学习',
  },
];

const trendingSections = [
  { title: '热门趋势', icon: <TrendingUpIcon />, type: 'trending' },
  { title: '最新发布', icon: <NewReleasesIcon />, type: 'latest' },
  { title: '今日热门', icon: <LocalFireDepartmentIcon />, type: 'today' },
];

const ExploreEnhanced = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['explore', selectedCategory],
    queryFn: async () => {
      if (!selectedCategory) return { videos: [] };
      const response = await videoAPI.getRecommended({ category: selectedCategory });
      return response.data;
    },
    enabled: !!selectedCategory,
  });

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
            <Typography
              variant="h3"
              fontWeight={700}
              sx={{
                mb: 1,
                background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              探索精彩内容
            </Typography>
            <Typography variant="h6" color="text.secondary">
              发现你感兴趣的视频分类
            </Typography>
          </Box>
        </Slide>

        {/* 趋势区域 */}
        {!selectedCategory && (
          <Fade in timeout={600}>
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{ mb: 3, color: theme.palette.text.primary }}
              >
                🔥 趋势发现
              </Typography>

              <Grid container spacing={3}>
                {trendingSections.map((section, index) => (
                  <Grid item xs={12} md={4} key={section.type}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          background: `linear-gradient(135deg,
                            ${alpha(theme.palette.primary.main, 0.1)} 0%,
                            ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          '&:hover': {
                            boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.2)}`,
                          },
                        }}
                      >
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
                              color: 'white',
                            }}
                          >
                            {section.icon}
                          </Box>
                          <Typography variant="h6" fontWeight={700}>
                            {section.title}
                          </Typography>
                        </Stack>
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        )}

        {/* 分类卡片 */}
        {!selectedCategory && (
          <Fade in timeout={700}>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                fontWeight={700}
                sx={{ mb: 3, color: theme.palette.text.primary }}
              >
                📂 内容分类
              </Typography>

              <Grid container spacing={3}>
                {categories.map((category, index) => (
                  <Grid item xs={12} sm={6} md={3} key={category.value}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05, y: -8 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        elevation={0}
                        onClick={() => setSelectedCategory(category.value)}
                        sx={{
                          borderRadius: 3,
                          overflow: 'hidden',
                          cursor: 'pointer',
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                          transition: 'all 0.3s',
                          '&:hover': {
                            boxShadow: `0 12px 40px ${alpha(category.color, 0.3)}`,
                          },
                        }}
                      >
                        <Box
                          sx={{
                            height: 160,
                            background: category.gradient,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          {/* 装饰圆圈 */}
                          <Box
                            sx={{
                              position: 'absolute',
                              top: -40,
                              right: -40,
                              width: 120,
                              height: 120,
                              borderRadius: '50%',
                              background: alpha('#fff', 0.1),
                            }}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              bottom: -30,
                              left: -30,
                              width: 100,
                              height: 100,
                              borderRadius: '50%',
                              background: alpha('#fff', 0.1),
                            }}
                          />

                          <Box
                            sx={{
                              fontSize: 64,
                              color: 'white',
                              mb: 1,
                              position: 'relative',
                              zIndex: 1,
                            }}
                          >
                            {category.icon}
                          </Box>
                          <Typography
                            variant="h5"
                            fontWeight={700}
                            sx={{ color: 'white', position: 'relative', zIndex: 1 }}
                          >
                            {category.name}
                          </Typography>
                        </Box>

                        <CardContent sx={{ p: 2 }}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            textAlign="center"
                          >
                            {category.description}
                          </Typography>

                          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <IconButton
                                sx={{
                                  background: alpha(category.color, 0.1),
                                  color: category.color,
                                  '&:hover': {
                                    background: alpha(category.color, 0.2),
                                  },
                                }}
                              >
                                <PlayArrowIcon />
                              </IconButton>
                            </motion.div>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Fade>
        )}

        {/* 分类视频展示 */}
        {selectedCategory && (
          <Fade in timeout={500}>
            <Box>
              {/* 返回按钮和标题 */}
              <Box sx={{ mb: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Chip
                      label="← 返回探索"
                      onClick={() => setSelectedCategory(null)}
                      sx={{
                        fontWeight: 600,
                        cursor: 'pointer',
                        background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        color: 'white',
                        '&:hover': {
                          boxShadow: '0 4px 16px rgba(78, 205, 196, 0.4)',
                        },
                      }}
                    />
                  </motion.div>
                </Stack>

                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{
                    background: categories.find((c) => c.value === selectedCategory)?.gradient,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {categories.find((c) => c.value === selectedCategory)?.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                  {categories.find((c) => c.value === selectedCategory)?.description}
                </Typography>
              </Box>

              {/* 视频网格 */}
              {isLoading ? (
                <VideoGridSkeleton count={12} />
              ) : data?.videos && data.videos.length > 0 ? (
                <Grid container spacing={3}>
                  {data.videos.map((video, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
                      <VideoCardEnhanced video={video} index={index} />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <EmptyState
                  type="video"
                  title="该分类暂无内容"
                  description="试试其他分类吧"
                  actionText="返回探索"
                  onAction={() => setSelectedCategory(null)}
                />
              )}
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default ExploreEnhanced;
