<template>
  <div class="employee-dashboard">
    <!-- 欢迎卡片 -->
    <el-card class="welcome-card">
      <div class="welcome-content">
        <div class="welcome-info">
          <h2>欢迎回来，{{ userInfo.realName }}</h2>
          <p class="time">{{ currentTime }}</p>
          <p class="department">{{ userInfo.department }} | {{ userInfo.position }}</p>
        </div>
        <div class="welcome-image">
          <img src="@/assets/welcome.png" alt="Welcome" />
        </div>
      </div>
    </el-card>

    <!-- 数据概览卡片 -->
    <el-row :gutter="20" class="data-overview">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>本月出勤</span>
              <el-icon><Calendar /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <span class="number">{{ statistics.attendance }}</span>
            <span class="unit">天</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>剩余年假</span>
              <el-icon><Timer /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <span class="number">{{ statistics.annualLeave }}</span>
            <span class="unit">天</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>本月加班</span>
              <el-icon><Clock /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <span class="number">{{ statistics.overtime }}</span>
            <span class="unit">小时</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>待审批</span>
              <el-icon><Document /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <span class="number">{{ statistics.pending }}</span>
            <span class="unit">条</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 考勤打卡 -->
    <el-card class="attendance-card">
      <template #header>
        <div class="card-header">
          <span>考勤打卡</span>
          <el-button type="primary" @click="handleCheckIn" :disabled="isCheckedIn">
            {{ isCheckedIn ? '已打卡' : '打卡' }}
          </el-button>
        </div>
      </template>
      <div class="attendance-content">
        <div class="time-display">
          <div class="current-time">{{ currentTime }}</div>
          <div class="date">{{ currentDate }}</div>
        </div>
        <div class="attendance-status">
          <el-tag :type="getStatusType(attendanceStatus)">
            {{ getStatusText(attendanceStatus) }}
          </el-tag>
        </div>
      </div>
    </el-card>

    <!-- 待办事项和通知 -->
    <el-row :gutter="20" class="todo-notice">
      <el-col :span="12">
        <el-card class="todo-card">
          <template #header>
            <div class="card-header">
              <span>待办事项</span>
              <el-button type="text" @click="handleMoreTodo">
                查看更多<el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </div>
          </template>
          <el-table :data="todoList" style="width: 100%">
            <el-table-column prop="title" label="事项" />
            <el-table-column prop="deadline" label="截止时间" width="180" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getTodoStatusType(row.status)">
                  {{ getTodoStatusText(row.status) }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="notice-card">
          <template #header>
            <div class="card-header">
              <span>通知公告</span>
              <el-button type="text" @click="handleMoreNotice">
                查看更多<el-icon class="el-icon--right"><ArrowRight /></el-icon>
              </el-button>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="notice in noticeList"
              :key="notice.id"
              :timestamp="notice.time"
              :type="notice.type"
            >
              {{ notice.content }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Calendar,
  Timer,
  Clock,
  Document,
  ArrowRight
} from '@element-plus/icons-vue'

const router = useRouter()

// 用户信息
const userInfo = ref({
  realName: '张三',
  department: '技术部',
  position: '高级工程师'
})

// 统计数据
const statistics = ref({
  attendance: 18,
  annualLeave: 3,
  overtime: 12,
  pending: 2
})

// 当前时间
const currentTime = ref('')
const currentDate = ref('')
let timer: number

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  currentDate.value = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

// 考勤状态
const isCheckedIn = ref(false)
const attendanceStatus = ref('normal')

const getStatusType = (status: string) => {
  const types = {
    normal: '',
    late: 'warning',
    early: 'danger',
    absent: 'info'
  }
  return types[status] || 'info'
}

const getStatusText = (status: string) => {
  const texts = {
    normal: '正常',
    late: '迟到',
    early: '早退',
    absent: '缺勤'
  }
  return texts[status] || '未知'
}

// 打卡处理
const handleCheckIn = () => {
  // TODO: 调用打卡接口
  isCheckedIn.value = true
  ElMessage.success('打卡成功')
}

// 待办事项
const todoList = ref([
  {
    id: 1,
    title: '完成项目周报',
    deadline: '2024-03-20 18:00',
    status: 'pending'
  },
  {
    id: 2,
    title: '参加部门会议',
    deadline: '2024-03-21 14:00',
    status: 'completed'
  }
])

const getTodoStatusType = (status: string) => {
  const types = {
    pending: 'warning',
    completed: 'success',
    overdue: 'danger'
  }
  return types[status] || 'info'
}

const getTodoStatusText = (status: string) => {
  const texts = {
    pending: '待处理',
    completed: '已完成',
    overdue: '已逾期'
  }
  return texts[status] || '未知'
}

const handleMoreTodo = () => {
  router.push('/employee/todo')
}

// 通知公告
const noticeList = ref([
  {
    id: 1,
    content: '关于五一劳动节放假安排的通知',
    time: '2024-03-19 10:00',
    type: 'primary'
  },
  {
    id: 2,
    content: '公司年度体检安排',
    time: '2024-03-18 14:30',
    type: 'success'
  }
])

const handleMoreNotice = () => {
  router.push('/employee/notice')
}
</script>

<style scoped>
.employee-dashboard {
  padding: 20px;
}

.welcome-card {
  margin-bottom: 20px;
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-info h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.welcome-info .time {
  margin: 10px 0;
  font-size: 16px;
  color: #606266;
}

.welcome-info .department {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

.welcome-image img {
  width: 120px;
  height: 120px;
}

.data-overview {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  text-align: center;
  padding: 10px 0;
}

.number {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}

.unit {
  font-size: 14px;
  color: #909399;
  margin-left: 4px;
}

.attendance-card {
  margin-bottom: 20px;
}

.attendance-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}

.time-display {
  text-align: center;
}

.current-time {
  font-size: 36px;
  font-weight: bold;
  color: #303133;
}

.date {
  font-size: 14px;
  color: #909399;
  margin-top: 8px;
}

.todo-notice {
  margin-bottom: 20px;
}

:deep(.el-timeline-item__content) {
  color: #606266;
}

:deep(.el-button--text) {
  padding: 0;
}
</style>
