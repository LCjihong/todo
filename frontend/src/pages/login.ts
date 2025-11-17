/**
 * 登录页面逻辑
 */

import Alpine from 'alpinejs';
import { login } from '../utils/api';
import { setAccessToken, setRefreshToken, setUser, isAuthenticated } from '../utils/auth';
import { showNotification } from '../utils/helpers';

// 初始化 Alpine.js
window.Alpine = Alpine;

// 登录页面组件
Alpine.data('loginApp', () => ({
  username: '',
  password: '',
  loading: false,
  errorMessage: '',
  errors: {
    username: '',
    password: '',
  },

  /**
   * 初始化
   */
  init() {
    // 如果已登录，直接跳转到主页
    if (isAuthenticated()) {
      window.location.href = '/todos.html';
    }
  },

  /**
   * 处理登录
   */
  async handleLogin() {
    // 清除之前的错误
    this.errorMessage = '';
    this.errors = {
      username: '',
      password: '',
    };

    // 前端验证
    if (this.username.length < 3) {
      this.errors.username = '用户名至少 3 个字符';
      return;
    }

    if (this.password.length < 6) {
      this.errors.password = '密码至少 6 个字符';
      return;
    }

    this.loading = true;

    try {
      const response = await login(this.username, this.password);

      if (response.code === 0 && response.data) {
        // 保存 Token 和用户信息
        setAccessToken(response.data.accessToken);
        setRefreshToken(response.data.refreshToken);
        setUser(response.data.user);

        showNotification('登录成功！', 'success');

        // 跳转到主页
        setTimeout(() => {
          window.location.href = '/todos.html';
        }, 500);
      } else {
        this.errorMessage = response.message || '登录失败';
      }
    } catch (error: any) {
      console.error('登录错误:', error);
      this.errorMessage = error.response?.data?.message || '登录失败，请稍后重试';
    } finally {
      this.loading = false;
    }
  },
}));

Alpine.start();

