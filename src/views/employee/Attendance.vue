<template>
  <div class="attendance">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>考勤管理</span>
          <div class="header-right">
            <el-button type="primary" @click="handleClockIn" v-if="!todayAttendance.clockIn">
              上班打卡
            </el-button>
            <el-button type="success" @click="handleClockOut" v-if="todayAttendance.clockIn && !todayAttendance.clockOut">
              下班打卡
            </el-button>
          </div>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>今日考勤</span>
              </div>
            </template>
            <div class="attendance-info">
              <p>上班时间：{{ todayAttendance.clockIn || '未打卡' }}</p>
              <p>下班时间：{{ todayAttendance.clockOut || '未打卡' }}</p>
              <p>状态：{{ getAttendanceStatus() }}</p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>考勤记录</span>
                <el-date-picker
                  v-model="selectedMonth"
                  type="month"
                  placeholder="选择月份"
                  @change="handleMonthChange"
                />
              </div>
            </template>
            <el-table :data="attendanceRecords" style="width: 100%">
              <el-table-column prop="date" label="日期" />
              <el-table-column prop="clockIn" label="上班时间" />
              <el-table-column prop="clockOut" label="下班时间" />
              <el-table-column prop="status" label="状态" />
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 模拟数据
const todayAttendance = reactive({
  clockIn: '',
  clockOut: ''
})

const selectedMonth = ref(new Date())
const attendanceRecords = ref([
  {
    date: '2024-04-01',
    clockIn: '09:00',
    clockOut: '18:00',
    status: '正常'
  },
  {
    date: '2024-04-02',
    clockIn: '09:05',
    clockOut: '18:10',
    status: '正常'
  }
])

const handleClockIn = () => {
  const now = new Date()
  const time = `${now.getHours().toString().padStart(2, '0')}:${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}`
  todayAttendance.clockIn = time
  ElMessage.success('上班打卡成功')
}

const handleClockOut = () => {
  const now = new Date()
  const time = `${now.getHours().toString().padStart(2, '0')}:${now
    .getMinutes()
    .toString()
    .padStart(2, '0')}`
  todayAttendance.clockOut = time
  ElMessage.success('下班打卡成功')
}

const handleMonthChange = (val: Date) => {
  // 根据选择的月份获取考勤记录
  console.log('选择月份：', val)
}

const getAttendanceStatus = () => {
  if (!todayAttendance.clockIn && !todayAttendance.clockOut) {
    return '未打卡'
  }
  if (todayAttendance.clockIn && !todayAttendance.clockOut) {
    return '已上班'
  }
  if (todayAttendance.clockIn && todayAttendance.clockOut) {
    return '已下班'
  }
  return '异常'
}
</script>

<style scoped>
.attendance {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-right {
  display: flex;
  gap: 10px;
}

.attendance-info {
  font-size: 14px;
  color: #606266;
}

.attendance-info p {
  margin: 10px 0;
}
</style>
