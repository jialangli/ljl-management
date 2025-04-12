<template>
  <div class="main-layout">
    <el-container>
      <el-aside width="200px">
        <div class="system-title">SSM人事管理系统</div>
        <el-menu :default-active="activeMenu" class="el-menu-vertical" router>
          <el-menu-item index="/">
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/profile">
            <el-icon><User /></el-icon>
            <span>个人信息</span>
          </el-menu-item>
          <el-menu-item index="/user">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/department">
            <el-icon><OfficeBuilding /></el-icon>
            <span>部门管理</span>
          </el-menu-item>
          <el-menu-item index="/training">
            <el-icon><Reading /></el-icon>
            <span>培训管理</span>
          </el-menu-item>
          <el-menu-item index="/attendance">
            <el-icon><Timer /></el-icon>
            <span>考勤管理</span>
          </el-menu-item>
          <el-menu-item index="/salary">
            <el-icon><Money /></el-icon>
            <span>薪资管理</span>
          </el-menu-item>
          <el-menu-item index="/leave">
            <el-icon><Calendar /></el-icon>
            <span>请假管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header>
          <div class="header-right">
            <el-dropdown>
              <span class="user-info">
                {{ userInfo?.username }}
                <el-icon><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="goToProfile">个人信息</el-dropdown-item>
                  <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import {
  HomeFilled,
  User,
  OfficeBuilding,
  Reading,
  Timer,
  Money,
  Calendar,
  ArrowDown,
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const activeMenu = computed(() => route.path)

// 获取用户信息
const userInfo = computed(() => userStore.userInfo)

// 处理登出
const handleLogout = () => {
  userStore.logoutAction()
}

// 跳转到个人信息页面
const goToProfile = () => {
  router.push('/profile')
}
</script>

<style scoped>
.main-layout {
  height: 100vh;
}

.el-aside {
  background-color: #304156;
  height: 100vh;
}

.system-title {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  padding: 20px 0;
  border-bottom: 1px solid #1f2d3d;
}

.el-menu {
  border-right: none;
  background-color: #304156;
}

.el-menu-item {
  color: #bfcbd9;
}

.el-menu-item.is-active {
  color: #409eff;
  background-color: #263445;
}

.el-menu-item:hover {
  background-color: #263445;
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
  height: 60px;
}

.header-right {
  margin-right: 20px;
}

.user-info {
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #606266;
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>
