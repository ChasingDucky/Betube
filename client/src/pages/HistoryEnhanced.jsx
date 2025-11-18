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
  Chip,
  Divider,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '../services/api';
import VideoCardEnhanced from '../components/VideoCardEnhanced';
import { VideoGridSkeleton } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import HistoryIcon from '@mui/icons-material/History';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import TodayIcon from '@mui/icons-material/Today';
import DateRangeIcon from '@mui/icons-material/DateRange';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import FilterListIcon from '@mui/icons-material/FilterList';
import useAuthStore from '../stores/authStore';
import toast from 'react-hot-toast';

const HistoryEnhanced = () => {
  const theme = useTheme();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['history'],
    queryFn: async () => {
      const response = await userAPI.getHistory();
      return response.data;
    },
    enabled: isAuthenticated,
  });

  const clearHistoryMutation = useMutation({
    mutationFn: () => userAPI.clearHistory(),
    onSuccess: () => {
      queryClient.invalidateQueries(['history']);
      toast.success('历史记录已清空');
      setClearDialogOpen(false);
    },
    onError: () => {
      toast.error('清空失败，请重试');
    },
  });

  const removeVideoMutation = useMutation({
    mutationFn: (videoId) => userAPI.removeFromHistory(videoId),
    onSuccess: () => {
      queryClient.invalidateQueries(['history']);
      toast.success('已从历史记录中移除');
    },
    onError: () => {
      toast.error('移除失败，请重试');
    },
  });

  if (!isAuthenticated) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <EmptyState
          type="history"
          title="请先登录"
          description="登录后即可查看观看历史"
        />
      </Container>
    );
  }

  const filteredVideos = data?.history?.filter((item) => {
    if (searchQuery && !item.video?.title?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (filter === 'today') {
      const today = new Date();
      const watchDate = new Date(item.watchedAt);
      return watchDate.toDateString() === today.toDateString();
    }

    if (filter === 'week') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(item.watchedAt) > weekAgo;
    }

    return true;
  });

  // 按日期分组
  const groupedByDate = filteredVideos?.reduce((acc, item) => {
    const date = new Date(item.watchedAt).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});

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
                    <HistoryIcon sx={{ fontSize: 32, color: 'white' }} />
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
                      观看历史
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {data?.history?.length || 0} 个观看记录
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              <Stack direction="row" spacing={1}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outlined"
                    startIcon={<FilterListIcon />}
                    onClick={(e) => setMenuAnchor(e.currentTarget)}
                    sx={{ borderRadius: 2 }}
                  >
                    筛选
                  </Button>
                </motion.div>

                {data?.history?.length > 0 && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteSweepIcon />}
                      onClick={() => setClearDialogOpen(true)}
                      sx={{ borderRadius: 2 }}
                    >
                      清空历史
                    </Button>
                  </motion.div>
                )}
              </Stack>
            </Stack>
          </Box>
        </Slide>

        {/* 搜索和筛选 */}
        <Fade in timeout={600}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              background: alpha(theme.palette.background.paper, 0.8),
            }}
          >
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                placeholder="搜索历史记录..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <Stack direction="row" spacing={1}>
                {[
                  { label: '全部', value: 'all', icon: <DateRangeIcon /> },
                  { label: '今天', value: 'today', icon: <TodayIcon /> },
                  { label: '本周', value: 'week', icon: <DateRangeIcon /> },
                ].map((option) => (
                  <motion.div
                    key={option.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Chip
                      icon={option.icon}
                      label={option.label}
                      onClick={() => setFilter(option.value)}
                      color={filter === option.value ? 'primary' : 'default'}
                      variant={filter === option.value ? 'filled' : 'outlined'}
                      sx={{
                        fontWeight: 600,
                        borderRadius: 2,
                        height: 40,
                      }}
                    />
                  </motion.div>
                ))}
              </Stack>
            </Stack>
          </Paper>
        </Fade>

        {/* 历史记录列表 */}
        {isLoading ? (
          <VideoGridSkeleton count={12} />
        ) : groupedByDate && Object.keys(groupedByDate).length > 0 ? (
          <Box>
            <AnimatePresence>
              {Object.entries(groupedByDate).map(([date, videos], groupIndex) => (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: groupIndex * 0.05 }}
                >
                  <Box sx={{ mb: 4 }}>
                    {/* 日期标题 */}
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={date}
                        sx={{
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                        }}
                      />
                    </Box>

                    {/* 视频网格 */}
                    <Grid container spacing={3}>
                      {videos.map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
                          <Box sx={{ position: 'relative' }}>
                            <VideoCardEnhanced
                              video={item.video}
                              index={index}
                              showWatchedProgress
                              watchedAt={item.watchedAt}
                            />

                            {/* 删除按钮 */}
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
                                onClick={() => removeVideoMutation.mutate(item.video._id)}
                                sx={{
                                  background: alpha('#000', 0.6),
                                  backdropFilter: 'blur(10px)',
                                  color: 'white',
                                  '&:hover': {
                                    background: alpha(theme.palette.error.main, 0.8),
                                  },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </motion.div>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  {groupIndex < Object.keys(groupedByDate).length - 1 && (
                    <Divider sx={{ my: 4 }} />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </Box>
        ) : (
          <EmptyState
            type="history"
            title={searchQuery ? '未找到相关记录' : '暂无观看历史'}
            description={
              searchQuery ? '试试其他搜索词' : '你观看的视频会出现在这里'
            }
            actionText={searchQuery ? '清除搜索' : null}
            onAction={searchQuery ? () => setSearchQuery('') : null}
          />
        )}

        {/* 筛选菜单 */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
          PaperProps={{
            sx: {
              borderRadius: 2,
              minWidth: 200,
            },
          }}
        >
          <MenuItem onClick={() => { setFilter('all'); setMenuAnchor(null); }}>
            <ListItemIcon>
              <DateRangeIcon />
            </ListItemIcon>
            <ListItemText>全部</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { setFilter('today'); setMenuAnchor(null); }}>
            <ListItemIcon>
              <TodayIcon />
            </ListItemIcon>
            <ListItemText>今天</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { setFilter('week'); setMenuAnchor(null); }}>
            <ListItemIcon>
              <DateRangeIcon />
            </ListItemIcon>
            <ListItemText>本周</ListItemText>
          </MenuItem>
        </Menu>

        {/* 清空确认对话框 */}
        <Dialog
          open={clearDialogOpen}
          onClose={() => setClearDialogOpen(false)}
          PaperProps={{
            sx: {
              borderRadius: 3,
              minWidth: 400,
            },
          }}
        >
          <DialogTitle>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  background: alpha(theme.palette.error.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <DeleteSweepIcon sx={{ color: 'error.main' }} />
              </Box>
              <Typography variant="h6" fontWeight={700}>
                清空观看历史？
              </Typography>
            </Stack>
          </DialogTitle>

          <DialogContent>
            <Typography color="text.secondary">
              确定要清空所有观看历史吗？此操作无法撤销。
            </Typography>
          </DialogContent>

          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={() => setClearDialogOpen(false)}
              sx={{ borderRadius: 2 }}
            >
              取消
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => clearHistoryMutation.mutate()}
              disabled={clearHistoryMutation.isPending}
              sx={{ borderRadius: 2 }}
            >
              {clearHistoryMutation.isPending ? '清空中...' : '确认清空'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default HistoryEnhanced;
