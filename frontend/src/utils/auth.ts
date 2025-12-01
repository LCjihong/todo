/**
 * 认证工具函数
 * 管理 Token 存储和用户认证状态
 */

// LocalStorage 键名
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

/**
 * 保存 Access Token
 */
export const setAccessToken = (token: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

/**
 * 获取 Access Token
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * 保存 Refresh Token
 */
export const setRefreshToken = (token: string): void => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
};

/**
 * 获取 Refresh Token
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * 保存用户信息
 */
export const setUser = (user: { id: number; username: string }): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * 获取用户信息
 */
export const getUser = (): { id: number; username: string } | null => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

/**
 * 清除所有 Token 和用户信息
 */
export const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * 检查是否已登录
 */
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

/**
 * 登出
 */
export const logout = (): void => {
  clearTokens();
  window.location.href = '/login';
};

/**
 * 要求认证（未登录跳转到登录页）
 */
export const requireAuth = (): void => {
  if (!isAuthenticated()) {
    window.location.href = '/login';
  }
};

