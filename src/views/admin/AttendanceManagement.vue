<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Download, User, Timer, Close } from '@element-plus/icons-vue'
import {
  getAttendanceListSvc,
  getPersonalAttendanceSvc,
  type IAttendanceListReq,
  type IAttendanceResp
} from '@/service/modules/attendance/attendance'

// 搜索表单
const searchForm = reactive({
  keyword: '',
  department: '',
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

// 部门列表
const departments = ref([
  { id: 1, name: '技术部' },
  { id: 2, name: '人事部' },
  { id: 3, name: '财务部' },
  { id: 4, name: '市场部' }
])

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
  type: '',
  status: '',
  createTime: '',
  remark: ''
})

// 表单验证规则
const rules = {
  clockIn: [
    { required: true, message: '请选择签到时间', trigger: 'change' }
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

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toISOString().split('T')[0]
}

// 格式化时间
const formatTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toTimeString().split(' ')[0]
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
      params.startDate = formatDate(searchForm.dateRange[0])
      params.endDate = formatDate(searchForm.dateRange[1])
    }
    if (searchForm.status) {
      params.status = searchForm.status
    }

    const res = await getAttendanceListSvc(params)

    if (res.code === 200) {
      attendanceList.value = res.data || []
      total.value = res.total || 0

      // 更新统计信息（这里简化处理，实际应该从接口获取统计数据）
      updateStatistics(res.data || [])
    } else {
      ElMessage.error(res.message || '获取考勤数据失败')
    }
  } catch (error) {
    ElMessage.error('请求考勤数据出错')
  } finally {
    loading.value = false
  }
}

// 更新统计信息
const updateStatistics = (data: IAttendanceResp[]) => {
  const today = new Date().toISOString().split('T')[0]

  statistics.value = {
    todayPresent: data.filter(item =>
      item.status === 'normal' && formatDate(item.createTime) === today
    ).length,
    todayLate: data.filter(item =>
      item.status === 'late' && formatDate(item.createTime) === today
    ).length,
    todayEarly: data.filter(item =>
      item.status === 'early' && formatDate(item.createTime) === today
    ).length,
    todayAbsent: data.filter(item =>
      item.status === 'absent' && formatDate(item.createTime) === today
    ).length
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadAttendanceData()
}

// 导出记录
const handleExport = () => {
  // TODO: 调用导出接口
  ElMessage.success('导出成功')
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
    type: row.type,
    status: row.status,
    createTime: row.createTime,
    remark: ''
  })
}

// 删除考勤记录
const handleDelete = (row: IAttendanceResp) => {
  ElMessageBox.confirm(
    `确定要删除"${row.realName}"的考勤记录吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用删除接口
    ElMessage.success('删除成功')
    loadAttendanceData()
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
      loadAttendanceData()
    }
  })
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
