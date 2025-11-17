import {
  argbFromHex,
  themeFromSourceColor,
  applyTheme,
  Scheme
} from '@material/material-color-utilities';

/**
 * Material You 莫奈取色系统
 * 根据源颜色生成完整的动态主题配色方案
 */

// 将Material Color Utilities的scheme转换为MUI主题颜色
const convertSchemeToMuiColors = (scheme) => {
  return {
    primary: {
      main: rgbFromArgb(scheme.primary),
      light: rgbFromArgb(scheme.primaryContainer),
      dark: rgbFromArgb(scheme.onPrimary),
      contrastText: rgbFromArgb(scheme.onPrimary),
    },
    secondary: {
      main: rgbFromArgb(scheme.secondary),
      light: rgbFromArgb(scheme.secondaryContainer),
      dark: rgbFromArgb(scheme.onSecondary),
      contrastText: rgbFromArgb(scheme.onSecondary),
    },
    tertiary: {
      main: rgbFromArgb(scheme.tertiary),
      light: rgbFromArgb(scheme.tertiaryContainer),
      dark: rgbFromArgb(scheme.onTertiary),
      contrastText: rgbFromArgb(scheme.onTertiary),
    },
    error: {
      main: rgbFromArgb(scheme.error),
      light: rgbFromArgb(scheme.errorContainer),
      dark: rgbFromArgb(scheme.onError),
      contrastText: rgbFromArgb(scheme.onError),
    },
    background: {
      default: rgbFromArgb(scheme.background),
      paper: rgbFromArgb(scheme.surface),
    },
    surface: {
      main: rgbFromArgb(scheme.surface),
      variant: rgbFromArgb(scheme.surfaceVariant),
      container: rgbFromArgb(scheme.surfaceContainer),
      containerHigh: rgbFromArgb(scheme.surfaceContainerHigh),
      containerHighest: rgbFromArgb(scheme.surfaceContainerHighest),
    },
    text: {
      primary: rgbFromArgb(scheme.onSurface),
      secondary: rgbFromArgb(scheme.onSurfaceVariant),
    }
  };
};

// 将ARGB格式转换为RGB字符串
const rgbFromArgb = (argb) => {
  const r = (argb >> 16) & 255;
  const g = (argb >> 8) & 255;
  const b = argb & 255;
  return `rgb(${r}, ${g}, ${b})`;
};

// 从图片提取主色调
export const extractColorFromImage = async (imageUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // 获取中心点的颜色作为主色调
      const imageData = ctx.getImageData(
        Math.floor(img.width / 2),
        Math.floor(img.height / 2),
        1,
        1
      );

      const [r, g, b] = imageData.data;
      const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

      resolve(hex);
    };

    img.onerror = reject;
    img.src = imageUrl;
  });
};

// 生成Material You主题
export const generateMaterialYouTheme = (sourceColorHex, isDark = false) => {
  // 将hex颜色转换为argb
  const sourceColorArgb = argbFromHex(sourceColorHex);

  // 生成主题
  const theme = themeFromSourceColor(sourceColorArgb);

  // 获取对应模式的scheme
  const scheme = isDark ? theme.schemes.dark : theme.schemes.light;

  return convertSchemeToMuiColors(scheme);
};

// 应用主题到DOM（用于动态颜色）
export const applyDynamicTheme = (sourceColorHex, isDark = false) => {
  const sourceColorArgb = argbFromHex(sourceColorHex);
  const theme = themeFromSourceColor(sourceColorArgb);

  applyTheme(theme, { target: document.body, dark: isDark });
};

// 预设的配色方案
export const presetColors = {
  youtube: '#FF0000',      // YouTube红
  bilibili: '#00A1D6',     // bilibili蓝
  purple: '#6750A4',       // Material紫
  green: '#4CAF50',        // 绿色
  orange: '#FF6D00',       // 橙色
  pink: '#E91E63',         // 粉色
};

export default {
  generateMaterialYouTheme,
  extractColorFromImage,
  applyDynamicTheme,
  presetColors
};
