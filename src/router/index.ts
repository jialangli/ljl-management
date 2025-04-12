// router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

// 基础路由
const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notFound',
    component: () => import('@/views/NotFound/notfound.vue'),
  },
]

// 管理员路由
const adminRoutes = [
  {
    path: '/',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: { title: '首页', roles: ['admin'] }
      },
      {
        path: 'profile',
        name: 'UserProfile',
        component: () => import('../views/user/UserProfile.vue'),
        meta: { title: '个人信息', roles: ['admin'] }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('../views/user/UserList.vue'),
        meta: { title: '用户管理', roles: ['admin'] }
      },
      {
        path: 'department',
        name: 'Department',
        component: () => import('../views/department/DepartmentList.vue'),
        meta: { title: '部门管理', roles: ['admin'] }
      },
      {
        path: 'training',
        name: 'Training',
        component: () => import('../views/training/TrainingList.vue'),
        meta: { title: '培训管理', roles: ['admin'] }
      },
      {
        path: 'attendance',
        name: 'Attendance',
        component: () => import('../views/attendance/AttendanceList.vue'),
        meta: { title: '考勤管理', roles: ['admin'] }
      },
      {
        path: 'salary',
        name: 'Salary',
        component: () => import('../views/salary/SalaryList.vue'),
        meta: { title: '薪资管理', roles: ['admin'] }
      },
      {
        path: 'leave',
        name: 'Leave',
        component: () => import('../views/leave/LeaveList.vue'),
        meta: { title: '请假管理', roles: ['admin'] }
      },
    ],
  },
]

// 员工路由
const employeeRoutes = [
  {
    path: '/',
    component: () => import('../layouts/EmployeeLayout.vue'),
    children: [
      {
        path: '',
        name: 'EmployeeDashboard',
        component: () => import('../views/employee/Dashboard.vue'),
        meta: { title: '首页', roles: ['employee'] }
      },
      {
        path: 'profile',
        name: 'EmployeeProfile',
        component: () => import('../views/user/UserProfile.vue'),
        meta: { title: '个人信息', roles: ['employee'] }
      },
      {
        path: 'attendance',
        name: 'EmployeeAttendance',
        component: () => import('../views/employee/Attendance.vue'),
        meta: { title: '考勤管理', roles: ['employee'] }
      },
      {
        path: 'leave',
        name: 'EmployeeLeave',
        component: () => import('../views/employee/Leave.vue'),
        meta: { title: '请假申请', roles: ['employee'] }
      },
      {
        path: 'overtime',
        name: 'EmployeeOvertime',
        component: () => import('../views/employee/Overtime.vue'),
        meta: { title: '加班申请', roles: ['employee'] }
      },
      {
        path: 'salary',
        name: 'EmployeeSalary',
        component: () => import('../views/employee/Salary.vue'),
        meta: { title: '工资管理', roles: ['employee'] }
      },
      {
        path: 'recruitment',
        name: 'EmployeeRecruitment',
        component: () => import('../views/employee/Recruitment.vue'),
        meta: { title: '招聘计划', roles: ['employee'] }
      },
      {
        path: 'training',
        name: 'EmployeeTraining',
        component: () => import('../views/employee/Training.vue'),
        meta: { title: '培训管理', roles: ['employee'] }
      },
      {
        path: 'department-training',
        name: 'DepartmentTraining',
        component: () => import('../views/employee/DepartmentTraining.vue'),
        meta: { title: '部门培训', roles: ['employee'] }
      },
      {
        path: 'employee-detail',
        name: 'EmployeeDetail',
        component: () => import('../views/employee/EmployeeDetail.vue'),
        meta: { title: '员工详情', roles: ['employee'] }
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
})

// 动态添加路由
export function addRoutes(role: string) {
  // 先移除所有动态路由
  const routes = router.getRoutes()
  routes.forEach(route => {
    if (route.name !== 'Login' && route.name !== 'notFound') {
      router.removeRoute(route.name as string)
    }
  })

  // 添加新的路由
  const newRoutes = role === 'admin' ? adminRoutes : employeeRoutes
  newRoutes.forEach(route => {
    router.addRoute(route)
  })

  // 确保所有路由已经加载完成
  return router.getRoutes()
}

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 如果是登录页面，直接放行
  if (to.path === '/login') {
    // 如果已登录且要跳转登录页，重定向到首页
    if (userStore.token) {
      next('/')
    } else {
      next()
    }
    return
  }

  // 检查是否有token
  if (!userStore.token) {
    next('/login')
    return
  }

  // 检查用户角色
  const userRole = userStore.userInfo?.role
  if (!userRole) {
    // 如果没有用户信息，尝试获取
    userStore.getUserInfoAction().then(() => {
      if (userStore.userInfo?.role) {
        // 添加路由
        addRoutes(userStore.userInfo.role)
        // 如果访问的是静态路由，直接放行
        if (to.matched.length) {
          next()
        } else {
          // 如果是动态路由，重新导航（会触发新的路由守卫）
          next({ ...to, replace: true })
        }
      } else {
        next('/login')
      }
    }).catch(() => {
      userStore.resetState()
      next('/login')
    })
    return
  }

  // 检查路由权限
  if (to.meta.roles) {
    const hasRole = to.meta.roles?.includes(userRole)
    if (hasRole) {
      next()
    } else {
      next('/404')
    }
  } else {
    next()
  }
})

export default router
