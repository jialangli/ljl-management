<template>
  <div class="dashboard-container">
    <h1>管理员控制面板</h1>
    <p>欢迎使用SSM人事管理系统</p>
    
    <!-- 统计数据卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="statistic-card">
          <template #header>
            <div>
              <el-icon><User /></el-icon>
              员工总数
            </div>
          </template>
          <div class="statistic-value">{{stats.employees}}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="statistic-card">
          <template #header>
            <div>
              <el-icon><OfficeBuilding /></el-icon>
              部门数量
            </div>
          </template>
          <div class="statistic-value">{{stats.departments}}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="statistic-card">
          <template #header>
            <div>
              <el-icon><Calendar /></el-icon>
              请假申请
            </div>
          </template>
          <div class="statistic-value">{{stats.leaveRequests}}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="statistic-card">
          <template #header>
            <div>
              <el-icon><Clock /></el-icon>
              今日出勤率
            </div>
          </template>
          <div class="statistic-value">{{stats.attendanceRate}}%</div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 快捷操作区 -->
    <div class="quick-actions">
      <h2>快捷操作</h2>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-card class="action-card" @click="goToPage('/user')">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="action-card" @click="goToPage('/department')">
            <el-icon><OfficeBuilding /></el-icon>
            <span>部门管理</span>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card class="action-card" @click="goToPage('/attendance')">
            <el-icon><Timer /></el-icon>
            <span>考勤管理</span>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { User, OfficeBuilding, Calendar, Clock, Timer } from '@element-plus/icons-vue'

const router = useRouter()

// 仪表盘数据（实际项目中应该从API获取）
const stats = reactive({
  employees: 268,
  departments: 12,
  leaveRequests: 8,
  attendanceRate: 95
})

// 跳转到指定页面
const goToPage = (path: string) => {
  router.push(path)
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

h1 {
  margin-bottom: 20px;
  color: #303133;
}

.statistic-card {
  margin-bottom: 20px;
}

.statistic-card :deep(.el-card__header) {
  display: flex;
  align-items: center;
  font-weight: bold;
}

.statistic-card :deep(.el-card__header) .el-icon {
  margin-right: 8px;
}

.statistic-value {
  font-size: 28px;
  font-weight: bold;
  color: #409EFF;
  text-align: center;
  padding: 10px 0;
}

.quick-actions {
  margin-top: 20px;
}

.action-card {
  height: 120px;
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
  font-size: 32px;
  margin-bottom: 10px;
  color: #409EFF;
}

.action-card span {
  font-size: 16px;
}
</style>
