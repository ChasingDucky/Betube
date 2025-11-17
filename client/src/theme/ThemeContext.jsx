import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createAppTheme } from './theme';
import { presetColors, applyDynamicTheme } from './materialYouTheme';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // 从localStorage读取主题设置
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('theme-mode');
    return saved || 'light';
  });

  const [sourceColor, setSourceColor] = useState(() => {
    const saved = localStorage.getItem('theme-source-color');
    return saved || presetColors.bilibili;
  });

  // 保存主题设置到localStorage
  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('theme-source-color', sourceColor);
  }, [sourceColor]);

  // 应用动态主题到DOM
  useEffect(() => {
    applyDynamicTheme(sourceColor, mode === 'dark');
  }, [sourceColor, mode]);

  // 创建MUI主题
  const theme = useMemo(() => {
    return createAppTheme(mode, sourceColor);
  }, [mode, sourceColor]);

  // 切换深色/浅色模式
  const toggleMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // 设置主题颜色
  const changeSourceColor = (color) => {
    setSourceColor(color);
  };

  // 使用预设颜色
  const usePresetColor = (presetName) => {
    if (presetColors[presetName]) {
      setSourceColor(presetColors[presetName]);
    }
  };

  const value = {
    mode,
    sourceColor,
    toggleMode,
    changeSourceColor,
    usePresetColor,
    theme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
