import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  Chip,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  useTheme,
  alpha,
  Fade,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { videoAPI } from '../services/api';
import VideoCardEnhanced from '../components/VideoCardEnhanced';
import LoadingAnimation from '../components/LoadingAnimation';
import EmptyState from '../components/EmptyState';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const SearchEnhanced = () => {
  const theme = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [tab, setTab] = useState(0);
  const [searchInput, setSearchInput] = useState(query);
  const [sortBy, setSortBy] = useState('relevance');

  const { data, isLoading } = useQuery({
    queryKey: ['search', query, sortBy],
    queryFn: async () => {
      const response = await videoAPI.search(query, { sort: sortBy });
      return response.data;
    },
    enabled: !!query,
  });

  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const sortOptions = [
    { label: '相关度', value: 'relevance', icon: <FilterListIcon /> },
    { label: '最新', value: 'date', icon: <AccessTimeIcon /> },
    { label: '热门', value: 'views', icon: <TrendingUpIcon /> },
  ];

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        background: `linear-gradient(135deg,
          ${alpha(theme.palette.background.default, 1)} 0%,
          ${alpha(theme.palette.background.paper, 0.8)} 100%)`,
      }}
    >
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* 搜索头部 */}
        <Fade in timeout={500}>
          <Box sx={{ mb: 4 }}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{
                  mb: 3,
                  background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                搜索结果
              </Typography>

              {/* 搜索框 */}
              <Paper
                component="form"
                onSubmit={handleSearch}
                sx={{
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 3,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  mb: 3,
                }}
              >
                <SearchIcon sx={{ mx: 2, color: 'text.secondary' }} />
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder="搜索视频、UP主..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  InputProps={{
                    disableUnderline: true,
                  }}
                  sx={{
                    '& .MuiInput-input': {
                      fontSize: '1.1rem',
                    },
                  }}
                />
                <IconButton type="submit" sx={{ mr: 1 }}>
                  <SearchIcon />
                </IconButton>
              </Paper>

              {/* 搜索关键词显示 */}
              {query && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body1" color="text.secondary">
                    搜索: <strong>"{query}"</strong>
                    {data?.total > 0 && (
                      <Typography component="span" sx={{ ml: 2 }}>
                        找到 <strong>{data.total}</strong> 个结果
                      </Typography>
                    )}
                  </Typography>
                </Box>
              )}
            </motion.div>
          </Box>
        </Fade>

        {/* 标签页和排序 */}
        <Fade in timeout={600}>
          <Paper
            sx={{
              mb: 3,
              borderRadius: 3,
              overflow: 'hidden',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            }}
          >
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems="center"
              sx={{ px: 2 }}
            >
              <Tabs
                value={tab}
                onChange={(e, newValue) => setTab(newValue)}
                sx={{ minHeight: 56 }}
              >
                <Tab label="视频" />
                <Tab label="用户" />
              </Tabs>

              {/* 排序选项 */}
              <Stack direction="row" spacing={1} sx={{ py: 1 }}>
                {sortOptions.map((option) => (
                  <motion.div
                    key={option.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Chip
                      icon={option.icon}
                      label={option.label}
                      onClick={() => setSortBy(option.value)}
                      color={sortBy === option.value ? 'primary' : 'default'}
                      variant={sortBy === option.value ? 'filled' : 'outlined'}
                      sx={{
                        fontWeight: 600,
                        borderRadius: 2,
                      }}
                    />
                  </motion.div>
                ))}
              </Stack>
            </Stack>
          </Paper>
        </Fade>

        {/* 搜索结果 */}
        {!query ? (
          <EmptyState
            type="search"
            title="开始搜索"
            description="输入关键词搜索你感兴趣的视频内容"
          />
        ) : isLoading ? (
          <LoadingAnimation message="正在搜索..." />
        ) : (
          <>
            {tab === 0 && (
              <Fade in>
                <Box>
                  {data?.results && data.results.length > 0 ? (
                    <Grid container spacing={3}>
                      {data.results.map((video, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
                          <VideoCardEnhanced video={video} index={index} />
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <EmptyState
                      type="search"
                      title={`没有找到"${query}"的相关结果`}
                      description="试试其他关键词，或浏览热门视频"
                      actionText="浏览热门"
                      onAction={() => window.location.href = '/'}
                    />
                  )}
                </Box>
              </Fade>
            )}

            {tab === 1 && (
              <EmptyState
                type="search"
                title="用户搜索功能开发中"
                description="敬请期待更多精彩功能"
              />
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default SearchEnhanced;
