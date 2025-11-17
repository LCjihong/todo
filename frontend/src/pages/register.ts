/**
 * 注册页面逻辑
 */

import Alpine from 'alpinejs';
import { register } from '../utils/api';
import { isAuthenticated } from '../utils/auth';
import { showNotification } from '../utils/helpers';

// 初始化 Alpine.js
window.Alpine = Alpine;

// 注册页面组件
Alpine.data('registerApp', () => ({
  username: '',
  password: '',
  confirmPassword: '',
  loading: false,
  errorMessage: '',
  successMessage: '',
  errors: {
    username: '',
    password: '',
    confirmPassword: '',
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
   * 处理注册
   */
  async handleRegister() {
    // 清除之前的错误
    this.errorMessage = '';
    this.successMessage = '';
    this.errors = {
      username: '',
      password: '',
      confirmPassword: '',
    };

    // 前端验证
    if (this.username.length < 3 || this.username.length > 20) {
      this.errors.username = '用户名必须为 3-20 个字符';
      return;
    }

    if (this.password.length < 6 || this.password.length > 50) {
      this.errors.password = '密码必须为 6-50 个字符';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errors.confirmPassword = '两次输入的密码不一致';
      return;
    }

    this.loading = true;

    try {
      const response = await register(this.username, this.password);

      if (response.code === 0) {
        this.successMessage = '注册成功！即将跳转到登录页...';
        showNotification('注册成功！', 'success');

        // 跳转到登录页
        setTimeout(() => {
          window.location.href = '/login.html';
        }, 1500);
      } else {
        this.errorMessage = response.message || '注册失败';
      }
    } catch (error: any) {
      console.error('注册错误:', error);
      this.errorMessage = error.response?.data?.message || '注册失败，请稍后重试';
    } finally {
      this.loading = false;
    }
  },
}));

Alpine.start();

