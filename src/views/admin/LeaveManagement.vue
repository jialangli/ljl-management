<template>
  <div class="leave-management">
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
        <el-select v-model="searchForm.type" placeholder="请假类型" clearable @change="handleSearch">
          <el-option label="事假" value="personal" />
          <el-option label="病假" value="sick" />
          <el-option label="年假" value="annual" />
          <el-option label="调休" value="compensatory" />
        </el-select>
        <el-select v-model="searchForm.status" placeholder="审批状态" clearable @change="handleSearch">
          <el-option label="待审批" value="pending" />
          <el-option label="已通过" value="approved" />
          <el-option label="已拒绝" value="rejected" />
        </el-select>
      </div>
      <el-button type="primary" @click="handleExport">
        <el-icon><Download /></el-icon>导出记录
      </el-button>
    </div>

    <!-- 请假统计卡片 -->
    <el-row :gutter="20" class="statistics-cards">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>待审批</span>
              <el-icon><Timer /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <span class="number">{{ statistics.pending }}</span>
            <span class="unit">条</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>已通过</span>
              <el-icon><CircleCheck /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <span class="number">{{ statistics.approved }}</span>
            <span class="unit">条</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>已拒绝</span>
              <el-icon><CircleClose /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <span class="number">{{ statistics.rejected }}</span>
            <span class="unit">条</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>本月请假</span>
              <el-icon><Calendar /></el-icon>
            </div>
          </template>
          <div class="card-content">
            <span class="number">{{ statistics.monthly }}</span>
            <span class="unit">条</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 请假记录表格 -->
    <el-table
      v-loading="loading"
      :data="leaveList"
      border
      style="width: 100%"
    >
      <el-table-column prop="id" label="申请编号" width="100" />
      <el-table-column prop="employeeId" label="工号" width="100" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="department" label="所属部门" width="120" />
      <el-table-column prop="type" label="请假类型" width="100">
        <template #default="{ row }">
          <el-tag :type="getTypeTag(row.type)">
            {{ getTypeText(row.type) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间" width="180" />
      <el-table-column prop="endTime" label="结束时间" width="180" />
      <el-table-column prop="duration" label="时长" width="100">
        <template #default="{ row }">
          {{ row.duration }}天
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="reason" label="请假原因" show-overflow-tooltip />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button-group v-if="row.status === 'pending'">
            <el-button type="success" size="small" @click="handleApprove(row)">
              通过
            </el-button>
            <el-button type="danger" size="small" @click="handleReject(row)">
              拒绝
            </el-button>
          </el-button-group>
          <el-button v-else type="primary" size="small" @click="handleView(row)">
            查看
          </el-button>
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

    <!-- 审批对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'approve' ? '通过申请' : '拒绝申请'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="申请编号">
          <el-input v-model="form.id" disabled />
        </el-form-item>
        <el-form-item label="申请人">
          <el-input v-model="form.name" disabled />
        </el-form-item>
        <el-form-item label="请假类型">
          <el-input v-model="form.type" disabled />
        </el-form-item>
        <el-form-item label="请假时间">
          <el-input v-model="form.timeRange" disabled />
        </el-form-item>
        <el-form-item label="请假原因">
          <el-input v-model="form.reason" type="textarea" :rows="3" disabled />
        </el-form-item>
        <el-form-item label="审批意见" prop="comment">
          <el-input
            v-model="form.comment"
            type="textarea"
            :rows="3"
            :placeholder="dialogType === 'approve' ? '请输入通过意见' : '请输入拒绝原因'"
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

    <!-- 查看详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="请假详情"
      width="600px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="申请编号">{{ currentLeave.id }}</el-descriptions-item>
        <el-descriptions-item label="申请人">{{ currentLeave.name }}</el-descriptions-item>
        <el-descriptions-item label="工号">{{ currentLeave.employeeId }}</el-descriptions-item>
        <el-descriptions-item label="所属部门">{{ currentLeave.department }}</el-descriptions-item>
        <el-descriptions-item label="请假类型">
          <el-tag :type="getTypeTag(currentLeave.type)">
            {{ getTypeText(currentLeave.type) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentLeave.status)">
            {{ getStatusText(currentLeave.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ currentLeave.startTime }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ currentLeave.endTime }}</el-descriptions-item>
        <el-descriptions-item label="请假时长">{{ currentLeave.duration }}天</el-descriptions-item>
        <el-descriptions-item label="申请时间">{{ currentLeave.applyTime }}</el-descriptions-item>
        <el-descriptions-item label="请假原因" :span="2">{{ currentLeave.reason }}</el-descriptions-item>
        <el-descriptions-item label="审批意见" :span="2">{{ currentLeave.comment || '无' }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Download, Timer, CircleCheck, CircleClose, Calendar } from '@element-plus/icons-vue'

// 搜索表单
const searchForm = reactive({
  keyword: '',
  department: '',
  type: '',
  status: ''
})

// 部门列表
const departments = ref([
  { id: 1, name: '技术部' },
  { id: 2, name: '人事部' },
  { id: 3, name: '财务部' },
  { id: 4, name: '市场部' }
])

// 请假统计
const statistics = ref({
  pending: 5,
  approved: 12,
  rejected: 3,
  monthly: 20
})

// 表格数据
const loading = ref(false)
const leaveList = ref([
  {
    id: 'LEA001',
    employeeId: 'EMP001',
    name: '张三',
    department: '技术部',
    type: 'personal',
    startTime: '2024-03-20 09:00',
    endTime: '2024-03-21 18:00',
    duration: 2,
    status: 'pending',
    reason: '家中有事需要处理',
    applyTime: '2024-03-19 14:30',
    comment: ''
  },
  {
    id: 'LEA002',
    employeeId: 'EMP002',
    name: '李四',
    department: '人事部',
    type: 'sick',
    startTime: '2024-03-20 09:00',
    endTime: '2024-03-20 18:00',
    duration: 1,
    status: 'approved',
    reason: '感冒发烧',
    applyTime: '2024-03-19 16:20',
    comment: '同意请假，请好好休息'
  }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 对话框
const dialogVisible = ref(false)
const dialogType = ref<'approve' | 'reject'>('approve')
const formRef = ref()

// 详情对话框
const detailVisible = ref(false)
const currentLeave = ref({})

// 表单数据
const form = reactive({
  id: '',
  name: '',
  type: '',
  timeRange: '',
  reason: '',
  comment: ''
})

// 表单验证规则
const rules = {
  comment: [
    { required: true, message: '请输入审批意见', trigger: 'blur' }
  ]
}

// 获取请假类型标签
const getTypeTag = (type: string) => {
  const types = {
    personal: '',
    sick: 'danger',
    annual: 'success',
    compensatory: 'warning'
  }
  return types[type] || 'info'
}

// 获取请假类型文本
const getTypeText = (type: string) => {
  const texts = {
    personal: '事假',
    sick: '病假',
    annual: '年假',
    compensatory: '调休'
  }
  return texts[type] || '未知'
}

// 获取状态类型
const getStatusType = (status: string) => {
  const types = {
    pending: 'warning',
    approved: 'success',
    rejected: 'danger'
  }
  return types[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: string) => {
  const texts = {
    pending: '待审批',
    approved: '已通过',
    rejected: '已拒绝'
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

// 通过申请
const handleApprove = (row: any) => {
  dialogType.value = 'approve'
  dialogVisible.value = true
  form.id = row.id
  form.name = row.name
  form.type = getTypeText(row.type)
  form.timeRange = `${row.startTime} 至 ${row.endTime}`
  form.reason = row.reason
  form.comment = ''
}

// 拒绝申请
const handleReject = (row: any) => {
  dialogType.value = 'reject'
  dialogVisible.value = true
  form.id = row.id
  form.name = row.name
  form.type = getTypeText(row.type)
  form.timeRange = `${row.startTime} 至 ${row.endTime}`
  form.reason = row.reason
  form.comment = ''
}

// 查看详情
const handleView = (row: any) => {
  currentLeave.value = { ...row }
  detailVisible.value = true
}

// 提交审批
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      // TODO: 调用审批接口
      ElMessage.success(dialogType.value === 'approve' ? '已通过申请' : '已拒绝申请')
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
.leave-management {
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

:deep(.el-descriptions) {
  margin: 20px 0;
}
</style>
