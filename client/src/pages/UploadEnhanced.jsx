import React, { useState, useRef } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  LinearProgress,
  Chip,
  IconButton,
  Grid,
  Card,
  CardMedia,
  useTheme,
  alpha,
  Fade,
  Zoom,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { videoAPI } from '../services/api';
import toast from 'react-hot-toast';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import ImageIcon from '@mui/icons-material/Image';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

const UploadEnhanced = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const videoInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [],
    category: '',
  });
  const [tagInput, setTagInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: (data) =>
      videoAPI.uploadVideo(data, (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      }),
    onSuccess: (response) => {
      toast.success('视频上传成功！');
      navigate(`/watch/${response.data.videoId}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || '上传失败，请重试');
      setUploadProgress(0);
    },
  });

  const handleVideoChange = (file) => {
    if (file) {
      if (file.size > 500 * 1024 * 1024) {
        toast.error('视频文件大小不能超过500MB');
        return;
      }
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const handleThumbnailChange = (file) => {
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('封面图片大小不能超过5MB');
        return;
      }
      setThumbnailFile(file);
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      handleVideoChange(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!videoFile) {
      toast.error('请选择视频文件');
      return;
    }

    const data = new FormData();
    data.append('video', videoFile);
    if (thumbnailFile) {
      data.append('thumbnail', thumbnailFile);
    }
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('tags', JSON.stringify(formData.tags));
    data.append('category', formData.category);

    uploadMutation.mutate(data);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddTag = () => {
    if (tagInput.trim() && formData.tags.length < 10) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToDelete),
    });
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        background: `linear-gradient(135deg,
          ${alpha(theme.palette.primary.main, 0.05)} 0%,
          ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Fade in timeout={500}>
          <Box>
            {/* 标题 */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
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
                  上传视频
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  分享你的精彩内容给全世界
                </Typography>
              </motion.div>
            </Box>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                {/* 左侧 - 文件上传 */}
                <Grid item xs={12} md={5}>
                  <Stack spacing={3}>
                    {/* 视频上传区域 */}
                    <Zoom in timeout={600}>
                      <Paper
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          border: `2px dashed ${
                            isDragging
                              ? theme.palette.primary.main
                              : alpha(theme.palette.divider, 0.3)
                          }`,
                          background: isDragging
                            ? alpha(theme.palette.primary.main, 0.05)
                            : alpha(theme.palette.background.paper, 0.9),
                          transition: 'all 0.3s',
                          cursor: 'pointer',
                          '&:hover': {
                            borderColor: theme.palette.primary.main,
                            background: alpha(theme.palette.primary.main, 0.02),
                          },
                        }}
                        onClick={() => videoInputRef.current?.click()}
                      >
                        <input
                          ref={videoInputRef}
                          type="file"
                          accept="video/*"
                          hidden
                          onChange={(e) => handleVideoChange(e.target.files[0])}
                        />

                        {videoFile ? (
                          <Box sx={{ textAlign: 'center' }}>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: 'spring' }}
                            >
                              <CheckCircleIcon
                                sx={{
                                  fontSize: 64,
                                  color: 'success.main',
                                  mb: 2,
                                }}
                              />
                            </motion.div>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                              {videoFile.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                            </Typography>
                            {videoPreview && (
                              <Box sx={{ mt: 2, position: 'relative', borderRadius: 2, overflow: 'hidden' }}>
                                <video
                                  src={videoPreview}
                                  style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }}
                                  controls
                                />
                              </Box>
                            )}
                          </Box>
                        ) : (
                          <Box sx={{ textAlign: 'center', py: 4 }}>
                            <motion.div
                              animate={{ y: [0, -10, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <CloudUploadIcon
                                sx={{
                                  fontSize: 64,
                                  color: 'primary.main',
                                  mb: 2,
                                  opacity: 0.6,
                                }}
                              />
                            </motion.div>
                            <Typography variant="h6" gutterBottom>
                              {isDragging ? '放开以上传' : '点击或拖拽上传视频'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              支持MP4、AVI、MOV等格式，最大500MB
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    </Zoom>

                    {/* 封面上传 */}
                    <Zoom in timeout={700}>
                      <Paper
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                          视频封面
                        </Typography>
                        <Button
                          variant="outlined"
                          fullWidth
                          component="label"
                          startIcon={<ImageIcon />}
                          sx={{ mb: 2, borderRadius: 2, py: 1.5 }}
                        >
                          {thumbnailFile ? '更换封面' : '选择封面图片'}
                          <input
                            ref={thumbnailInputRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={(e) => handleThumbnailChange(e.target.files[0])}
                          />
                        </Button>
                        {thumbnailPreview && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <Card sx={{ position: 'relative' }}>
                              <CardMedia
                                component="img"
                                image={thumbnailPreview}
                                alt="封面预览"
                                sx={{ height: 150, objectFit: 'cover' }}
                              />
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setThumbnailFile(null);
                                  setThumbnailPreview(null);
                                }}
                                sx={{
                                  position: 'absolute',
                                  top: 8,
                                  right: 8,
                                  backgroundColor: 'rgba(0,0,0,0.6)',
                                  '&:hover': {
                                    backgroundColor: 'rgba(0,0,0,0.8)',
                                  },
                                }}
                              >
                                <CloseIcon sx={{ color: 'white' }} />
                              </IconButton>
                            </Card>
                          </motion.div>
                        )}
                      </Paper>
                    </Zoom>
                  </Stack>
                </Grid>

                {/* 右侧 - 视频信息 */}
                <Grid item xs={12} md={7}>
                  <Zoom in timeout={800}>
                    <Paper
                      sx={{
                        p: 4,
                        borderRadius: 3,
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                      }}
                    >
                      <Stack spacing={3}>
                        <Typography variant="h5" fontWeight={700}>
                          视频详情
                        </Typography>

                        {/* 标题 */}
                        <TextField
                          fullWidth
                          label="视频标题"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          required
                          inputProps={{ maxLength: 100 }}
                          helperText={`${formData.title.length}/100`}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />

                        {/* 描述 */}
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          label="视频描述"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          inputProps={{ maxLength: 5000 }}
                          helperText={`${formData.description.length}/5000`}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        />

                        {/* 标签 */}
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            标签 (最多10个)
                          </Typography>
                          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                            <TextField
                              size="small"
                              placeholder="添加标签"
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddTag();
                                }
                              }}
                              disabled={formData.tags.length >= 10}
                              sx={{
                                flex: 1,
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: 2,
                                },
                              }}
                            />
                            <Button
                              variant="outlined"
                              onClick={handleAddTag}
                              disabled={formData.tags.length >= 10 || !tagInput.trim()}
                              sx={{ borderRadius: 2 }}
                            >
                              添加
                            </Button>
                          </Stack>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            <AnimatePresence>
                              {formData.tags.map((tag) => (
                                <motion.div
                                  key={tag}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                >
                                  <Chip
                                    label={tag}
                                    onDelete={() => handleDeleteTag(tag)}
                                    deleteIcon={<CloseIcon />}
                                    sx={{ borderRadius: 2 }}
                                  />
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </Box>
                        </Box>

                        {/* 分类 */}
                        <TextField
                          fullWidth
                          select
                          label="分类"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          SelectProps={{
                            native: true,
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              borderRadius: 2,
                            },
                          }}
                        >
                          <option value="">请选择分类</option>
                          <option value="gaming">游戏</option>
                          <option value="music">音乐</option>
                          <option value="tech">科技</option>
                          <option value="entertainment">娱乐</option>
                          <option value="life">生活</option>
                          <option value="food">美食</option>
                          <option value="sports">体育</option>
                          <option value="education">教育</option>
                        </TextField>

                        {/* 上传进度 */}
                        {uploadMutation.isPending && (
                          <Fade in>
                            <Box>
                              <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                <Typography variant="body2" fontWeight={600}>
                                  上传中...
                                </Typography>
                                <Typography variant="body2" color="primary">
                                  {uploadProgress}%
                                </Typography>
                              </Stack>
                              <LinearProgress
                                variant="determinate"
                                value={uploadProgress}
                                sx={{ height: 8, borderRadius: 4 }}
                              />
                            </Box>
                          </Fade>
                        )}

                        {/* 提交按钮 */}
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                          <Button
                            variant="outlined"
                            onClick={() => navigate('/')}
                            disabled={uploadMutation.isPending}
                            sx={{ borderRadius: 2, px: 3 }}
                          >
                            取消
                          </Button>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              type="submit"
                              variant="contained"
                              disabled={uploadMutation.isPending || !videoFile}
                              startIcon={<PlayCircleIcon />}
                              sx={{
                                borderRadius: 2,
                                px: 4,
                                py: 1.5,
                                background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                                '&:hover': {
                                  boxShadow: '0 6px 20px rgba(255, 107, 107, 0.4)',
                                },
                              }}
                            >
                              {uploadMutation.isPending ? '上传中...' : '发布视频'}
                            </Button>
                          </motion.div>
                        </Stack>
                      </Stack>
                    </Paper>
                  </Zoom>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default UploadEnhanced;
