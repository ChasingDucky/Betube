import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Stack,
  Divider,
  InputAdornment,
  IconButton,
  Fade,
  Slide,
  useTheme,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../services/api';
import useAuthStore from '../stores/authStore';
import toast from 'react-hot-toast';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

const LoginEnhanced = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const loginMutation = useMutation({
    mutationFn: (credentials) => authAPI.login(credentials),
    onSuccess: (response) => {
      const { user, token } = response.data;
      login(user, token);
      toast.success('登录成功！欢迎回来');
      navigate('/');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || '登录失败，请检查账号密码');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg,
          ${alpha(theme.palette.primary.main, 0.1)} 0%,
          ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        py: 4,
      }}
    >
      {/* 背景装饰 */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)} 0%, transparent 70%)`,
          animation: 'float 6s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-30px)' },
          },
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -100,
          left: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.2)} 0%, transparent 70%)`,
          animation: 'float 8s ease-in-out infinite',
          animationDelay: '1s',
        }}
      />

      <Container maxWidth="sm">
        <Slide direction="up" in timeout={500}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, sm: 5 },
                borderRadius: 4,
                background: alpha(theme.palette.background.paper, 0.9),
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
              }}
            >
              {/* Logo和标题 */}
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      margin: '0 auto',
                      mb: 2,
                      borderRadius: 3,
                      background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 8px 24px rgba(255, 107, 107, 0.3)',
                    }}
                  >
                    <PlayCircleIcon sx={{ fontSize: 48, color: 'white' }} />
                  </Box>
                </motion.div>

                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{
                    mb: 1,
                    background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  欢迎回来
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  登录继续观看精彩视频
                </Typography>
              </Box>

              {/* 登录表单 */}
              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  <Fade in timeout={600}>
                    <TextField
                      fullWidth
                      label="邮箱地址"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s',
                          '&:hover': {
                            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
                          },
                          '&.Mui-focused': {
                            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                          },
                        },
                      }}
                    />
                  </Fade>

                  <Fade in timeout={700}>
                    <TextField
                      fullWidth
                      label="密码"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      autoComplete="current-password"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s',
                          '&:hover': {
                            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.1)}`,
                          },
                          '&.Mui-focused': {
                            boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                          },
                        },
                      }}
                    />
                  </Fade>

                  <Box sx={{ textAlign: 'right' }}>
                    <Link
                      href="#"
                      underline="hover"
                      color="primary"
                      sx={{
                        fontWeight: 500,
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'translateX(-2px)',
                        },
                      }}
                    >
                      忘记密码？
                    </Link>
                  </Box>

                  <Fade in timeout={800}>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={loginMutation.isPending}
                        startIcon={<LoginIcon />}
                        sx={{
                          py: 1.5,
                          borderRadius: 2,
                          fontSize: '1rem',
                          fontWeight: 600,
                          background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                          boxShadow: '0 4px 16px rgba(255, 107, 107, 0.3)',
                          '&:hover': {
                            boxShadow: '0 6px 24px rgba(255, 107, 107, 0.4)',
                          },
                        }}
                      >
                        {loginMutation.isPending ? '登录中...' : '登录'}
                      </Button>
                    </motion.div>
                  </Fade>
                </Stack>
              </form>

              <Divider sx={{ my: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  或
                </Typography>
              </Divider>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  还没有账号？
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => navigate('/register')}
                    sx={{
                      ml: 1,
                      fontWeight: 600,
                      textDecoration: 'none',
                      background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    立即注册
                  </Link>
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        </Slide>
      </Container>
    </Box>
  );
};

export default LoginEnhanced;
