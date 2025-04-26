<template>
  <div class="attendance-management">
    <el-card class="card">
      <div class="card-header">
        <span class="card-title">员工考勤管理</span>
      </div>

      <!-- 打卡区域 -->
      <div class="punch-card">
        <el-button type="primary" size="large" :disabled="hasClockIn" @click="clockIn" class="punch-button">
          <el-icon class="button-icon">
            <Clock />
          </el-icon>
          上班打卡
        </el-button>
        <el-button type="success" size="large" :disabled="!hasClockIn || hasClockOut" @click="clockOut"
          class="punch-button">
          <el-icon class="button-icon">
            <Timer />
          </el-icon>
          下班打卡
        </el-button>
        <div class="status">
          <p class="status-title">今日状态：</p>
          <p v-if="hasClockIn" class="status-item">
            <el-icon class="status-icon">
              <CircleCheck />
            </el-icon>
            已打上班卡：{{ formatUTC(clockInTime) }}
          </p>
          <p v-if="hasClockOut" class="status-item">
            <el-icon class="status-icon">
              <CircleCheck />
            </el-icon>
            已打下班卡：{{ formatUTC(clockOutTime) }}
          </p>
          <p v-if="!hasClockIn" class="status-item">
            <el-icon class="status-icon">
              <Warning />
            </el-icon>
            未打上班卡
          </p>
        </div>
      </div>
      <!-- 历史考勤记录 -->
      <div class="history-section">
        <div class="filter-container">
          <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="YYYY-MM-DD" @change="handleDateChange" />
        </div>

        <el-table :data="attendanceList" v-loading="loading" border stripe style="width: 100%">
          <el-table-column prop="createTime" label="打卡时间" width="180">
            <template #default="{ row }">
              {{ formatUTC(row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="type" label="类型" width="120" />
          <el-table-column prop="status" label="状态" width="120">
            <template #default="{ row }">
              <el-tag :type="statusTagType(row.status)">
                {{ row.status }}
              </el-tag>
            </template>
          </el-table-column>
        </el-table>

        <div class="pagination-container">
          <el-pagination v-model:current-page="pagination.pageNum" v-model:page-size="pagination.pageSize"
            :total="pagination.total" :page-sizes="[10, 20, 50]" layout="total, sizes, prev, pager, next, jumper"
            @size-change="loadAttendanceData" @current-change="loadAttendanceData" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { formatUTC } from '@/utils/format'
import { CircleCheck, Clock, Timer, Warning } from '@element-plus/icons-vue'

import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import {
  clockInSvc,
  getPersonalAttendanceSvc
} from '../../service/modules/attendance/attendance'
import type { IAttendanceResp } from '../../service/modules/attendance/types'
import { useUserStore } from '../../store/main/user'
// 打卡状态
const userStore = useUserStore()
const userId = userStore.userId

// 打卡状态
const hasClockIn = ref(false)
const hasClockOut = ref(false)
const clockInTime = ref('')
const clockOutTime = ref('')


// 历史记录相关
const attendanceList = ref<IAttendanceResp[]>([])
const loading = ref(false)
const dateRange = ref<string[]>([])
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

// 获取当天考勤状态
async function loadTodayStatus() {
  try {
    const today = dayjs().format('YYYY-MM-DD')
    const res = await getPersonalAttendanceSvc({
      userId,
      startDate: today,
    })

    if (res.code === 200) {
      const records = res.data || []
      console.log(records)
      hasClockIn.value = records.some(r => r.type === '上班')
      hasClockOut.value = records.some(r => r.type === '下班')

      const clockInRecord = records.find(r => r.type === '上班')
      const clockOutRecord = records.find(r => r.type === '下班')
      clockInTime.value = clockInRecord?.createTime || ''
      clockOutTime.value = clockOutRecord?.createTime || ''
    }
  } catch (error) {
    ElMessage.error('获取当天状态失败')
  }
}


// 加载历史记录
async function loadAttendanceData() {
  loading.value = true
  try {
    const params = {
      userId,
      pageNum: pagination.value.pageNum,
      pageSize: pagination.value.pageSize,
      startDate: dateRange.value?.[0],
      endDate: dateRange.value?.[1]
    }

    const res = await getPersonalAttendanceSvc(params)
    if (res.code === 200) {
      attendanceList.value = res.data || []
    }
  } catch (error) {
    ElMessage.error('加载历史记录失败')
  } finally {
    loading.value = false
  }
}

// 打卡操作
async function clockIn() {
  try {
    const res = await clockInSvc({ type: '上班' })
    if (res.code === 200) {
      await loadTodayStatus()
      await loadAttendanceData()
      ElMessage.success('上班打卡成功')
    }
  } catch (error) {
    ElMessage.error('打卡失败')
  }
}

async function clockOut() {
  try {
    const res = await clockInSvc({ type: '下班' })
    if (res.code === 200) {
      await loadTodayStatus()
      await loadAttendanceData()
      ElMessage.success('下班打卡成功')
    }
  } catch (error) {
    ElMessage.error('打卡失败')
  }
}


function statusTagType(status: string) {
  return status === '正常' ? 'success' : 'danger'
}

// 初始化
onMounted(() => {
  loadTodayStatus()
  loadAttendanceData()
})
</script>
<style scoped>
.history-section {
  margin-top: 30px;
}

.filter-container {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.attendance-management {
  max-width: 1200px;
  margin: 30px auto;
  padding: 0 20px;
}

.card {
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
}

.card-title {
  font-size: 24px;
  font-weight: 500;
  color: #303133;
}

.punch-card {
  display: flex;
  align-items: center;
  gap: 30px;
  margin-bottom: 30px;
  padding: 25px;
  background-color: #f5f7fa;
  border-radius: 12px;
}

.punch-button {
  padding: 15px 30px;
  font-size: 16px;
  border-radius: 8px;
}

.button-icon {
  margin-right: 8px;
  font-size: 18px;
}

.status {
  margin-left: auto;
  font-size: 16px;
}

.status-title {
  font-weight: bold;
  margin-bottom: 10px;
  color: #606266;
}

.status-item {
  display: flex;
  align-items: center;
  margin: 8px 0;
  color: #606266;
}

.status-icon {
  margin-right: 8px;
  font-size: 18px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .punch-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .status {
    margin-left: 0;
    margin-top: 15px;
  }

  .punch-button {
    width: 100%;
    justify-content: center;
  }
}
</style>