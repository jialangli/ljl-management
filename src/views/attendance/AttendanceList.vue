<template>
  <div class="attendance-list">
    <div class="header">
      <h2>考勤管理</h2>
      <div class="actions">
        <el-button type="primary" @click="handleClockIn('上班')"
          >上班打卡</el-button
        >
        <el-button type="success" @click="handleClockIn('下班')"
          >下班打卡</el-button
        >
      </div>
    </div>

    <el-table :data="attendanceList" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="clockIn" label="打卡时间" />
      <el-table-column prop="type" label="类型">
        <template #default="{ row }">
          <el-tag :type="row.type === '上班' ? 'primary' : 'success'">
            {{ row.type }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="addTime" label="添加时间" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { attendanceApi } from '../../service/api'
import { ElMessage } from 'element-plus'
import { Attendance } from '../../types'
import { useUserStore } from '../../store/user'

const userStore = useUserStore()
const attendanceList = ref<Attendance[]>([])

const getStatusType = (status: string) => {
  switch (status) {
    case '正常':
      return 'success'
    case '迟到':
      return 'warning'
    case '早退':
      return 'danger'
    default:
      return 'info'
  }
}

const fetchData = async () => {
  try {
    const res = await attendanceApi.getList(userStore.userInfo?.id)
    attendanceList.value = res.data
  } catch (error) {
    console.error(error)
    ElMessage.error('获取数据失败')
  }
}

const handleClockIn = async (type: '上班' | '下班') => {
  try {
    if (!userStore.userInfo?.id) {
      ElMessage.error('请先登录')
      return
    }

    await attendanceApi.clockIn({
      userId: userStore.userInfo.id,
      type,
    })

    ElMessage.success(`${type}打卡成功`)
    fetchData()
  } catch (error) {
    console.error(error)
    ElMessage.error('打卡失败')
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.attendance-list {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
}

.actions {
  display: flex;
  gap: 10px;
}
</style>
