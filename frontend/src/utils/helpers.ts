/**
 * 通用辅助函数
 */

import type { Priority } from '../types';

/**
 * 格式化日期
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return '刚刚';
  if (diffMins < 60) return `${diffMins} 分钟前`;
  if (diffHours < 24) return `${diffHours} 小时前`;
  if (diffDays < 7) return `${diffDays} 天前`;

  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * 获取优先级文本
 */
export const getPriorityText = (priority: Priority): string => {
  const map: Record<Priority, string> = {
    LOW: '低',
    MEDIUM: '中',
    HIGH: '高',
  };
  return map[priority] || '中';
};

/**
 * 获取优先级颜色
 */
export const getPriorityColor = (priority: Priority): string => {
  const map: Record<Priority, string> = {
    LOW: 'blue',
    MEDIUM: 'yellow',
    HIGH: 'red',
  };
  return map[priority] || 'yellow';
};

/**
 * 防抖函数
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * 显示通知
 */
export const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info'): void => {
  // 简单的通知实现，可以根据需要替换为更复杂的通知库
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white z-50 ${
    type === 'success' ? 'bg-green-500' :
    type === 'error' ? 'bg-red-500' :
    'bg-blue-500'
  }`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 300ms';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
};

