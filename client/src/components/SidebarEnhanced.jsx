import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  alpha,
  useTheme,
  Avatar,
  Stack,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import HistoryIcon from '@mui/icons-material/History';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import useAuthStore from '../stores/authStore';

const menuItems = [
  { text: '首页', icon: <HomeIcon />, path: '/', badge: null },
  { text: '探索', icon: <ExploreIcon />, path: '/explore', badge: 'New' },
  { text: '热门', icon: <TrendingUpIcon />, path: '/trending', badge: null },
];

const libraryItems = [
  { text: '视频库', icon: <VideoLibraryIcon />, path: '/library' },
  { text: '历史记录', icon: <HistoryIcon />, path: '/history' },
  { text: '我喜欢的', icon: <ThumbUpIcon />, path: '/liked' },
  { text: '稍后观看', icon: <WatchLaterIcon />, path: '/watch-later' },
];

const subscriptionItems = [
  { text: '订阅内容', icon: <SubscriptionsIcon />, path: '/subscriptions' },
];

const SidebarEnhanced = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  const isActive = (path) => location.pathname === path;

  const MenuItemComponent = ({ item, index }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <ListItem disablePadding sx={{ mb: 0.5 }}>
        <ListItemButton
          onClick={() => navigate(item.path)}
          sx={{
            borderRadius: 2,
            mx: 1,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            background: isActive(item.path)
              ? `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.15)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`
              : 'transparent',
            '&:hover': {
              background: isActive(item.path)
                ? `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.2)} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`
                : alpha(theme.palette.action.hover, 0.08),
              transform: 'translateX(4px)',
            },
            '&::before': isActive(item.path)
              ? {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '20%',
                  bottom: '20%',
                  width: 4,
                  borderRadius: '0 4px 4px 0',
                  background: `linear-gradient(180deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                }
              : {},
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 40,
              color: isActive(item.path)
                ? theme.palette.primary.main
                : theme.palette.text.secondary,
              transition: 'color 0.3s',
            }}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.icon}
            </motion.div>
          </ListItemIcon>
          <ListItemText
            primary={item.text}
            primaryTypographyProps={{
              fontWeight: isActive(item.path) ? 600 : 500,
              fontSize: '0.9rem',
              color: isActive(item.path)
                ? theme.palette.primary.main
                : theme.palette.text.primary,
            }}
          />
          {item.badge && (
            <Chip
              label={item.badge}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.7rem',
                fontWeight: 600,
                background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                color: 'white',
              }}
            />
          )}
        </ListItemButton>
      </ListItem>
    </motion.div>
  );

  return (
    <Box
      sx={{
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        pt: 2,
        '&::-webkit-scrollbar': {
          width: 6,
        },
        '&::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          background: alpha(theme.palette.text.primary, 0.2),
          borderRadius: 3,
          '&:hover': {
            background: alpha(theme.palette.text.primary, 0.3),
          },
        },
      }}
    >
      {/* 主导航 */}
      <List>
        {menuItems.map((item, index) => (
          <MenuItemComponent key={item.path} item={item} index={index} />
        ))}
      </List>

      <Divider sx={{ my: 2, mx: 2 }} />

      {/* 媒体库 */}
      {isAuthenticated && (
        <>
          <Box sx={{ px: 3, py: 1 }}>
            <Typography
              variant="caption"
              fontWeight={600}
              color="text.secondary"
              sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
            >
              媒体库
            </Typography>
          </Box>
          <List>
            {libraryItems.map((item, index) => (
              <MenuItemComponent key={item.path} item={item} index={index + menuItems.length} />
            ))}
          </List>

          <Divider sx={{ my: 2, mx: 2 }} />
        </>
      )}

      {/* 订阅 */}
      {isAuthenticated && (
        <>
          <Box sx={{ px: 3, py: 1 }}>
            <Typography
              variant="caption"
              fontWeight={600}
              color="text.secondary"
              sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
            >
              订阅
            </Typography>
          </Box>
          <List>
            {subscriptionItems.map((item, index) => (
              <MenuItemComponent key={item.path} item={item} index={index} />
            ))}
          </List>

          {/* 订阅的UP主列表（示例） */}
          <Box sx={{ px: 2, mt: 2 }}>
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ListItemButton
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.action.hover, 0.08),
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        border: `2px solid ${theme.palette.background.paper}`,
                      }}
                      src={`https://i.pravatar.cc/150?img=${i}`}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={`UP主 ${i}`}
                    primaryTypographyProps={{
                      fontSize: '0.85rem',
                      noWrap: true,
                    }}
                  />
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: 'success.main',
                      boxShadow: `0 0 8px ${theme.palette.success.main}`,
                    }}
                  />
                </ListItemButton>
              </motion.div>
            ))}
          </Box>
        </>
      )}

      {/* 底部装饰 */}
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          mt: 4,
          p: 2,
          background: `linear-gradient(to top, ${theme.palette.background.paper} 70%, transparent)`,
        }}
      >
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
            Betube © 2024
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
            让精彩触手可及
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SidebarEnhanced;
