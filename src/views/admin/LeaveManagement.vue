<template>
  <div class="leave-management">
    <!-- 搜索和操作栏 -->
    <div class="operation-bar">
      <div class="search-area">
        <el-input v-model="searchForm.keyword" placeholder="请输入姓名/工号搜索" class="search-input" clearable
          @clear="handleSearch" @keyup.enter="handleSearch">
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>

        <el-select v-model="searchForm.type" placeholder="请假类型" clearable @change="handleSearch">
          <el-option label="病假" :value="0" />
          <el-option label="事假" :value="1" />
          <el-option label="年假" :value="2" />
        </el-select>

        <el-select v-model="searchForm.status" placeholder="审批状态" clearable @change="handleSearch">
          <el-option label="待审批" :value="0" />
          <el-option label="已通过" :value="1" />
          <el-option label="已拒绝" :value="2" />
        </el-select>

        <el-date-picker v-model="searchForm.dateRange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
          value-format="YYYY-MM-DD" @change="handleSearch" />
      </div>

      <el-button type="primary" @click="handleExport">
        <el-icon>
          <Download />
        </el-icon>导出记录
      </el-button>
    </div>

    <!-- 请假统计卡片 -->
    <el-row :gutter="20" class="statistics-cards">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>待审批</span>
              <el-icon>
                <Timer />
              </el-icon>
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
              <el-icon>
                <CircleCheck />
              </el-icon>
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
              <el-icon>
                <CircleClose />
              </el-icon>
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
              <el-icon>
                <Calendar />
              </el-icon>
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
    <el-table v-loading="loading" :data="leaveList" border style="width: 100%">
      <el-table-column prop="id" label="申请编号" width="100" />
      <el-table-column prop="userId" label="用户ID" width="100" />
      <el-table-column prop="realName" label="姓名" width="120" />
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column label="请假类型" width="100">
        <template #default="{ row }">
          <el-tag :type="getTypeTag(row.type)">
            {{ getTypeText(row.type) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="开始时间" width="180" />
      <el-table-column prop="endTime" label="结束时间" width="180" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="reason" label="请假原因" show-overflow-tooltip />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button-group v-if="row.status === 0">
            <el-button type="success" size="small" @click="handleApprove(row)">
              通过
            </el-button>
            <el-button type="danger" size="small" @click="handleReject(row)">
              拒绝
            </el-button>
          </el-button-group>
          <el-button-group v-else>
            <el-button type="primary" size="small" @click="handleView(row)">
              查看
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
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
        :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>

    <!-- 审批对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogType === 'approve' ? '通过申请' : '拒绝申请'" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="申请编号">
          <el-input v-model="form.id" disabled />
        </el-form-item>
        <el-form-item label="申请人">
          <el-input v-model="form.realName" disabled />
        </el-form-item>
        <el-form-item label="请假类型">
          <el-input :value="getTypeText(form.type)" disabled />
        </el-form-item>
        <el-form-item label="请假时间">
          <el-input :value="`${form.startTime} 至 ${form.endTime}`" disabled />
        </el-form-item>
        <el-form-item label="请假原因">
          <el-input v-model="form.reason" type="textarea" :rows="3" disabled />
        </el-form-item>
        <el-form-item label="审批意见" prop="comment">
          <el-input v-model="form.comment" type="textarea" :rows="3"
            :placeholder="dialogType === 'approve' ? '请输入通过意见' : '请输入拒绝原因'" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog v-model="detailVisible" title="请假详情" width="600px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="申请编号">{{
          currentLeave.id
        }}</el-descriptions-item>
        <el-descriptions-item label="申请人">{{
          currentLeave.realName
        }}</el-descriptions-item>
        <el-descriptions-item label="用户名">{{
          currentLeave.username
        }}</el-descriptions-item>
        <el-descriptions-item label="用户ID">{{
          currentLeave.userId
        }}</el-descriptions-item>
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
        <el-table-column label="开始时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column label="结束时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.endTime) }}
          </template>
        </el-table-column>
        <el-descriptions-item label="申请时间">{{
          currentLeave.createTime
        }}</el-descriptions-item>
        <el-descriptions-item label="请假原因" :span="2">{{
          currentLeave.reason
        }}</el-descriptions-item>
        <el-descriptions-item label="审批意见" :span="2">{{
          currentLeave.comment || "无"
        }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  deleteLeaveSvc,
  getLeaveListSvc,
  updateLeaveStatusSvc,
  type ILeaveListReq,
  type ILeaveRequestResp,
  type ILeaveStatusUpdateReq
} from '@/service/modules/leave/leave';
import { formatUTC } from '@/utils/format';
import { Calendar, CircleCheck, CircleClose, Download, Search, Timer } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';

// 日期时间格式化函数
const formatDateTime = (dateString: string) => {
  if (!dateString) return '';

  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 月份从0开始
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
};
// 搜索表单
const searchForm = reactive({
  keyword: '',
  type: undefined as number | undefined,
  status: undefined as number | undefined,
  dateRange: [] as string[]
})

// 请假统计
const statistics = reactive({
  pending: 0,
  approved: 0,
  rejected: 0,
  monthly: 0
})

// 表格数据
const loading = ref(false)
const leaveList = ref<ILeaveRequestResp[]>([])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框
const dialogVisible = ref(false)
const dialogType = ref<'approve' | 'reject'>('approve')
const formRef = ref()

// 详情对话框
const detailVisible = ref(false)
const currentLeave = ref<ILeaveRequestResp>({} as ILeaveRequestResp)

// 表单数据
const form = reactive({
  id: 0,
  realName: '',
  type: 0,
  startTime: '',
  endTime: '',
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
const getTypeTag = (type: number) => {
  const types: Record<number, string> = {
    0: 'danger', // 病假
    1: '',       // 事假
    2: 'success' // 年假
  }
  return types[type] || 'info'
}

// 获取请假类型文本
const getTypeText = (type: number) => {
  const texts: Record<number, string> = {
    0: '病假',
    1: '事假',
    2: '年假'
  }
  return texts[type] || '未知'
}

// 获取状态类型
const getStatusType = (status: number) => {
  const types: Record<number, string> = {
    0: 'warning',  // 待审批
    1: 'success',  // 已通过
    2: 'danger'    // 已拒绝
  }
  return types[status] || 'info'
}

// 获取状态文本
const getStatusText = (status: number) => {
  const texts: Record<number, string> = {
    0: '待审批',
    1: '已通过',
    2: '已拒绝'
  }
  return texts[status] || '未知'
}

// 加载请假数据
const loadLeaveData = async () => {
  try {
    loading.value = true

    const params: ILeaveListReq = {
      pageNum: currentPage.value,
      pageSize: pageSize.value
    }

    // 添加搜索条件
    if (searchForm.keyword) {
      params.userId = parseInt(searchForm.keyword) || undefined
    }
    if (searchForm.type !== undefined) {
      params.type = searchForm.type
    }
    if (searchForm.status !== undefined) {
      params.status = searchForm.status
    }
    if (searchForm.dateRange && searchForm.dateRange.length === 2) {
      params.startTime = searchForm.dateRange[0]
      params.endTime = searchForm.dateRange[1]
    }

    const res = await getLeaveListSvc(params)

    if (res.code === 200) {
      leaveList.value = res.data || []


      // 修改时间格式
      leaveList.value.forEach(item => {
        if (item.startTime) item.startTime = formatUTC(item.startTime)
        if (item.endTime) item.endTime = formatUTC(item.endTime)
      });

      // 更新统计信息
      updateStatistics(res.data || [])
    } else {
      ElMessage.error(res.message || '获取请假列表失败')
    }
  } catch (error) {
    ElMessage.error('请求请假列表出错')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 更新统计信息
const updateStatistics = (data: ILeaveRequestResp[]) => {
  const today = new Date()
  const currentMonth = today.getMonth() + 1
  const currentYear = today.getFullYear()

  statistics.pending = data.filter(item => item.status === 0).length
  statistics.approved = data.filter(item => item.status === 1).length
  statistics.rejected = data.filter(item => item.status === 2).length

  // 计算本月请假数量
  statistics.monthly = data.filter(item => {
    const date = new Date(item.createTime)
    return date.getMonth() + 1 === currentMonth && date.getFullYear() === currentYear
  }).length
}


// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadLeaveData()
}

// 导出记录
const handleExport = () => {
  ElMessage.warning('导出功能需要根据实际API实现')
}

// 通过申请
const handleApprove = (row: ILeaveRequestResp) => {
  dialogType.value = 'approve'
  dialogVisible.value = true
  form.id = row.id
  form.realName = row.realName
  form.type = row.type
  form.startTime = row.startTime
  form.endTime = row.endTime
  form.reason = row.reason
  form.comment = ''
}

// 拒绝申请
const handleReject = (row: ILeaveRequestResp) => {
  dialogType.value = 'reject'
  dialogVisible.value = true
  form.id = row.id
  form.realName = row.realName
  form.type = row.type
  form.startTime = row.startTime
  form.endTime = row.endTime
  form.reason = row.reason
  form.comment = ''
}

// 查看详情
const handleView = (row: ILeaveRequestResp) => {
  currentLeave.value = { ...row }
  detailVisible.value = true
}


// 处理删除
const handleDelete = async (row: ILeaveRequestResp) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除${row.realName}的请假记录吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );


    const res = await deleteLeaveSvc(row.id)

    if (res.code === 200) {
      ElMessage.success('删除成功')
      loadLeaveData()
    } else {
      ElMessage.error(res.message || '删除失败')
    }
  } catch (error) {
    // 用户取消删除不做任何操作
  }
}

// 提交审批
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    const statusData: ILeaveStatusUpdateReq = {
      status: dialogType.value === 'approve' ? 1 : 2
    }

    const res = await updateLeaveStatusSvc(form.id, statusData)

    if (res.code === 200) {
      ElMessage.success(dialogType.value === 'approve' ? '已通过申请' : '已拒绝申请')
      dialogVisible.value = false
      loadLeaveData()
    } else {
      ElMessage.error(res.message || '审批操作失败')
    }
  } catch (error) {
    // 验证失败不做任何操作
  }
}

// 分页大小改变
const handleSizeChange = (val: number) => {
  pageSize.value = val
  loadLeaveData()
}

// 当前页改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  loadLeaveData()
}

// 初始化加载数据
onMounted(() => {
  loadLeaveData()
})
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
  color: #409eff;
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
