import React, { useState } from 'react';
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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { videoAPI } from '../services/api';
import toast from 'react-hot-toast';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';

const Upload = () => {
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: [],
    category: '',
  });
  const [tagInput, setTagInput] = useState('');

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

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500 * 1024 * 1024) {
        // 500MB限制
        toast.error('视频文件大小不能超过500MB');
        return;
      }
      setVideoFile(file);
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
          上传视频
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          分享你的精彩内容给全世界
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* 视频上传 */}
            <Box>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<CloudUploadIcon />}
                sx={{
                  py: 6,
                  borderStyle: 'dashed',
                  borderWidth: 2,
                }}
              >
                {videoFile ? videoFile.name : '点击选择视频文件'}
                <input
                  type="file"
                  accept="video/*"
                  hidden
                  onChange={handleVideoChange}
                />
              </Button>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                支持MP4、AVI、MOV等格式，最大500MB
              </Typography>
            </Box>

            {/* 封面上传 */}
            <Box>
              <Button variant="outlined" component="label" fullWidth>
                {thumbnailFile ? thumbnailFile.name : '选择封面图片（可选）'}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleThumbnailChange}
                />
              </Button>
            </Box>

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
            />

            {/* 标签 */}
            <Box>
              <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <TextField
                  size="small"
                  label="添加标签"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  disabled={formData.tags.length >= 10}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddTag}
                  disabled={formData.tags.length >= 10}
                >
                  添加
                </Button>
              </Stack>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {formData.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleDeleteTag(tag)}
                    deleteIcon={<CloseIcon />}
                  />
                ))}
              </Stack>
              <Typography variant="caption" color="text.secondary">
                最多10个标签
              </Typography>
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
              <Box>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                  上传进度: {uploadProgress}%
                </Typography>
              </Box>
            )}

            {/* 提交按钮 */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                onClick={() => navigate('/')}
                disabled={uploadMutation.isPending}
              >
                取消
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={uploadMutation.isPending || !videoFile}
              >
                {uploadMutation.isPending ? '上传中...' : '发布视频'}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default Upload;
