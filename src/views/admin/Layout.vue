<template>
  <div class="admin-layout">
    <!-- 侧边栏 -->
    <div class="sidebar">
      <div class="logo">
        <h2>人事管理系统</h2>
      </div>
      <el-menu :default-active="activeMenu" class="sidebar-menu" :router="true" :collapse="isCollapse">
        <el-menu-item index="/admin/dashboard">
          <el-icon>
            <House />
          </el-icon>
          <span>首页</span>
        </el-menu-item>
        <el-menu-item index="/admin/DepartmentList">
          <el-icon>
            <User />
          </el-icon>
          <span>部门管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/SalaryList">
          <el-icon>
            <User />
          </el-icon>
          <span>工资管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/AttendanceManagement">
          <el-icon>
            <Calendar />
          </el-icon>
          <span>考勤管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/LeaveManagement">
          <el-icon>
            <Timer />
          </el-icon>
          <span>请假管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/EmployeeManagement">
          <el-icon>
            <Setting />
          </el-icon>
          <span>员工管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/TrainingList">
          <el-icon>
            <Setting />
          </el-icon>
          <span>培训管理</span>
        </el-menu-item>
      </el-menu>
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 顶部导航栏 -->
      <div class="header">
        <div class="header-left">
          <el-button type="text" @click="toggleSidebar">
            <el-icon>
              <Fold v-if="!isCollapse" />
              <Expand v-else />
            </el-icon>
          </el-button>
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" :src="userInfo.avatar" />
              <span class="username">{{ userInfo.realName }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getUserAvatarSvc } from '@/service/modules/user/user'
import { localCache } from '@/utils/cache/cache'
import { Account_TOKEN, Account_Type, Account_USER } from '@/utils/cache/keys'
import {
  Calendar,
  Expand,
  Fold,
  Setting,
  Timer,
  User
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isCollapse = ref(false)

const userInfo = ref({
  realName: '',
  avatar: null
});

// 获取用户信息
const user = localCache.getCache(Account_USER);
userInfo.value.realName = user.realName || '暂无名字'

// 获取用户头像
if (user?.avatar) {
  getUserAvatarSvc(user.avatar)
    .then(blob => {
      // 生成临时 URL 并响应式更新
      userInfo.value.avatar = URL.createObjectURL(blob)
    })
    .catch(error => {
      console.log(error)
      ElMessage.warning('头像加载失败')
    })
}


// 当前激活的菜单项
const activeMenu = computed(() => route.path)

// 切换侧边栏折叠状态
const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

// 处理下拉菜单命令
const handleCommand = (command: string) => {
  if (command === 'logout') {
    // 清除本地存储的用户信息
    localCache.removeCache(Account_USER)
    localCache.removeCache(Account_TOKEN)
    localCache.removeCache(Account_Type)

    ElMessage.success('退出登录成功')
    router.push('/login')
  } else if (command === 'profile') {
    // TODO: 跳转到个人信息页面
    ElMessage.info('功能开发中')
  }
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 240px;
  height: 100%;
  background-color: #001529;
  transition: width 0.3s;
  overflow-x: hidden;
}

.sidebar.collapsed {
  width: 64px;
}

.logo {
  height: 64px;
  padding: 16px;
  color: white;
  text-align: center;
  background-color: #002140;
}

.logo h2 {
  margin: 0;
  font-size: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-menu {
  border-right: none;
  background-color: #001529;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  height: 64px;
  padding: 0 24px;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.username {
  margin-left: 8px;
  font-size: 14px;
}

.content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: #f0f2f5;
}

:deep(.el-menu) {
  border-right: none;
}

:deep(.el-menu-item) {
  color: #fff;
}

:deep(.el-menu-item.is-active) {
  background-color: #1890ff;
  color: #fff;
}

:deep(.el-menu-item:hover) {
  background-color: #1890ff;
}
</style>
