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
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentAPI } from '../services/api';
import useAuthStore from '../stores/authStore';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import { formatDistanceToNow } from '../utils/dateUtils';

const Comment = ({ comment, onReply }) => {
  const { user, isAuthenticated } = useAuthStore();
  const [isLiked, setIsLiked] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);

  const likeMutation = useMutation({
    mutationFn: () =>
      isLiked
        ? commentAPI.unlikeComment(comment._id)
        : commentAPI.likeComment(comment._id),
    onSuccess: () => {
      setIsLiked(!isLiked);
    },
  });

  return (
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" spacing={2} alignItems="flex-start">
        <Avatar src={comment.author?.avatar} alt={comment.author?.name} />
        <Box sx={{ flex: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              {comment.author?.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {formatDistanceToNow(comment.createdAt)}
            </Typography>
          </Stack>

          <Typography variant="body2" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>
            {comment.content}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton
              size="small"
              onClick={() => likeMutation.mutate()}
              disabled={!isAuthenticated}
            >
              {isLiked ? (
                <ThumbUpIcon fontSize="small" />
              ) : (
                <ThumbUpOutlinedIcon fontSize="small" />
              )}
            </IconButton>
            <Typography variant="caption" color="text.secondary">
              {comment.likes || 0}
            </Typography>
            {isAuthenticated && (
              <Button
                size="small"
                onClick={() => setShowReplyInput(!showReplyInput)}
              >
                回复
              </Button>
            )}
          </Stack>

          {/* 回复输入框 */}
          {showReplyInput && (
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder={`回复 @${comment.author?.name}`}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    onReply(comment._id, e.target.value);
                    e.target.value = '';
                    setShowReplyInput(false);
                  }
                }}
              />
            </Box>
          )}

          {/* 子评论 */}
          {comment.replies && comment.replies.length > 0 && (
            <Box sx={{ mt: 2, ml: 2, borderLeft: 2, borderColor: 'divider', pl: 2 }}>
              {comment.replies.map((reply) => (
                <Comment key={reply._id} comment={reply} onReply={onReply} />
              ))}
            </Box>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

const CommentSection = ({ videoId }) => {
  const { user, isAuthenticated } = useAuthStore();
  const [commentText, setCommentText] = useState('');
  const [sortBy, setSortBy] = useState('latest');
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
    },
  });

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    addCommentMutation.mutate(commentText);
  };

  const handleReply = (parentId, content) => {
    commentAPI.addComment(videoId, { content, parentId }).then(() => {
      queryClient.invalidateQueries(['comments', videoId]);
    });
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        {commentsData?.total || 0} 条评论
      </Typography>

      {/* 评论输入框 */}
      {isAuthenticated ? (
        <Paper sx={{ p: 2, mb: 3, backgroundColor: 'action.hover' }}>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Avatar src={user?.avatar} alt={user?.name} />
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="发表你的评论..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                variant="outlined"
              />
              <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1 }}>
                <Button onClick={() => setCommentText('')} sx={{ mr: 1 }}>
                  取消
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim() || addCommentMutation.isPending}
                >
                  发表评论
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      ) : (
        <Paper sx={{ p: 2, mb: 3, textAlign: 'center' }}>
          <Typography color="text.secondary">
            登录后即可发表评论
          </Typography>
        </Paper>
      )}

      {/* 排序选项 */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button
          variant={sortBy === 'latest' ? 'contained' : 'text'}
          size="small"
          onClick={() => setSortBy('latest')}
        >
          最新
        </Button>
        <Button
          variant={sortBy === 'hot' ? 'contained' : 'text'}
          size="small"
          onClick={() => setSortBy('hot')}
        >
          热门
        </Button>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* 评论列表 */}
      {isLoading ? (
        <Typography>加载中...</Typography>
      ) : (
        commentsData?.comments?.map((comment) => (
          <Comment key={comment._id} comment={comment} onReply={handleReply} />
        ))
      )}

      {!isLoading && (!commentsData?.comments || commentsData.comments.length === 0) && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">暂无评论，快来发表第一条评论吧！</Typography>
        </Box>
      )}
    </Box>
  );
};

export default CommentSection;
