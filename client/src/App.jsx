import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Toaster } from 'react-hot-toast';

// 主题
import { ThemeProvider } from './theme/ThemeContext';

// 组件
import Navbar from './components/Navbar';

// 页面
import Home from './pages/Home';
import Watch from './pages/Watch';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import Search from './pages/Search';
import UserProfile from './pages/UserProfile';

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

  const drawer = (
    <Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => {
                window.location.href = item.path;
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <Box sx={{ display: 'flex' }}>
            {/* 导航栏 */}
            <Navbar onMenuClick={handleDrawerToggle} />

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
                <Route path="/watch/:videoId" element={<Watch />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/search" element={<Search />} />
                <Route path="/user/:userId" element={<UserProfile />} />
              </Routes>
            </Box>
          </Box>

          {/* Toast 通知 */}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
