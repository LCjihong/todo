/**
 * API 工具函数
 * 封装所有后端 API 调用
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  ApiResponse,
  LoginResponse,
  Todo,
  Group,
  CreateTodoRequest,
  UpdateTodoRequest,
  CreateGroupRequest,
  UpdateGroupRequest,
  SortParams,
} from '../types';
import { getAccessToken, setAccessToken, getRefreshToken, clearTokens } from './auth';

// API 基础 URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// 创建 axios 实例
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加 Token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理 Token 过期
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config;

    // 如果是 401 错误且还没重试过
    if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
      (originalRequest as any)._retry = true;

      try {
        // 尝试刷新 Token
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const response = await axios.post<ApiResponse<{ accessToken: string }>>(
          `${API_BASE_URL}/auth/refresh-token`,
          { refreshToken }
        );

        if (response.data.code === 0 && response.data.data) {
          const newAccessToken = response.data.data.accessToken;
          setAccessToken(newAccessToken);

          // 重试原请求
          originalRequest.headers!.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // 刷新 Token 失败，清除所有 Token 并跳转到登录页
        clearTokens();
        window.location.href = '/login.html';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ============= 认证 API =============

/**
 * 用户注册
 */
export const register = async (username: string, password: string): Promise<ApiResponse> => {
  const response = await apiClient.post<ApiResponse>('/auth/register', {
    username,
    password,
  });
  return response.data;
};

/**
 * 用户登录
 */
export const login = async (username: string, password: string): Promise<ApiResponse<LoginResponse>> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', {
    username,
    password,
  });
  return response.data;
};

/**
 * 重置密码
 */
export const resetPassword = async (oldPassword: string, newPassword: string): Promise<ApiResponse> => {
  const response = await apiClient.post<ApiResponse>('/auth/reset-password', {
    oldPassword,
    newPassword,
  });
  return response.data;
};

// ============= Todo API =============

/**
 * 获取所有 Todos
 */
export const getTodos = async (sort?: SortParams): Promise<ApiResponse<Todo[]>> => {
  const params: Record<string, string> = {};
  if (sort?.field) params.sortField = sort.field;
  if (sort?.order) params.sortOrder = sort.order;

  const response = await apiClient.get<ApiResponse<Todo[]>>('/todos', { params });
  return response.data;
};

/**
 * 创建 Todo
 */
export const createTodo = async (data: CreateTodoRequest): Promise<ApiResponse<Todo>> => {
  const response = await apiClient.post<ApiResponse<Todo>>('/todos', data);
  return response.data;
};

/**
 * 更新 Todo
 */
export const updateTodo = async (id: number, data: UpdateTodoRequest): Promise<ApiResponse<Todo>> => {
  const response = await apiClient.put<ApiResponse<Todo>>(`/todos/${id}`, data);
  return response.data;
};

/**
 * 删除 Todo
 */
export const deleteTodo = async (id: number): Promise<ApiResponse> => {
  const response = await apiClient.delete<ApiResponse>(`/todos/${id}`);
  return response.data;
};

/**
 * 切换 Todo 完成状态
 */
export const toggleTodo = async (id: number): Promise<ApiResponse<Todo>> => {
  const response = await apiClient.patch<ApiResponse<Todo>>(`/todos/${id}/toggle`);
  return response.data;
};

// ============= Group API =============

/**
 * 获取所有分组
 */
export const getGroups = async (): Promise<ApiResponse<Group[]>> => {
  const response = await apiClient.get<ApiResponse<Group[]>>('/groups');
  return response.data;
};

/**
 * 创建分组
 */
export const createGroup = async (data: CreateGroupRequest): Promise<ApiResponse<Group>> => {
  const response = await apiClient.post<ApiResponse<Group>>('/groups', data);
  return response.data;
};

/**
 * 更新分组
 */
export const updateGroup = async (id: number, data: UpdateGroupRequest): Promise<ApiResponse<Group>> => {
  const response = await apiClient.put<ApiResponse<Group>>(`/groups/${id}`, data);
  return response.data;
};

/**
 * 删除分组
 */
export const deleteGroup = async (id: number): Promise<ApiResponse> => {
  const response = await apiClient.delete<ApiResponse>(`/groups/${id}`);
  return response.data;
};

