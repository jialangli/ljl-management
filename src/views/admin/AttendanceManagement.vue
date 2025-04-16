<template>
  <div class="attendance-management">
    <!-- 搜索和操作栏 -->
    <div class="operation-bar">
      <div class="search-area">
        <el-input
          v-model="searchForm.keyword"
          placeholder="请输入姓名/工号搜索"
          class="search-input"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="searchForm.department" placeholder="选择部门" clearable @change="handleSearch">
          <el-option
            v-for="dept in departments"
            :key="dept.id"
            :label="dept.name"
            :value="dept.id"
          />
        </el-select>
        <el-date-picker
          v-model="searchForm.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :shortcuts="dateShortcuts"
          @change="handleSearch"
        />
        <el-select v-model="searchForm.status" placeholder="考勤状态" clearable @change="handleSearch">
          <el-option label="正常" value="normal" />
          <el-option label="迟到" value="late" />
          <el-option label="早退" value="early" />
          <el-option label="缺勤" value="absent" />
        </el-select>
      </div>
      <el-button type="primary" @click="handleExport">
        <el-icon><Download /></el-icon>导出记录
      </el-button>
    </div>

    <!-- 考勤统计卡片 -->
    <el-row :gutter="20" class="statistics-cards">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>今日出勤</span>
              <el-icon><User /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <span class="number">{{ statistics.todayPresent }}</span>
            <span class="unit">人</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>今日迟到</span>
              <el-icon><Timer /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <span class="number">{{ statistics.todayLate }}</span>
            <span class="unit">人</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>今日早退</span>
              <el-icon><Timer /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <span class="number">{{ statistics.todayEarly }}</span>
            <span class="unit">人</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>今日缺勤</span>
              <el-icon><Close /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <span class="number">{{ statistics.todayAbsent }}</span>
            <span class="unit">人</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 考勤记录表格 -->
    <el-table
      v-loading="loading"
      :data="attendanceList"
      border
      style="width: 100%"
    >
      <el-table-column prop="id" label="工号" width="100" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="department" label="所属部门" width="120" />
      <el-table-column prop="date" label="日期" width="120" />
      <el-table-column prop="checkIn" label="签到时间" width="180" />
      <el-table-column prop="checkOut" label="签退时间" width="180" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" />
      <el-table-column label="操作" width="150" fixed="right">
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
        <el-form-item label="工号">
          <el-input v-model="form.id" disabled />
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.name" disabled />
        </el-form-item>
        <el-form-item label="日期">
          <el-input v-model="form.date" disabled />
        </el-form-item>
        <el-form-item label="签到时间" prop="checkIn">
          <el-time-picker
            v-model="form.checkIn"
            placeholder="选择签到时间"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="签退时间" prop="checkOut">
          <el-time-picker
            v-model="form.checkOut"
            placeholder="选择签退时间"
            format="HH:mm:ss"
            value-format="HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option label="正常" value="normal" />
            <el-option label="迟到" value="late" />
            <el-option label="早退" value="early" />
            <el-option label="缺勤" value="absent" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
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
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Download, User, Timer, Close } from '@element-plus/icons-vue'

// 搜索表单
const searchForm = reactive({
  keyword: '',
  department: '',
  dateRange: [],
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

// 部门列表
const departments = ref([
  { id: 1, name: '技术部' },
  { id: 2, name: '人事部' },
  { id: 3, name: '财务部' },
  { id: 4, name: '市场部' }
])

// 考勤统计
const statistics = ref({
  todayPresent: 156,
  todayLate: 3,
  todayEarly: 2,
  todayAbsent: 1
})

// 表格数据
const loading = ref(false)
const attendanceList = ref([
  {
    id: 'EMP001',
    name: '张三',
    department: '技术部',
    date: '2024-03-20',
    checkIn: '09:00:00',
    checkOut: '18:00:00',
    status: 'normal',
    remark: ''
  },
  {
    id: 'EMP002',
    name: '李四',
    department: '人事部',
    date: '2024-03-20',
    checkIn: '09:15:00',
    checkOut: '18:00:00',
    status: 'late',
    remark: '迟到15分钟'
  }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 对话框
const dialogVisible = ref(false)
const formRef = ref()

// 表单数据
const form = reactive({
  id: '',
  name: '',
  date: '',
  checkIn: '',
  checkOut: '',
  status: '',
  remark: ''
})

// 表单验证规则
const rules = {
  checkIn: [
    { required: true, message: '请选择签到时间', trigger: 'change' }
  ],
  checkOut: [
    { required: true, message: '请选择签退时间', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 获取状态类型
const getStatusType = (status: string) => {
  const types = {
    normal: 'success',
    late: 'warning',
    early: 'warning',
    absent: 'danger'
  }
  return types[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const texts = {
    normal: '正常',
    late: '迟到',
    early: '早退',
    absent: '缺勤'
  }
  return texts[status] || '未知'
}

// 搜索
const handleSearch = () => {
  // TODO: 调用搜索接口
  console.log('搜索条件：', searchForm)
}

// 导出记录
const handleExport = () => {
  // TODO: 调用导出接口
  ElMessage.success('导出成功')
}

// 编辑考勤记录
const handleEdit = (row: any) => {
  dialogVisible.value = true
  Object.keys(form).forEach(key => {
    form[key] = row[key]
  })
}

// 删除考勤记录
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除"${row.name}"的考勤记录吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用删除接口
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      // TODO: 调用编辑接口
      ElMessage.success('编辑成功')
      dialogVisible.value = false
    }
  })
}

// 分页大小改变
const handleSizeChange = (val: number) => {
  pageSize.value = val
  // TODO: 重新加载数据
}

// 当前页改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // TODO: 重新加载数据
}
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
