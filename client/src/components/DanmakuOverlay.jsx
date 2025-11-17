import React, { useEffect, useState, useRef } from 'react';
import { Box, TextField, IconButton, Stack } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { danmakuAPI } from '../services/api';
import useAuthStore from '../stores/authStore';

/**
 * 弹幕组件
 * 模仿bilibili的弹幕效果
 */

const DanmakuItem = ({ text, color, startTime }) => {
  const [position, setPosition] = useState(100);

  useEffect(() => {
    const duration = 10000; // 10秒横穿屏幕
    const startPosition = 100;
    const endPosition = -100;
    const startTimestamp = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTimestamp;
      const progress = elapsed / duration;

      if (progress >= 1) {
        return; // 动画结束
      }

      const currentPosition = startPosition + (endPosition - startPosition) * progress;
      setPosition(currentPosition);

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <Box
      sx={{
        position: 'absolute',
        left: `${position}%`,
        whiteSpace: 'nowrap',
        color: color || '#FFFFFF',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        textShadow: `
          -1px -1px 0 #000,
          1px -1px 0 #000,
          -1px 1px 0 #000,
          1px 1px 0 #000,
          0 0 3px rgba(0,0,0,0.8)
        `,
        userSelect: 'none',
        pointerEvents: 'none',
        transition: 'none',
      }}
    >
      {text}
    </Box>
  );
};

const DanmakuOverlay = ({ videoId, currentTime }) => {
  const { isAuthenticated } = useAuthStore();
  const [danmakuText, setDanmakuText] = useState('');
  const [activeDanmaku, setActiveDanmaku] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const containerRef = useRef(null);
  const queryClient = useQueryClient();

  // 获取弹幕数据
  const { data: danmakuData } = useQuery({
    queryKey: ['danmaku', videoId],
    queryFn: async () => {
      const response = await danmakuAPI.getDanmaku(videoId);
      return response.data;
    },
    enabled: !!videoId,
  });

  // 发送弹幕
  const sendDanmakuMutation = useMutation({
    mutationFn: (data) => danmakuAPI.sendDanmaku(videoId, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['danmaku', videoId]);
      setDanmakuText('');
    },
  });

  // 根据当前时间显示弹幕
  useEffect(() => {
    if (!danmakuData?.danmaku) return;

    const currentDanmaku = danmakuData.danmaku.filter(
      (d) =>
        Math.abs(d.time - currentTime) < 0.5 && // 0.5秒的误差范围
        !activeDanmaku.find((active) => active.id === d._id)
    );

    if (currentDanmaku.length > 0) {
      setActiveDanmaku((prev) => [
        ...prev,
        ...currentDanmaku.map((d, index) => ({
          id: d._id,
          text: d.text,
          color: d.color,
          top: (Math.floor(prev.length + index) % 10) * 10, // 分层显示
        })),
      ]);

      // 10秒后移除弹幕
      setTimeout(() => {
        setActiveDanmaku((prev) =>
          prev.filter((d) => !currentDanmaku.find((cd) => cd._id === d.id))
        );
      }, 10000);
    }
  }, [currentTime, danmakuData]);

  const handleSendDanmaku = () => {
    if (!danmakuText.trim() || !isAuthenticated) return;

    sendDanmakuMutation.mutate({
      text: danmakuText,
      time: currentTime,
      color: '#FFFFFF',
    });
  };

  return (
    <>
      {/* 弹幕显示层 */}
      <Box
        ref={containerRef}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          overflow: 'hidden',
          zIndex: 5,
        }}
      >
        {activeDanmaku.map((danmaku) => (
          <Box
            key={danmaku.id}
            sx={{
              position: 'absolute',
              top: `${danmaku.top}%`,
              width: '100%',
            }}
          >
            <DanmakuItem
              text={danmaku.text}
              color={danmaku.color}
              startTime={currentTime}
            />
          </Box>
        ))}
      </Box>

      {/* 弹幕输入框 */}
      {isAuthenticated && (
        <Box
          onMouseEnter={() => setShowInput(true)}
          onMouseLeave={() => !danmakuText && setShowInput(false)}
          sx={{
            position: 'absolute',
            bottom: 80,
            left: 0,
            right: 0,
            zIndex: 25,
            px: 2,
            pointerEvents: 'auto',
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              borderRadius: 2,
              p: 1,
              opacity: showInput || danmakuText ? 1 : 0.3,
              transition: 'opacity 0.3s',
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="发个弹幕见证当下..."
              value={danmakuText}
              onChange={(e) => setDanmakuText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendDanmaku();
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.7)',
                  },
                },
              }}
            />
            <IconButton
              onClick={handleSendDanmaku}
              disabled={!danmakuText.trim()}
              sx={{
                color: 'white',
                '&:disabled': {
                  color: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Stack>
        </Box>
      )}
    </>
  );
};

export default DanmakuOverlay;
