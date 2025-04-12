<template>
  <div class="dashboard-container">
    <h1>员工工作台</h1>
    <p>欢迎使用SSM人事管理系统</p>
    
    <!-- 基本信息卡片 -->
    <el-card class="info-card">
      <div class="user-info">
        <div class="avatar">
          <el-avatar :size="80" :src="userAvatar">{{ userInitials }}</el-avatar>
        </div>
        <div class="user-details">
          <h2>{{ userInfo?.realName || userInfo?.username }}</h2>
          <p>{{ userInfo?.department || '未分配部门' }} | {{ userInfo?.position || '未分配职位' }}</p>
          <p>工号: {{ userInfo?.id }}</p>
        </div>
        <div class="check-in">
          <el-button 
            type="primary" 
            :disabled="checkedIn"
            @click="handleCheckIn"
          >
            {{ checkedIn ? '已签到' : '今日签到' }}
          </el-button>
        </div>
      </div>
    </el-card>
    
    <!-- 统计数据卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="8">
        <el-card class="stat-card">
          <template #header>
            <div>
              <el-icon><Calendar /></el-icon>
              本月考勤
            </div>
          </template>
          <div class="stat-content">
            <div class="stat-number">{{ stats.attendance }}</div>
            <div class="stat-label">出勤天数</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="stat-card">
          <template #header>
            <div>
              <el-icon><Clock /></el-icon>
              剩余年假
            </div>
          </template>
          <div class="stat-content">
            <div class="stat-number">{{ stats.remainingLeave }}</div>
            <div class="stat-label">天</div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="8">
        <el-card class="stat-card">
          <template #header>
            <div>
              <el-icon><Money /></el-icon>
              本月加班
            </div>
          </template>
          <div class="stat-content">
            <div class="stat-number">{{ stats.overtimeHours }}</div>
            <div class="stat-label">小时</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 快捷操作区 -->
    <div class="quick-actions">
      <h2>快捷操作</h2>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="action-card" @click="goToPage('/leave')">
            <el-icon><Tickets /></el-icon>
            <span>请假申请</span>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="action-card" @click="goToPage('/overtime')">
            <el-icon><Timer /></el-icon>
            <span>加班申请</span>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="action-card" @click="goToPage('/attendance')">
            <el-icon><Document /></el-icon>
            <span>考勤记录</span>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="action-card" @click="goToPage('/salary')">
            <el-icon><Money /></el-icon>
            <span>工资查询</span>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 通知公告 -->
    <div class="announcements">
      <h2>通知公告</h2>
      <el-card>
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in activities"
            :key="index"
            :timestamp="activity.timestamp"
            :type="activity.type"
          >
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { 
  Calendar, 
  Clock, 
  Money, 
  Tickets, 
  Timer, 
  Document 
} from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 用户信息
const userInfo = computed(() => userStore.userInfo)
const userAvatar = computed(() => userInfo.value?.avatar || '')
const userInitials = computed(() => {
  const name = userInfo.value?.realName || userInfo.value?.username || ''
  return name.substring(0, 2).toUpperCase()
})

// 状态数据
const checkedIn = ref(false)
const stats = reactive({
  attendance: 18,
  remainingLeave: 12,
  overtimeHours: 6
})

// 通知数据
const activities = [
  {
    content: '公司年度体检将于下周一开始，请各部门按照安排准时参加',
    timestamp: '2023-10-15',
    type: 'primary'
  },
  {
    content: '本月团建活动将在本周五下午3点举行，请准时参加',
    timestamp: '2023-10-10',
    type: 'success'
  },
  {
    content: '人力资源部发布新版员工手册，请所有员工查阅',
    timestamp: '2023-10-05',
    type: 'info'
  },
  {
    content: '系统将于本周六凌晨2点-4点进行维护升级，请提前安排工作',
    timestamp: '2023-10-01',
    type: 'warning'
  }
]

// 处理签到
const handleCheckIn = () => {
  checkedIn.value = true
  ElMessage.success('签到成功!')
}

// 跳转到指定页面
const goToPage = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

h1, h2 {
  margin-bottom: 20px;
  color: #303133;
}

.info-card {
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  margin-right: 20px;
}

.user-details {
  flex: 1;
}

.user-details h2 {
  margin: 0 0 10px 0;
  font-size: 20px;
}

.user-details p {
  margin: 5px 0;
  color: #606266;
}

.check-in {
  margin-left: auto;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card :deep(.el-card__header) {
  display: flex;
  align-items: center;
  font-weight: bold;
}

.stat-card :deep(.el-card__header) .el-icon {
  margin-right: 8px;
}

.stat-content {
  text-align: center;
  padding: 10px 0;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #409EFF;
}

.stat-label {
  margin-top: 5px;
  color: #909399;
}

.quick-actions, .announcements {
  margin-top: 30px;
}

.action-card {
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.action-card .el-icon {
  font-size: 28px;
  margin-bottom: 10px;
  color: #409EFF;
}

.action-card span {
  font-size: 14px;
}
</style>
