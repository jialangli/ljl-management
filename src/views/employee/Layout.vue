<template>
  <div class="employee-layout">
    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ collapsed: isCollapsed }">
      <div class="logo">
        <!-- <img src="@/assets/logo.png" alt="Logo" /> -->
        <span v-show="!isCollapsed">SSM人事管理系统</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="menu"
        :collapse="isCollapsed"
        router
      >
        <el-menu-item index="/employee/dashboard">
          <el-icon><DataLine /></el-icon>
          <template #title>首页</template>
        </el-menu-item>
        <el-menu-item index="/employee/UserProfile">
          <el-icon><User /></el-icon>
          <template #title>个人信息</template>
        </el-menu-item>
        <el-menu-item index="/employee/AttendanceList">
          <el-icon><Calendar /></el-icon>
          <template #title>考勤打卡</template>
        </el-menu-item>
        <el-menu-item index="/employee/LeaveList">
          <el-icon><Timer /></el-icon>
          <template #title>请假申请</template>
        </el-menu-item>
        <el-menu-item index="/employee/OvertimeList">
          <el-icon><Clock /></el-icon>
          <template #title>加班申请</template>
        </el-menu-item>
        <el-menu-item index="/employee/SalaryList">
          <el-icon><Money /></el-icon>
          <template #title>薪资查询</template>
        </el-menu-item>
        <el-menu-item index="/employee/TrainingList">
          <el-icon><Reading /></el-icon>
          <template #title>培训记录</template>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 顶部导航栏 -->
      <div class="navbar">
        <div class="left">
          <el-button
            type="text"
            :icon="isCollapsed ? 'Expand' : 'Fold'"
            @click="toggleSidebar"
          />
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/employee/dashboard' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentRoute }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="right">
          <el-dropdown trigger="click">
            <div class="user-info">
              <el-avatar :size="32" :src="userInfo.avatar" />
              <span class="username">{{ userInfo.realName }}</span>
              <el-icon><CaretBottom /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleProfile">
                  <el-icon><User /></el-icon>个人信息
                </el-dropdown-item>
                <el-dropdown-item @click="handlePassword">
                  <el-icon><Lock /></el-icon>修改密码
                </el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 内容区 -->
      <div class="content">
        <router-view />
      </div>
    </div>

    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="passwordDialogVisible"
      title="修改密码"
      width="400px"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="passwordDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handlePasswordSubmit">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  DataLine,
  User,
  Calendar,
  Timer,
  Clock,
  Money,
  Reading,
  Expand,
  Fold,
  CaretBottom,
  Lock,
  SwitchButton
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 侧边栏折叠状态
const isCollapsed = ref(false)
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

// 当前激活的菜单
const activeMenu = computed(() => route.path)

// 当前路由名称
const currentRoute = computed(() => {
  const routeMap: Record<string, string> = {
    '/employee/dashboard': '首页',
    '/employee/UserProfile': '个人信息',
    '/employee/AttendanceList': '考勤打卡',
    '/employee/LeaveList': '请假申请',
    '/employee/OvertimeList': '加班申请',
    '/employee/SalaryList': '薪资查询',
    '/employee/TrainingList': '培训记录'
  }
  return routeMap[route.path] || '首页'
})

// 用户信息
const userInfo = ref({
  realName: '张三',
  avatar: ''
})

// 修改密码对话框
const passwordDialogVisible = ref(false)
const passwordFormRef = ref()
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value !== passwordForm.value.newPassword) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ]
}

// 处理个人信息
const handleProfile = () => {
  router.push('/employee/UserProfile')
}

// 处理修改密码
const handlePassword = () => {
  passwordDialogVisible.value = true
  passwordForm.value = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  }
}

// 提交修改密码
const handlePasswordSubmit = async () => {
  if (!passwordFormRef.value) return

  await passwordFormRef.value.validate((valid: boolean) => {
    if (valid) {
      // TODO: 调用修改密码接口
      ElMessage.success('密码修改成功')
      passwordDialogVisible.value = false
    }
  })
}

// 处理退出登录
const handleLogout = () => {
  ElMessageBox.confirm(
    '确定要退出登录吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用退出登录接口
    router.push('/login')
  })
}
</script>

<style scoped>
.employee-layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 240px;
  height: 100%;
  background-color: #304156;
  transition: width 0.3s;
  overflow-x: hidden;
}

.sidebar.collapsed {
  width: 64px;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  overflow: hidden;
}

.logo img {
  width: 32px;
  height: 32px;
  margin-right: 12px;
}

.menu {
  border-right: none;
  background-color: transparent;
}

:deep(.el-menu) {
  border-right: none;
}

:deep(.el-menu-item) {
  color: #bfcbd9;
}

:deep(.el-menu-item.is-active) {
  color: #409EFF;
  background-color: #263445;
}

:deep(.el-menu-item:hover) {
  background-color: #263445;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.navbar {
  height: 60px;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.navbar .left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.username {
  font-size: 14px;
  color: #606266;
}

.content {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f0f2f5;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
