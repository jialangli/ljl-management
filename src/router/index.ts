import { createRouter, createWebHistory } from 'vue-router'
// import { useUserStore } from '../store/main/user'

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
    name: 'AdminLayout',
    component: () => import('../../src/views/admin/Layout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../../src/views/admin/Dashboard.vue'),
        meta: { title: '首页', roles: ['admin'] }
      },
      {
        path: 'EmployeeManagement',
        name: 'EmployeeManagement',
        component: () => import('../../src/views/admin/EmployeeManagement.vue'),
        meta: { title: '员工管理', roles: ['admin'] }
      },
      {
        path: 'DepartmentList',
        name: 'DepartmentList',
        component: () => import('../../src/views/admin/DepartmentList.vue'),
        meta: { title: '部门管理', roles: ['admin'] }
      },
      {
        path: 'TrainingList',
        name: 'TrainingList',
        component: () => import('../../src/views/admin/TrainingList.vue'),
        meta: { title: '培训管理', roles: ['admin'] }
      },
      {
        path: 'AttendanceManagement',
        name: 'AttendanceManagement',
        component: () => import('../../src/views/admin/AttendanceManagement.vue'),
        meta: { title: '考勤管理', roles: ['admin'] }
      },
      {
        path: 'SalaryList',
        name: 'SalaryList',
        component: () => import('../../src/views/admin/SalaryList.vue'),
        meta: { title: '薪资管理', roles: ['admin'] }
      },
      {
        path: 'LeaveManagement',
        name: 'LeaveManagement',
        component: () => import('../../src/views/admin/LeaveManagement.vue'),
        meta: { title: '请假管理', roles: ['admin'] }
      },
      {
        path: 'SystemSettings',
        name: 'SystemSettings',
        component: () => import('../../src/views/admin/SystemSettings.vue'),
        meta: { title: '系统设置', roles: ['admin'] }
      },
    ],
  },
]

// 员工路由，根路径为 /employee
const employeeRoutes = [
  {
    path: '/employee',
    name: 'EmployeeLayout',
    component: () => import('../../src/views/employee/Layout.vue'),
    children: [
      {
        path: 'dashboard',
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
// router.js
export function addRoutes(role) {
  // 先移除旧动态路由
  const currentRoutes = router.getRoutes();
  currentRoutes.forEach(route => {
    if (route.path.startsWith('/admin') || route.path.startsWith('/employee')) {
      router.removeRoute(route.name); // 按 name 移除
    }
  });

  // 添加新路由
  const routesToAdd = role === 'admin' ? adminRoutes : employeeRoutes;
  routesToAdd.forEach(route => {
    router.addRoute(route); // 添加一级路由
  });
}
router.beforeEach((to, from, next) => {
  console.log(`尝试跳转到: ${to.path}`, to);
  next(); // 确保调用 next()，否则会卡住
});

export default router
