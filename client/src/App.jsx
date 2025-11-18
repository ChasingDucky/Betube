import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Toaster } from 'react-hot-toast';

// 主题
import { ThemeProvider } from './theme/ThemeContext';

// 组件
import NavbarEnhanced from './components/NavbarEnhanced';
import SidebarEnhanced from './components/SidebarEnhanced';

// 页面
import Home from './pages/Home';
import WatchEnhanced from './pages/WatchEnhanced';
import LoginEnhanced from './pages/LoginEnhanced';
import RegisterEnhanced from './pages/RegisterEnhanced';
import UploadEnhanced from './pages/UploadEnhanced';
import SearchEnhanced from './pages/SearchEnhanced';
import UserProfileEnhanced from './pages/UserProfileEnhanced';

// 图标
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import HistoryIcon from '@mui/icons-material/History';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

// 创建 React Query 客户端
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5分钟
    },
  },
});

const drawerWidth = 240;

const App = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: '首页', icon: <HomeIcon />, path: '/' },
    { text: '探索', icon: <ExploreIcon />, path: '/explore' },
    { text: '订阅', icon: <SubscriptionsIcon />, path: '/subscriptions' },
    { text: '视频库', icon: <VideoLibraryIcon />, path: '/library' },
    { text: '历史记录', icon: <HistoryIcon />, path: '/history' },
    { text: '我喜欢的', icon: <ThumbUpIcon />, path: '/liked' },
  ];

  const drawer = <SidebarEnhanced />;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <Box sx={{ display: 'flex' }}>
            {/* 导航栏 */}
            <NavbarEnhanced onMenuClick={handleDrawerToggle} />

            {/* 侧边栏 */}
            <Box
              component="nav"
              sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
              {/* 移动端抽屉 */}
              <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true,
                }}
                sx={{
                  display: { xs: 'block', sm: 'none' },
                  '& .MuiDrawer-paper': {
                    boxSizing: 'border-box',
                    width: drawerWidth,
                  },
                }}
              >
                {drawer}
              </Drawer>

              {/* 桌面端抽屉 */}
              <Drawer
                variant="permanent"
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  '& .MuiDrawer-paper': {
                    boxSizing: 'border-box',
                    width: drawerWidth,
                    top: 64,
                    height: 'calc(100% - 64px)',
                  },
                }}
                open
              >
                {drawer}
              </Drawer>
            </Box>

            {/* 主内容区 */}
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                width: { sm: `calc(100% - ${drawerWidth}px)` },
                mt: 8,
              }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/watch/:videoId" element={<WatchEnhanced />} />
                <Route path="/login" element={<LoginEnhanced />} />
                <Route path="/register" element={<RegisterEnhanced />} />
                <Route path="/upload" element={<UploadEnhanced />} />
                <Route path="/search" element={<SearchEnhanced />} />
                <Route path="/user/:userId" element={<UserProfileEnhanced />} />
              </Routes>
            </Box>
          </Box>

          {/* Toast 通知 */}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.95) 0%, rgba(78, 205, 196, 0.95) 100%)',
                color: '#fff',
                padding: '16px 24px',
                fontSize: '0.95rem',
                fontWeight: 600,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              },
              success: {
                style: {
                  background: 'linear-gradient(135deg, rgba(76, 175, 80, 0.95) 0%, rgba(67, 160, 71, 0.95) 100%)',
                  boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: 'rgba(76, 175, 80, 0.95)',
                },
              },
              error: {
                style: {
                  background: 'linear-gradient(135deg, rgba(244, 67, 54, 0.95) 0%, rgba(229, 57, 53, 0.95) 100%)',
                  boxShadow: '0 8px 32px rgba(244, 67, 54, 0.3)',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: 'rgba(244, 67, 54, 0.95)',
                },
              },
              loading: {
                style: {
                  background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.95) 0%, rgba(30, 136, 229, 0.95) 100%)',
                  boxShadow: '0 8px 32px rgba(33, 150, 243, 0.3)',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: 'rgba(33, 150, 243, 0.95)',
                },
              },
            }}
          />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
