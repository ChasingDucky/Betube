import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  IconButton,
  Slider,
  Stack,
  Typography,
  Select,
  MenuItem,
  Tooltip,
  useTheme,
  alpha,
  Fade,
  Chip,
  Menu,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import SettingsIcon from '@mui/icons-material/Settings';
import ForwardIcon from '@mui/icons-material/Forward10';
import ReplayIcon from '@mui/icons-material/Replay10';
import SpeedIcon from '@mui/icons-material/Speed';
import SubtitlesIcon from '@mui/icons-material/Subtitles';
import PictureInPictureAltIcon from '@mui/icons-material/PictureInPictureAlt';
import DanmakuOverlay from './DanmakuOverlay';

/**
 * 增强版视频播放器组件
 * 支持弹幕、多清晰度、播放速度、快进快退、画中画等功能
 */
const VideoPlayerEnhanced = ({ videoId, videoUrl }) => {
  const theme = useTheme();
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [quality, setQuality] = useState('1080p');
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [danmakuEnabled, setDanmakuEnabled] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [settingsAnchor, setSettingsAnchor] = useState(null);

  const controlsTimeoutRef = useRef(null);

  // 播放/暂停
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // 更新进度
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);

      // 更新缓冲进度
      if (videoRef.current.buffered.length > 0) {
        const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
        setBuffered((bufferedEnd / videoRef.current.duration) * 100);
      }
    }
  };

  // 加载元数据
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  // 跳转到指定时间
  const handleSeek = (event, newValue) => {
    if (videoRef.current) {
      videoRef.current.currentTime = newValue;
      setCurrentTime(newValue);
    }
  };

  // 音量控制
  const handleVolumeChange = (event, newValue) => {
    if (videoRef.current) {
      videoRef.current.volume = newValue;
      setVolume(newValue);
      setIsMuted(newValue === 0);
    }
  };

  // 静音切换
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // 全屏
  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
        setIsFullscreen(false);
      } else {
        containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      }
    }
  };

  // 画中画
  const togglePictureInPicture = async () => {
    if (videoRef.current) {
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          await videoRef.current.requestPictureInPicture();
        }
      } catch (error) {
        console.error('画中画模式失败:', error);
      }
    }
  };

  // 快进/快退
  const skipTime = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        Math.min(duration, videoRef.current.currentTime + seconds)
      );
    }
  };

  // 改变播放速度
  const changePlaybackRate = (rate) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
      setSettingsAnchor(null);
    }
  };

  // 格式化时间
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 控制条自动隐藏
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  // 键盘控制
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'm':
          toggleMute();
          break;
        case 'ArrowLeft':
          skipTime(-10);
          break;
        case 'ArrowRight':
          skipTime(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange(null, Math.min(1, volume + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange(null, Math.max(0, volume - 0.1));
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, volume]);

  return (
    <Box
      ref={containerRef}
      onMouseMove={handleMouseMove}
      sx={{
        position: 'relative',
        width: '100%',
        paddingTop: '56.25%', // 16:9 aspect ratio
        backgroundColor: '#000',
        borderRadius: 0,
        overflow: 'hidden',
        cursor: showControls ? 'default' : 'none',
      }}
    >
      {/* 视频元素 */}
      <video
        ref={videoRef}
        src={videoUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onClick={togglePlay}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />

      {/* 弹幕层 */}
      {danmakuEnabled && (
        <DanmakuOverlay videoId={videoId} currentTime={currentTime} />
      )}

      {/* 播放按钮覆盖层 */}
      <AnimatePresence>
        {!isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
            }}
          >
            <IconButton
              onClick={togglePlay}
              sx={{
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)} 0%, ${alpha(theme.palette.secondary.main, 0.9)} 100%)`,
                backdropFilter: 'blur(10px)',
                color: 'white',
                width: 80,
                height: 80,
                boxShadow: `0 8px 32px ${alpha(theme.palette.primary.main, 0.4)}`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s',
              }}
            >
              <PlayArrowIcon sx={{ fontSize: 48 }} />
            </IconButton>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 快捷操作提示 */}
      <AnimatePresence>
        {showControls && !isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            style={{
              position: 'absolute',
              bottom: 100,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 5,
            }}
          >
            <Stack direction="row" spacing={1}>
              <Chip
                label="空格: 播放/暂停"
                size="small"
                sx={{
                  background: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(10px)',
                }}
              />
              <Chip
                label="F: 全屏"
                size="small"
                sx={{
                  background: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(10px)',
                }}
              />
              <Chip
                label="M: 静音"
                size="small"
                sx={{
                  background: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(10px)',
                }}
              />
            </Stack>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 控制条 */}
      <Fade in={showControls}>
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: `linear-gradient(to top, ${alpha('#000', 0.9)} 0%, transparent 100%)`,
            padding: 2,
            zIndex: 20,
          }}
        >
          {/* 进度条 */}
          <Box sx={{ position: 'relative', mb: 1 }}>
            {/* 缓冲进度 */}
            <Box
              sx={{
                position: 'absolute',
                height: 4,
                top: '50%',
                transform: 'translateY(-50%)',
                left: 0,
                width: `${buffered}%`,
                backgroundColor: alpha('#fff', 0.3),
                borderRadius: 2,
                zIndex: 1,
              }}
            />
            <Slider
              value={currentTime}
              max={duration}
              onChange={handleSeek}
              sx={{
                position: 'relative',
                zIndex: 2,
                '& .MuiSlider-thumb': {
                  width: 14,
                  height: 14,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  '&:hover': {
                    boxShadow: `0 0 0 8px ${alpha(theme.palette.primary.main, 0.16)}`,
                  },
                },
                '& .MuiSlider-track': {
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  border: 'none',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: alpha('#fff', 0.2),
                },
              }}
            />
          </Box>

          <Stack direction="row" alignItems="center" spacing={1}>
            {/* 播放/暂停 */}
            <Tooltip title={isPlaying ? '暂停 (空格)' : '播放 (空格)'}>
              <IconButton onClick={togglePlay} sx={{ color: 'white' }}>
                {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
              </IconButton>
            </Tooltip>

            {/* 快退 */}
            <Tooltip title="快退10秒 (←)">
              <IconButton onClick={() => skipTime(-10)} sx={{ color: 'white' }}>
                <ReplayIcon />
              </IconButton>
            </Tooltip>

            {/* 快进 */}
            <Tooltip title="快进10秒 (→)">
              <IconButton onClick={() => skipTime(10)} sx={{ color: 'white' }}>
                <ForwardIcon />
              </IconButton>
            </Tooltip>

            {/* 时间 */}
            <Typography
              variant="body2"
              sx={{
                color: 'white',
                minWidth: 120,
                fontWeight: 600,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {formatTime(currentTime)} / {formatTime(duration)}
            </Typography>

            {/* 音量 */}
            <Tooltip title={isMuted ? '取消静音 (M)' : '静音 (M)'}>
              <IconButton onClick={toggleMute} sx={{ color: 'white' }}>
                {isMuted || volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
              </IconButton>
            </Tooltip>

            <Slider
              value={isMuted ? 0 : volume}
              max={1}
              step={0.1}
              onChange={handleVolumeChange}
              sx={{
                width: 100,
                '& .MuiSlider-thumb': {
                  background: 'white',
                },
                '& .MuiSlider-track': {
                  background: 'white',
                },
              }}
            />

            <Box sx={{ flex: 1 }} />

            {/* 播放速度 */}
            {playbackRate !== 1 && (
              <Chip
                label={`${playbackRate}x`}
                size="small"
                sx={{
                  background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                  color: 'white',
                  fontWeight: 600,
                }}
              />
            )}

            {/* 清晰度选择 */}
            <Select
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              size="small"
              sx={{
                color: 'white',
                minWidth: 90,
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha('#fff', 0.3),
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: alpha('#fff', 0.5),
                },
                '& .MuiSvgIcon-root': {
                  color: 'white',
                },
              }}
            >
              <MenuItem value="360p">360P 流畅</MenuItem>
              <MenuItem value="480p">480P 清晰</MenuItem>
              <MenuItem value="720p">720P 高清</MenuItem>
              <MenuItem value="1080p">1080P 超清</MenuItem>
            </Select>

            {/* 画中画 */}
            <Tooltip title="画中画">
              <IconButton onClick={togglePictureInPicture} sx={{ color: 'white' }}>
                <PictureInPictureAltIcon />
              </IconButton>
            </Tooltip>

            {/* 设置 */}
            <Tooltip title="设置">
              <IconButton
                onClick={(e) => setSettingsAnchor(e.currentTarget)}
                sx={{ color: 'white' }}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>

            {/* 全屏 */}
            <Tooltip title={isFullscreen ? '退出全屏 (F)' : '全屏 (F)'}>
              <IconButton onClick={toggleFullscreen} sx={{ color: 'white' }}>
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </Fade>

      {/* 设置菜单 */}
      <Menu
        anchorEl={settingsAnchor}
        open={Boolean(settingsAnchor)}
        onClose={() => setSettingsAnchor(null)}
        PaperProps={{
          sx: {
            background: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            minWidth: 200,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            播放速度
          </Typography>
          <Stack spacing={0.5}>
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
              <MenuItem
                key={rate}
                onClick={() => changePlaybackRate(rate)}
                selected={playbackRate === rate}
                sx={{ borderRadius: 1 }}
              >
                <ListItemIcon>
                  <SpeedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{rate}x</ListItemText>
              </MenuItem>
            ))}
          </Stack>
        </Box>
      </Menu>
    </Box>
  );
};

export default VideoPlayerEnhanced;
