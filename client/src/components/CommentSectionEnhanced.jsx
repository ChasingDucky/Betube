import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
  IconButton,
  Divider,
  Paper,
  Chip,
  useTheme,
  alpha,
  Fade,
  Collapse,
  Tooltip,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentAPI } from '../services/api';
import useAuthStore from '../stores/authStore';
import { CommentsSkeleton } from './SkeletonLoader';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ReplyIcon from '@mui/icons-material/Reply';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { formatDistanceToNow } from '../utils/dateUtils';
import toast from 'react-hot-toast';

const CommentEnhanced = ({ comment, onReply, index = 0 }) => {
  const theme = useTheme();
  const { user, isAuthenticated } = useAuthStore();
  const [isLiked, setIsLiked] = useState(false);
  const [localLikes, setLocalLikes] = useState(comment.likes || 0);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');

  const likeMutation = useMutation({
    mutationFn: () =>
      isLiked
        ? commentAPI.unlikeComment(comment._id)
        : commentAPI.likeComment(comment._id),
    onMutate: () => {
      setIsLiked(!isLiked);
      setLocalLikes(isLiked ? localLikes - 1 : localLikes + 1);
    },
    onError: () => {
      setIsLiked(!isLiked);
      setLocalLikes(isLiked ? localLikes + 1 : localLikes - 1);
      toast.error('操作失败');
    },
  });

  const handleReply = () => {
    if (!replyText.trim()) return;
    onReply(comment._id, replyText);
    setReplyText('');
    setShowReplyInput(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          background: alpha(theme.palette.background.paper, 0.6),
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s',
          '&:hover': {
            boxShadow: `0 4px 16px ${alpha(theme.palette.primary.main, 0.1)}`,
            transform: 'translateX(4px)',
          },
        }}
      >
        <Stack direction="row" spacing={2} alignItems="flex-start">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Avatar
              src={comment.author?.avatar}
              alt={comment.author?.name}
              sx={{
                border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                cursor: 'pointer',
              }}
            />
          </motion.div>

          <Box sx={{ flex: 1 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 0.5 }}
            >
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle2" fontWeight={700}>
                  {comment.author?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDistanceToNow(comment.createdAt)}
                </Typography>
              </Stack>

              <Tooltip title="更多">
                <IconButton size="small">
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>

            <Typography
              variant="body2"
              sx={{
                mb: 1.5,
                whiteSpace: 'pre-wrap',
                lineHeight: 1.6,
              }}
            >
              {comment.content}
            </Typography>

            <Stack direction="row" alignItems="center" spacing={1}>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Tooltip title={isLiked ? '取消点赞' : '点赞'}>
                  <IconButton
                    size="small"
                    onClick={() => {
                      if (!isAuthenticated) {
                        toast.error('请先登录');
                        return;
                      }
                      likeMutation.mutate();
                    }}
                    sx={{
                      color: isLiked ? theme.palette.primary.main : 'text.secondary',
                    }}
                  >
                    {isLiked ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500 }}
                      >
                        <ThumbUpIcon fontSize="small" />
                      </motion.div>
                    ) : (
                      <ThumbUpOutlinedIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
              </motion.div>

              <Typography
                variant="caption"
                color={isLiked ? 'primary.main' : 'text.secondary'}
                fontWeight={600}
              >
                {localLikes}
              </Typography>

              {isAuthenticated && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="small"
                    startIcon={<ReplyIcon fontSize="small" />}
                    onClick={() => setShowReplyInput(!showReplyInput)}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    回复
                  </Button>
                </motion.div>
              )}

              {comment.replies && comment.replies.length > 0 && (
                <Chip
                  label={`${comment.replies.length} 条回复`}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                />
              )}
            </Stack>

            {/* 回复输入框 */}
            <Collapse in={showReplyInput}>
              <Box sx={{ mt: 2 }}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Avatar src={user?.avatar} sx={{ width: 32, height: 32 }} />
                  <Box sx={{ flex: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      multiline
                      rows={2}
                      placeholder={`回复 @${comment.author?.name}`}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }} justifyContent="flex-end">
                      <Button
                        size="small"
                        onClick={() => {
                          setShowReplyInput(false);
                          setReplyText('');
                        }}
                      >
                        取消
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        onClick={handleReply}
                        disabled={!replyText.trim()}
                        sx={{ borderRadius: 2 }}
                      >
                        回复
                      </Button>
                    </Stack>
                  </Box>
                </Stack>
              </Box>
            </Collapse>

            {/* 子评论 */}
            {comment.replies && comment.replies.length > 0 && (
              <Box
                sx={{
                  mt: 2,
                  ml: 2,
                  pl: 2,
                  borderLeft: `3px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                <AnimatePresence>
                  {comment.replies.map((reply, idx) => (
                    <CommentEnhanced
                      key={reply._id}
                      comment={reply}
                      onReply={onReply}
                      index={idx}
                    />
                  ))}
                </AnimatePresence>
              </Box>
            )}
          </Box>
        </Stack>
      </Paper>
    </motion.div>
  );
};

const CommentSectionEnhanced = ({ videoId }) => {
  const theme = useTheme();
  const { user, isAuthenticated } = useAuthStore();
  const [commentText, setCommentText] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [isFocused, setIsFocused] = useState(false);
  const queryClient = useQueryClient();

  // 获取评论
  const { data: commentsData, isLoading } = useQuery({
    queryKey: ['comments', videoId, sortBy],
    queryFn: async () => {
      const response = await commentAPI.getComments(videoId, { sort: sortBy });
      return response.data;
    },
    enabled: !!videoId,
  });

  // 发表评论
  const addCommentMutation = useMutation({
    mutationFn: (content) => commentAPI.addComment(videoId, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', videoId]);
      setCommentText('');
      toast.success('评论发表成功！');
    },
    onError: () => {
      toast.error('评论发表失败，请重试');
    },
  });

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    addCommentMutation.mutate(commentText);
  };

  const handleReply = (parentId, content) => {
    commentAPI
      .addComment(videoId, { content, parentId })
      .then(() => {
        queryClient.invalidateQueries(['comments', videoId]);
        toast.success('回复成功！');
      })
      .catch(() => {
        toast.error('回复失败，请重试');
      });
  };

  const sortOptions = [
    { label: '最新', value: 'latest', icon: <AccessTimeIcon fontSize="small" /> },
    { label: '热门', value: 'hot', icon: <TrendingUpIcon fontSize="small" /> },
  ];

  return (
    <Box>
      {/* 标题 */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <ChatBubbleOutlineIcon
            sx={{
              fontSize: 32,
              color: theme.palette.primary.main,
            }}
          />
          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {commentsData?.total || 0} 条评论
          </Typography>
        </Stack>
      </motion.div>

      {/* 评论输入框 */}
      {isAuthenticated ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
              border: `2px solid ${
                isFocused
                  ? theme.palette.primary.main
                  : alpha(theme.palette.divider, 0.1)
              }`,
              background: `linear-gradient(135deg,
                ${alpha(theme.palette.primary.main, 0.03)} 0%,
                ${alpha(theme.palette.secondary.main, 0.03)} 100%)`,
              transition: 'all 0.3s',
            }}
          >
            <Stack direction="row" spacing={2} alignItems="flex-start">
              <motion.div whileHover={{ scale: 1.1 }}>
                <Avatar
                  src={user?.avatar}
                  alt={user?.name}
                  sx={{
                    width: 48,
                    height: 48,
                    border: `3px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  }}
                />
              </motion.div>

              <Box sx={{ flex: 1 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={isFocused ? 4 : 3}
                  placeholder="发表你的精彩评论..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => !commentText && setIsFocused(false)}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      transition: 'all 0.3s',
                    },
                  }}
                />

                <Collapse in={isFocused || commentText.length > 0}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mt: 2 }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {commentText.length} / 500
                    </Typography>

                    <Stack direction="row" spacing={1}>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => {
                            setCommentText('');
                            setIsFocused(false);
                          }}
                          sx={{ borderRadius: 2 }}
                        >
                          取消
                        </Button>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="contained"
                          onClick={handleSubmitComment}
                          disabled={!commentText.trim() || addCommentMutation.isPending}
                          sx={{
                            borderRadius: 2,
                            fontWeight: 600,
                            background:
                              'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                            '&:hover': {
                              boxShadow: '0 6px 24px rgba(78, 205, 196, 0.4)',
                            },
                          }}
                        >
                          {addCommentMutation.isPending ? '发表中...' : '发表评论'}
                        </Button>
                      </motion.div>
                    </Stack>
                  </Stack>
                </Collapse>
              </Box>
            </Stack>
          </Paper>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 3,
              textAlign: 'center',
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              background: `linear-gradient(135deg,
                ${alpha(theme.palette.primary.main, 0.05)} 0%,
                ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
            }}
          >
            <Typography color="text.secondary" fontWeight={600}>
              登录后即可发表精彩评论
            </Typography>
          </Paper>
        </motion.div>
      )}

      {/* 排序选项 */}
      <Fade in timeout={500}>
        <Stack direction="row" spacing={1.5} sx={{ mb: 3 }}>
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
                  fontSize: '0.875rem',
                  height: 36,
                  px: 1,
                  borderRadius: 2,
                  transition: 'all 0.3s',
                  background:
                    sortBy === option.value
                      ? 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)'
                      : 'transparent',
                }}
              />
            </motion.div>
          ))}
        </Stack>
      </Fade>

      <Divider sx={{ mb: 3 }} />

      {/* 评论列表 */}
      {isLoading ? (
        <CommentsSkeleton count={5} />
      ) : (
        <AnimatePresence mode="wait">
          {commentsData?.comments && commentsData.comments.length > 0 ? (
            commentsData.comments.map((comment, index) => (
              <CommentEnhanced
                key={comment._id}
                comment={comment}
                onReply={handleReply}
                index={index}
              />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Paper
                elevation={0}
                sx={{
                  textAlign: 'center',
                  py: 8,
                  borderRadius: 3,
                  background: `linear-gradient(135deg,
                    ${alpha(theme.palette.primary.main, 0.05)} 0%,
                    ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <ChatBubbleOutlineIcon
                  sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" fontWeight={600}>
                  暂无评论
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  快来发表第一条评论吧！
                </Typography>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </Box>
  );
};

export default CommentSectionEnhanced;
