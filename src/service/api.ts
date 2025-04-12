import axios from 'axios'
import {
  User,
  Department,
  Training,
  Attendance,
  Salary,
  LeaveRequest,
} from '../types'
import request from '@/utils/request'

const api = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

// 用户相关接口
export const userApi = {
  login(username: string, password: string) {
    return request({
      url: '/api/user/login',
      method: 'post',
      data: { username, password }
    })
  },

  getUserInfo() {
    return request({
      url: '/api/user/info',
      method: 'get'
    })
  },

  logout() {
    return request({
      url: '/api/user/logout',
      method: 'post'
    })
  },

  register: (user: Omit<User, 'id' | 'createTime' | 'updateTime'>) =>
    api.post('/user/register', user),
  getUserList: () => api.get<User[]>('/user/list'),
  updateUser: (id: number, user: Partial<User>) => api.put(`/user/${id}`, user),
  deleteUser: (id: number) => api.delete(`/user/${id}`),
}

// 部门相关接口
export const departmentApi = {
  getList: () => api.get<Department[]>('/department/list'),
  create: (department: Omit<Department, 'id'>) =>
    api.post('/department', department),
  update: (id: number, department: Partial<Department>) =>
    api.put(`/department/${id}`, department),
  delete: (id: number) => api.delete(`/department/${id}`),
}

// 培训相关接口
export const trainingApi = {
  getList: () => api.get<Training[]>('/training/list'),
  create: (training: Omit<Training, 'id'>) => api.post('/training', training),
  update: (id: number, training: Partial<Training>) =>
    api.put(`/training/${id}`, training),
  delete: (id: number) => api.delete(`/training/${id}`),
}

// 考勤相关接口
export const attendanceApi = {
  getList: (userId?: number) =>
    api.get<Attendance[]>('/attendance/list', { params: { userId } }),
  clockIn: (data: { userId: number; type: '上班' | '下班' }) =>
    api.post('/attendance/clock-in', data),
}

// 薪资相关接口
export const salaryApi = {
  getList: (userId?: number) =>
    api.get<Salary[]>('/salary/list', { params: { userId } }),
  create: (salary: Omit<Salary, 'id'>) => api.post('/salary', salary),
  update: (id: number, salary: Partial<Salary>) =>
    api.put(`/salary/${id}`, salary),
}

// 请假相关接口
export const leaveApi = {
  getList: (userId?: number) =>
    api.get<LeaveRequest[]>('/leave/list', { params: { userId } }),
  create: (leave: Omit<LeaveRequest, 'id'>) => api.post('/leave', leave),
  update: (id: number, leave: Partial<LeaveRequest>) =>
    api.put(`/leave/${id}`, leave),
}

export default api
