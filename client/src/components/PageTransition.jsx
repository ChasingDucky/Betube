import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

/**
 * 页面过渡动画组件
 * 为路由切换添加平滑的过渡效果
 */

// 淡入淡出过渡
export const FadeTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

// 从下方滑入过渡
export const SlideUpTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
};

// 缩放过渡
export const ScaleTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
};

// 从右侧滑入过渡
export const SlideRightTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
};

// 旋转淡入过渡
export const RotateFadeTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: 90 }}
      animate={{ opacity: 1, rotateY: 0 }}
      exit={{ opacity: 0, rotateY: -90 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
};

// 层叠卡片效果
export const CardStackTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateX: -15 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      exit={{ opacity: 0, scale: 1.2, rotateX: 15 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
    >
      {children}
    </motion.div>
  );
};

// 弹跳进入效果
export const BounceTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{
        duration: 0.6,
        type: 'spring',
        stiffness: 200,
        damping: 20,
      }}
    >
      {children}
    </motion.div>
  );
};

// 波纹展开效果
export const RippleTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, borderRadius: '100%' }}
      animate={{ opacity: 1, scale: 1, borderRadius: '0%' }}
      exit={{ opacity: 0, scale: 0, borderRadius: '100%' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      style={{ overflow: 'hidden' }}
    >
      {children}
    </motion.div>
  );
};

// 组合过渡（滑动+淡入+缩放）
export const CombinedTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 50, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
};

// 页面容器组件 - 自动应用过渡效果
export const PageContainer = ({ children, transition = 'fade' }) => {
  const location = useLocation();

  const transitions = {
    fade: FadeTransition,
    slideUp: SlideUpTransition,
    scale: ScaleTransition,
    slideRight: SlideRightTransition,
    rotate: RotateFadeTransition,
    cardStack: CardStackTransition,
    bounce: BounceTransition,
    ripple: RippleTransition,
    combined: CombinedTransition,
  };

  const TransitionComponent = transitions[transition] || FadeTransition;

  return (
    <AnimatePresence mode="wait">
      <TransitionComponent key={location.pathname}>{children}</TransitionComponent>
    </AnimatePresence>
  );
};

// 列表项过渡动画
export const ListItemTransition = ({ children, index = 0, delay = 0.05 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{
        duration: 0.3,
        delay: index * delay,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  );
};

// 卡片悬浮动画
export const HoverCard = ({ children, scale = 1.05 }) => {
  return (
    <motion.div
      whileHover={{
        scale,
        y: -8,
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
};

// 脉冲动画（用于重要元素）
export const PulseAnimation = ({ children }) => {
  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {children}
    </motion.div>
  );
};

// 摇晃动画（用于提示或警告）
export const ShakeAnimation = ({ children, trigger = false }) => {
  return (
    <motion.div
      animate={
        trigger
          ? {
              x: [0, -10, 10, -10, 10, 0],
              transition: { duration: 0.5 },
            }
          : {}
      }
    >
      {children}
    </motion.div>
  );
};

// 淡入向上动画（常用于标题）
export const FadeInUp = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
};

// 渐进式加载动画（用于图片或内容）
export const ProgressiveLoad = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
};

export default PageContainer;
