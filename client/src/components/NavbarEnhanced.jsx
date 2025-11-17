import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  InputBase,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Button,
  Stack,
  Badge,
  Switch,
  Divider,
  ListItemIcon,
  ListItemText,
  Fade,
  Zoom,
  Tooltip,
} from '@mui/material';
import { styled, alpha } from '@mui/material/styles';
import { motion } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import PaletteIcon from '@mui/icons-material/Palette';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../theme/ThemeContext';
import useAuthStore from '../stores/authStore';
import { presetColors } from '../theme/materialYouTheme';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: 24,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
  backdropFilter: 'blur(10px)',
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
    border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
  },
  '&:focus-within': {
    backgroundColor: alpha(theme.palette.common.white, 0.3),
    border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
    boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
  marginLeft: 0,
  width: '100%',
  transition: 'all 0.3s ease',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.25, 1, 1.25, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '40ch',
      '&:focus': {
        width: '55ch',
      },
    },
  },
}));

const NavbarEnhanced = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const { mode, toggleMode, usePresetColor } = useTheme();
  const { user, isAuthenticated, logout } = useAuthStore();

  const [anchorEl, setAnchorEl] = useState(null);
  const [themeMenuAnchor, setThemeMenuAnchor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeMenu = (event) => {
    setThemeMenuAnchor(event.currentTarget);
  };

  const handleThemeMenuClose = () => {
    setThemeMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchFocused(false);
    }
  };

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{
        backdropFilter: 'blur(20px)',
        backgroundColor: (theme) =>
          alpha(theme.palette.background.default, 0.8),
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        {/* 菜单按钮 */}
        <Tooltip title="菜单" arrow>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMenuClick}
            sx={{
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'rotate(90deg)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Tooltip>

        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Box
            onClick={() => navigate('/')}
            sx={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontWeight: 900,
                  fontSize: '1.2rem',
                }}
              >
                B
              </Typography>
            </Box>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              Betube
            </Typography>
          </Box>
        </motion.div>

        {/* 搜索框 */}
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }}>
          <form onSubmit={handleSearch}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="搜索视频..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </Search>
          </form>
        </Box>

        {/* 右侧按钮组 */}
        <Stack direction="row" spacing={1} alignItems="center">
          {/* 主题切换 */}
          <Tooltip title="主题设置" arrow>
            <IconButton
              color="inherit"
              onClick={handleThemeMenu}
              sx={{
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'rotate(180deg)',
                },
              }}
            >
              <PaletteIcon />
            </IconButton>
          </Tooltip>

          {/* 上传视频 */}
          {isAuthenticated && (
            <Tooltip title="上传视频" arrow>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  color="inherit"
                  onClick={() => navigate('/upload')}
                  sx={{
                    background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                    color: 'white',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    },
                  }}
                >
                  <VideoCallIcon />
                </IconButton>
              </motion.div>
            </Tooltip>
          )}

          {/* 通知 */}
          {isAuthenticated && (
            <Tooltip title="通知" arrow>
              <IconButton color="inherit">
                <Badge badgeContent={0} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          )}

          {/* 用户菜单 */}
          {isAuthenticated ? (
            <>
              <Tooltip title="账户" arrow>
                <IconButton onClick={handleMenu}>
                  <motion.div whileHover={{ scale: 1.1 }}>
                    <Avatar
                      src={user?.avatar}
                      alt={user?.name}
                      sx={{
                        width: 36,
                        height: 36,
                        border: '2px solid',
                        borderColor: 'primary.main',
                      }}
                    />
                  </motion.div>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                TransitionComponent={Fade}
                PaperProps={{
                  sx: {
                    borderRadius: 2,
                    minWidth: 200,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {user?.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem
                  onClick={() => {
                    navigate(`/user/${user._id}`);
                    handleClose();
                  }}
                >
                  <ListItemIcon>
                    <AccountCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>我的主页</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate('/settings');
                    handleClose();
                  }}
                >
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>设置</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>退出登录</ListItemText>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                startIcon={<AccountCircleIcon />}
                onClick={() => navigate('/login')}
                sx={{
                  borderRadius: 3,
                  px: 2,
                  background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                  boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
                }}
              >
                登录
              </Button>
            </motion.div>
          )}
        </Stack>

        {/* 主题菜单 */}
        <Menu
          anchorEl={themeMenuAnchor}
          open={Boolean(themeMenuAnchor)}
          onClose={handleThemeMenuClose}
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              borderRadius: 2,
              minWidth: 250,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            },
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
              外观设置
            </Typography>
          </Box>
          <MenuItem>
            <Stack direction="row" alignItems="center" spacing={2} width="100%">
              {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
              <Typography sx={{ flex: 1 }}>深色模式</Typography>
              <Switch checked={mode === 'dark'} onChange={toggleMode} />
            </Stack>
          </MenuItem>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="caption" color="text.secondary" fontWeight={600}>
              莫奈取色预设
            </Typography>
          </Box>
          {Object.entries(presetColors).map(([name, color]) => (
            <MenuItem
              key={name}
              onClick={() => {
                usePresetColor(name);
                handleThemeMenuClose();
              }}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  backgroundColor: color,
                  mr: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  border: '2px solid white',
                }}
              />
              <Typography sx={{ textTransform: 'capitalize' }}>{name}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default NavbarEnhanced;
