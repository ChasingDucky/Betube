import React, { useState } from 'react';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Avatar,
  Chip,
  Stack,
  Skeleton,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Fade,
  Grow,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from '../utils/dateUtils';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import ShareIcon from '@mui/icons-material/Share';
import FlagIcon from '@mui/icons-material/Flag';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

const VideoCardEnhanced = ({ video, index = 0 }) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = () => {
    navigate(`/watch/${video._id}`);
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grow in timeout={300 + index * 100}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ y: -8 }}
      >
        <Card
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
          sx={{
            cursor: 'pointer',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative',
            '&:hover': {
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
              '& .play-overlay': {
                opacity: 1,
              },
            },
          }}
        >
          {/* 缩略图 */}
          <Box sx={{ position: 'relative', paddingTop: '56.25%', overflow: 'hidden' }}>
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
                animation="wave"
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
                transition: 'transform 0.3s ease',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              }}
            />

            {/* 播放覆盖层 */}
            <Box
              className="play-overlay"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                opacity: 0,
                transition: 'opacity 0.3s ease',
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.2s ease',
                }}
              >
                <PlayArrowIcon sx={{ fontSize: 36, color: 'primary.main' }} />
              </Box>
            </Box>

            {/* 时长标签 */}
            <Chip
              label={video.duration || '00:00'}
              size="small"
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.75rem',
                height: 24,
                backdropFilter: 'blur(4px)',
              }}
            />

            {/* 统计信息 */}
            <Stack
              direction="row"
              spacing={1}
              sx={{
                position: 'absolute',
                top: 8,
                left: 8,
              }}
            >
              <Chip
                icon={<VisibilityIcon sx={{ fontSize: 14 }} />}
                label={video.views?.toLocaleString() || 0}
                size="small"
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  fontSize: '0.7rem',
                  height: 24,
                  backdropFilter: 'blur(4px)',
                  '& .MuiChip-icon': {
                    color: 'white',
                  },
                }}
              />
              <Chip
                icon={<ThumbUpIcon sx={{ fontSize: 14 }} />}
                label={video.likes?.toLocaleString() || 0}
                size="small"
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  fontSize: '0.7rem',
                  height: 24,
                  backdropFilter: 'blur(4px)',
                  '& .MuiChip-icon': {
                    color: 'white',
                  },
                }}
              />
            </Stack>
          </Box>

          {/* 内容区域 */}
          <CardContent sx={{ flexGrow: 1, p: 2 }}>
            <Stack direction="row" spacing={1.5} alignItems="flex-start">
              <Avatar
                src={video.author?.avatar}
                alt={video.author?.name}
                sx={{
                  width: 40,
                  height: 40,
                  border: '2px solid',
                  borderColor: 'background.paper',
                  boxShadow: 1,
                }}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: 1.4,
                    mb: 0.5,
                    fontSize: '0.95rem',
                  }}
                >
                  {video.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontWeight={500}
                  sx={{ mb: 0.5, fontSize: '0.85rem' }}
                >
                  {video.author?.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {formatDistanceToNow(video.createdAt)}
                </Typography>
              </Box>

              {/* 更多菜单 */}
              <IconButton
                size="small"
                onClick={handleMenuClick}
                sx={{
                  opacity: isHovered ? 1 : 0,
                  transition: 'opacity 0.2s',
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Stack>

            {/* 标签 */}
            {video.tags && video.tags.length > 0 && (
              <Stack direction="row" spacing={0.5} sx={{ mt: 1.5, flexWrap: 'wrap', gap: 0.5 }}>
                {video.tags.slice(0, 3).map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 20,
                      fontSize: '0.7rem',
                      borderRadius: 1,
                    }}
                  />
                ))}
              </Stack>
            )}
          </CardContent>

          {/* 菜单 */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onClick={(e) => e.stopPropagation()}
            TransitionComponent={Fade}
          >
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <WatchLaterIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>稍后观看</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <PlaylistAddIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>添加到播放列表</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <ShareIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>分享</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ListItemIcon>
                <FlagIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>举报</ListItemText>
            </MenuItem>
          </Menu>
        </Card>
      </motion.div>
    </Grow>
  );
};

export default VideoCardEnhanced;
