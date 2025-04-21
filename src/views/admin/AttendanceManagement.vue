<template>
  <div class="attendance-management">
    <!-- 搜索区域 -->
    <div class="operation-bar">
      <div class="search-area">
        <el-input
          v-model="searchForm.keyword"
          placeholder="请输入员工ID"
          class="search-input"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-date-picker
          v-model="searchForm.dateRange"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :shortcuts="dateShortcuts"
          value-format="YYYY-MM-DD"
        />

        <el-select
          v-model="searchForm.status"
          placeholder="选择状态"
          clearable
          @change="handleSearch"
        >
          <el-option label="正常" value="normal" />
          <el-option label="迟到" value="late" />
          <el-option label="早退" value="early" />
        </el-select>

        <el-button type="primary" @click="handleSearch">
          <el-icon><Search /></el-icon>搜索
        </el-button>
      </div>

      <el-button type="success" @click="handleExport">
        <el-icon><Download /></el-icon>导出
      </el-button>
    </div>

    <!-- 考勤统计卡片 -->
    <div class="statistics-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="card-header">
              <span>今日出勤</span>
              <el-icon><User /></el-icon>
            </div>
            <div class="card-content">
              <span class="number">{{ statistics.todayPresent }}</span>
              <span class="unit">人</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="card-header">
              <span>今日迟到</span>
              <el-icon><Timer /></el-icon>
            </div>
            <div class="card-content">
              <span class="number">{{ statistics.todayLate }}</span>
              <span class="unit">人</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="card-header">
              <span>今日早退</span>
              <el-icon><Timer /></el-icon>
            </div>
            <div class="card-content">
              <span class="number">{{ statistics.todayEarly }}</span>
              <span class="unit">人</span>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="card-header">
              <span>今日缺勤</span>
              <el-icon><Close /></el-icon>
            </div>
            <div class="card-content">
              <span class="number">{{ statistics.todayAbsent }}</span>
              <span class="unit">人</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 考勤列表表格 -->
    <el-table
      v-loading="loading"
      :data="attendanceList"
      border
      style="width: 100%"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="realName" label="姓名" width="120" />
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column label="打卡时间" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.clockIn) }}
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" width="100">
        <template #default="{ row }">
          <el-tag :type="row.type === '上班' ? 'primary' : 'success'">
            {{ row.type }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button-group>
            <el-button type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 编辑考勤记录对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="编辑考勤记录"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="员工姓名">
          <el-input v-model="form.realName" disabled />
        </el-form-item>
        <el-form-item label="打卡时间" prop="clockIn">
          <el-date-picker
            v-model="form.clockIn"
            type="datetime"
            placeholder="选择打卡时间"
            value-format="YYYY-MM-DDTHH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="正常" value="normal" />
            <el-option label="迟到" value="late" />
            <el-option label="早退" value="early" />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Download, User, Timer, Close } from '@element-plus/icons-vue'
import {
  getAttendanceListSvc,
  type IAttendanceListReq,
  type IAttendanceResp
} from '@/service/modules/attendance/attendance'

// 搜索表单
const searchForm = reactive({
  keyword: '',
  dateRange: [] as string[],
  status: ''
})

// 日期快捷选项
const dateShortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    }
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    }
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    }
  }
]

// 考勤统计
const statistics = ref({
  todayPresent: 0,
  todayLate: 0,
  todayEarly: 0,
  todayAbsent: 0
})

// 表格数据
const loading = ref(false)
const attendanceList = ref<IAttendanceResp[]>([])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框
const dialogVisible = ref(false)
const formRef = ref()

// 表单数据
const form = reactive({
  id: 0,
  userId: 0,
  username: '',
  realName: '',
  clockIn: '',
  status: '',
})

// 表单验证规则
const rules = {
  clockIn: [
    { required: true, message: '请选择打卡时间', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 获取状态类型
const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    normal: 'success',
    late: 'warning',
    early: 'warning',
    absent: 'danger'
  }
  return types[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    normal: '正常',
    late: '迟到',
    early: '早退',
    absent: '缺勤'
  }
  return texts[status] || '未知'
}

// 格式化日期时间
const formatDateTime = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString()
}

// 加载考勤数据
const loadAttendanceData = async () => {
  try {
    loading.value = true

    const params: IAttendanceListReq = {
      pageNum: currentPage.value,
      pageSize: pageSize.value
    }

    // 添加搜索条件
    if (searchForm.keyword) {
      params.userId = parseInt(searchForm.keyword) || undefined
    }
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      params.startDate = searchForm.dateRange[0]
      params.endDate = searchForm.dateRange[1]
    }
    if (searchForm.status) {
      params.status = searchForm.status
    }

    const res = await getAttendanceListSvc(params)

    if (res.code === 200) {
      attendanceList.value = res.data || []
      total.value = res.total || 0

      // 更新统计信息
      updateStatistics(res.data || [])
    } else {
      ElMessage.error(res.message || '获取考勤数据失败')
    }
  } catch (error) {
    ElMessage.error('请求考勤数据出错')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 更新统计信息
const updateStatistics = (data: IAttendanceResp[]) => {
  const today = new Date().toISOString().split('T')[0]

  statistics.value = {
    todayPresent: data.filter(item =>
      item.status === 'normal' && item.clockIn?.startsWith(today)
    ).length,
    todayLate: data.filter(item =>
      item.status === 'late' && item.clockIn?.startsWith(today)
    ).length,
    todayEarly: data.filter(item =>
      item.status === 'early' && item.clockIn?.startsWith(today)
    ).length,
    todayAbsent: 0 // 需要根据实际情况计算缺勤人数
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadAttendanceData()
}

// 导出记录
const handleExport = () => {
  ElMessage.warning('导出功能需要根据实际API实现')
}

// 编辑考勤记录
const handleEdit = (row: IAttendanceResp) => {
  dialogVisible.value = true
  Object.assign(form, {
    id: row.id,
    userId: row.userId,
    username: row.username,
    realName: row.realName,
    clockIn: row.clockIn,
    status: row.status
  })
}

// 删除考勤记录
const handleDelete = async (row: IAttendanceResp) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除"${row.realName}"的考勤记录吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    // TODO: 调用删除接口
    ElMessage.warning('删除功能需要根据实际API实现')
    // 模拟删除成功后刷新列表
    loadAttendanceData()
  } catch (error) {
    // 用户取消删除不做任何操作
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    // TODO: 调用编辑接口
    ElMessage.warning('编辑功能需要根据实际API实现')
    dialogVisible.value = false
    loadAttendanceData()
  } catch (error) {
    // 验证失败不做任何操作
  }
}

// 分页大小改变
const handleSizeChange = (val: number) => {
  pageSize.value = val
  loadAttendanceData()
}

// 当前页改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  loadAttendanceData()
}

// 初始化加载数据
onMounted(() => {
  loadAttendanceData()
})
</script>

<style scoped>
.attendance-management {
  padding: 20px;
}

.operation-bar {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-area {
  display: flex;
  gap: 10px;
}

.search-input {
  width: 200px;
}

.statistics-cards {
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

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-button-group) {
  .el-button {
    margin-left: 0;
  }
}
</style>