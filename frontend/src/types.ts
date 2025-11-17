/**
 * TypeScript 类型定义
 * 前端应用使用的所有类型接口
 */

// API 响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
}

// 用户类型
export interface User {
  id: number;
  username: string;
  createdAt: string;
}

// 登录响应
export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Todo 优先级
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

// Todo 类型
export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  groupId?: number;
  group?: Group;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

// 分组类型
export interface Group {
  id: number;
  name: string;
  color?: string;
  userId: number;
  _count?: {
    todos: number;
  };
}

// 创建 Todo 请求
export interface CreateTodoRequest {
  title: string;
  description?: string;
  priority?: Priority;
  groupId?: number;
}

// 更新 Todo 请求
export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: Priority;
  groupId?: number | null;
}

// 创建分组请求
export interface CreateGroupRequest {
  name: string;
  color?: string;
}

// 更新分组请求
export interface UpdateGroupRequest {
  name?: string;
  color?: string;
}

// 排序参数
export interface SortParams {
  field?: 'createdAt' | 'updatedAt' | 'completed' | 'priority';
  order?: 'asc' | 'desc';
}

