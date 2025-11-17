/**
 * Todo 主页面逻辑
 */

import Alpine from 'alpinejs';
import type { Todo, Group, Priority, SortParams } from '../types';
import * as api from '../utils/api';
import { requireAuth, getUser, logout as authLogout } from '../utils/auth';
import {
  formatDate,
  getPriorityText,
  showNotification,
} from '../utils/helpers';

// 初始化 Alpine.js
window.Alpine = Alpine;

// Todo 主页面组件
Alpine.data('todosApp', () => ({
  // 用户信息
  username: '',

  // 数据
  todos: [] as Todo[],
  groups: [] as Group[],

  // 过滤和排序
  selectedGroupId: null as number | null,
  sortField: 'createdAt' as SortParams['field'],
  sortOrder: 'desc' as SortParams['order'],

  // 新建 Todo
  newTodoTitle: '',

  // 编辑 Todo
  showEditModal: false,
  editingTodo: {
    id: 0,
    title: '',
    description: '',
    priority: 'MEDIUM' as Priority,
    groupId: null as number | null,
  },

  // 新建分组
  showCreateGroupModal: false,
  newGroupName: '',
  newGroupColor: '#3b82f6',

  /**
   * 计算属性：过滤后的 Todos
   */
  get filteredTodos(): Todo[] {
    if (this.selectedGroupId === null) {
      return this.todos;
    }
    return this.todos.filter((todo) => todo.groupId === this.selectedGroupId);
  },

  /**
   * 计算属性：已完成数量
   */
  get completedCount(): number {
    return this.filteredTodos.filter((todo) => todo.completed).length;
  },

  /**
   * 初始化
   */
  async init() {
    // 要求认证
    requireAuth();

    // 获取用户信息
    const user = getUser();
    if (user) {
      this.username = user.username;
    }

    // 加载数据
    await this.loadTodos();
    await this.loadGroups();
  },

  /**
   * 加载 Todos
   */
  async loadTodos() {
    try {
      const response = await api.getTodos({
        field: this.sortField,
        order: this.sortOrder,
      });

      if (response.code === 0 && response.data) {
        this.todos = response.data;
      }
    } catch (error) {
      console.error('加载 Todos 失败:', error);
      showNotification('加载任务失败', 'error');
    }
  },

  /**
   * 加载分组
   */
  async loadGroups() {
    try {
      const response = await api.getGroups();

      if (response.code === 0 && response.data) {
        this.groups = response.data;
      }
    } catch (error) {
      console.error('加载分组失败:', error);
      showNotification('加载分组失败', 'error');
    }
  },

  /**
   * 创建 Todo
   */
  async handleCreateTodo() {
    if (!this.newTodoTitle.trim()) {
      return;
    }

    try {
      const response = await api.createTodo({
        title: this.newTodoTitle.trim(),
        groupId: this.selectedGroupId || undefined,
      });

      if (response.code === 0) {
        showNotification('任务创建成功', 'success');
        this.newTodoTitle = '';
        await this.loadTodos();
        await this.loadGroups(); // 更新分组计数
      }
    } catch (error) {
      console.error('创建 Todo 失败:', error);
      showNotification('创建任务失败', 'error');
    }
  },

  /**
   * 切换 Todo 完成状态
   */
  async handleToggleTodo(id: number) {
    try {
      const response = await api.toggleTodo(id);

      if (response.code === 0) {
        await this.loadTodos();
      }
    } catch (error) {
      console.error('切换状态失败:', error);
      showNotification('操作失败', 'error');
    }
  },

  /**
   * 打开编辑模态框
   */
  openEditModal(todo: Todo) {
    this.editingTodo = {
      id: todo.id,
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority,
      groupId: todo.groupId || null,
    };
    this.showEditModal = true;
  },

  /**
   * 更新 Todo
   */
  async handleUpdateTodo() {
    try {
      const response = await api.updateTodo(this.editingTodo.id, {
        title: this.editingTodo.title,
        description: this.editingTodo.description || undefined,
        priority: this.editingTodo.priority,
        groupId: Number(this.editingTodo.groupId),
      });

      if (response.code === 0) {
        showNotification('任务更新成功', 'success');
        this.showEditModal = false;
        await this.loadTodos();
        await this.loadGroups(); // 更新分组计数
      }
    } catch (error) {
      console.error('更新 Todo 失败:', error);
      showNotification('更新任务失败', 'error');
    }
  },

  /**
   * 删除 Todo（带确认）
   */
  async deleteTodoConfirm(id: number, title: string) {
    if (!confirm(`确定要删除任务 "${title}" 吗？`)) {
      return;
    }

    try {
      const response = await api.deleteTodo(id);

      if (response.code === 0) {
        showNotification('任务删除成功', 'success');
        await this.loadTodos();
        await this.loadGroups(); // 更新分组计数
      }
    } catch (error) {
      console.error('删除 Todo 失败:', error);
      showNotification('删除任务失败', 'error');
    }
  },

  /**
   * 创建分组
   */
  async handleCreateGroup() {
    if (!this.newGroupName.trim()) {
      return;
    }

    try {
      const response = await api.createGroup({
        name: this.newGroupName.trim(),
        color: this.newGroupColor,
      });

      if (response.code === 0) {
        showNotification('分组创建成功', 'success');
        this.showCreateGroupModal = false;
        this.newGroupName = '';
        this.newGroupColor = '#3b82f6';
        await this.loadGroups();
      }
    } catch (error) {
      console.error('创建分组失败:', error);
      showNotification('创建分组失败', 'error');
    }
  },

  /**
   * 删除分组（带确认）
   */
  async deleteGroupConfirm(id: number, name: string) {
    if (!confirm(`确定要删除分组 "${name}" 吗？分组中的任务不会被删除。`)) {
      return;
    }

    try {
      const response = await api.deleteGroup(id);

      if (response.code === 0) {
        showNotification('分组删除成功', 'success');
        if (this.selectedGroupId === id) {
          this.selectedGroupId = null;
        }
        await this.loadGroups();
        await this.loadTodos(); // 刷新任务列表
      }
    } catch (error) {
      console.error('删除分组失败:', error);
      showNotification('删除分组失败', 'error');
    }
  },

  /**
   * 登出
   */
  handleLogout() {
    if (confirm('确定要退出登录吗？')) {
      authLogout();
    }
  },

  /**
   * 格式化日期
   */
  formatDate,

  /**
   * 获取优先级文本
   */
  getPriorityText,
}));

Alpine.start();
