import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../store/main/user'

// 基础路由（静态路由）
const constantRoutes = [
  {
    path: '/',
    redirect: '/login',
    hidden: true
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    hidden: true
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('../../src/views/NotFound/NotFound.vue'),
    hidden: true
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    hidden: true
  }
]

// 管理员路由，根路径为 /admin
const adminRoutes = [
  {
    path: '/admin',
    component: () => import('../../src/views/admin/Layout.vue'),
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('../../src/views/admin/Dashboard.vue'),
        meta: { title: '首页', roles: ['admin'] }
      },
      {
        path: '',
        name: 'EmployeeManagement',
        component: () => import('../../src/views/admin/EmployeeManagement.vue'),
        meta: { title: '用户管理', roles: ['admin'] }
      },
      {
        path: 'department',
        name: 'Department',
        component: () => import('../../src/views/admin/DepartmentList.vue'),
        meta: { title: '部门管理', roles: ['admin'] }
      },
      {
        path: 'training',
        name: 'Training',
        component: () => import('../../src/views/admin/TrainingList.vue'),
        meta: { title: '培训管理', roles: ['admin'] }
      },
      {
        path: 'attendance',
        name: 'Attendance',
        component: () => import('../../src/views/admin/AttendanceManagement.vue'),
        meta: { title: '考勤管理', roles: ['admin'] }
      },
      {
        path: 'salary',
        name: 'Salary',
        component: () => import('../../src/views/admin/SalaryList.vue'),
        meta: { title: '薪资管理', roles: ['admin'] }
      },
      {
        path: 'leave',
        name: 'Leave',
        component: () => import('../../src/views/admin/LeaveManagement.vue'),
        meta: { title: '请假管理', roles: ['admin'] }
      },
    ],
  },
]

// 员工路由，根路径为 /employee
const employeeRoutes = [
  {
    path: '/employee',
    component: () => import('../../src/views/employee/Layout.vue'),
    children: [
      {
        path: '',
        name: 'EmployeeDashboard',
        component: () => import('../../src/views/employee/Dashboard.vue'),
        meta: { title: '首页', roles: ['employee'] }
      },
      {
        path: 'profile',
        name: 'EmployeeProfile',
        component: () => import('../../src/views/employee/UserProfile.vue'),
        meta: { title: '个人信息', roles: ['employee'] }
      },
      {
        path: 'attendance',
        name: 'EmployeeAttendance',
        component: () => import('../../src/views/employee/AttendanceList.vue'),
        meta: { title: '考勤管理', roles: ['employee'] }
      },
      {
        path: 'leave',
        name: 'EmployeeLeave',
        component: () => import('../../src/views/employee/LeaveList.vue'),
        meta: { title: '请假申请', roles: ['employee'] }
      },
      {
        path: 'salary',
        name: 'EmployeeSalary',
        component: () => import('../../src/views/employee/SalaryList.vue'),
        meta: { title: '工资管理', roles: ['employee'] }
      },
      {
        path: 'training',
        name: 'EmployeeTraining',
        component: () => import('../../src/views/employee/TrainingList.vue'),
        meta: { title: '培训管理', roles: ['employee'] }
      },
      {
        path: 'department-training',
        name: 'DepartmentTraining',
        component: () => import('../../src//views/employee/TrainingList.vue'),
        meta: { title: '部门培训', roles: ['employee'] }
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
})

// 动态添加路由函数
// 动态添加路由
export function addRoutes(role) {
  // 先移除可能存在的动态路由
  const currentRoutes = router.getRoutes()
  currentRoutes.forEach(route => {
    if (route.name && !constantRoutes.some(r => r.name === route.name)) {
      router.removeRoute(route.name)
    }
  })

  const routesToAdd = role === 'admin' ? adminRoutes : employeeRoutes
  routesToAdd.forEach(route => {
    if (!router.hasRoute(route.name)) {
      router.addRoute(route)
    }
  })
}

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // 白名单路径
  if (to.path === '/login') {
    if (userStore.isLoggedIn) {
      // 已登录重定向到首页
      const redirectPath = userStore.getUserRole === 'admin' ? '/admin' : '/employee'
      return next(redirectPath)
    }
    return next()
  }

  // 检查登录状态
  if (!userStore.isLoggedIn) {
    return next('/login')
  }

  // 确保用户信息已加载
  if (!userStore.userInfo) {
    try {
      // 使用已有的fetchUserInfo方法获取用户信息
      await userStore.fetchUserInfo()

      // 动态添加路由
      addRoutes(userStore.getUserRole)

      // 重定向到请求的路径
      return next(to.fullPath)
    } catch (error) {
      userStore.logout()
      return next('/login')
    }
  }

  // 检查权限
  if (to.meta.roles && !to.meta.roles.includes(userStore.getUserRole)) {
    return next('/404')
  }

  // 确保路由已加载
  if (!router.hasRoute(to.name)) {
    addRoutes(userStore.getUserRole)
    return next(to.fullPath)
  }

  next()
})


export default router
