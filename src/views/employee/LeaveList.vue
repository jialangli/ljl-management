<template>
  <div class="leave-management">
    <el-card class="card">
      <div slot="header" class="card-header">
        <span>请假申请管理</span>

      </div>

      <!-- 请假列表 -->
      <el-table :data="leaveList" stripe border v-loading="loading" style="width: 100%; margin-top: 20px">
        <el-table-column prop="type" label="请假类型" width="120">
          <template #default="{ row }">
            {{ typeMap[row.type] }}
          </template>
        </el-table-column>
        <el-table-column prop="startTime" label="开始时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="endTime" label="结束时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.endTime) }}
          </template>
        </el-table-column>
        <el-table-column label="请假天数" width="100">
          <template #default="{ row }">
            {{ calculateDays(row.startTime, row.endTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="审批状态" width="120">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)" disable-transitions>
              {{ statusMap[row.status] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="事由" />
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination v-model:current-page="pagination.pageNum" v-model:page-size="pagination.pageSize"
          :total="pagination.total" :page-sizes="[5, 10, 20]" layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadLeaveData" @current-change="loadLeaveData" />
      </div>
    </el-card>

    <!-- 新建请假申请弹窗 -->
    <el-dialog title="新建请假申请" :model-value="showApplyDialog" width="500px" @close="resetForm">
      <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="请假类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择请假类型">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker v-model="form.startTime" type="date" placeholder="请选择开始日期" style="width: 100%"
            :picker-options="startPickerOptions" @change="handleDateChange" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker v-model="form.endTime" type="date" placeholder="请选择结束日期" style="width: 100%"
            :picker-options="endPickerOptions" @change="handleDateChange" value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="请假天数">
          <el-input-number :model-value="formDays" :min="1" :disabled="true" />
        </el-form-item>
        <el-form-item label="事由" prop="reason">
          <el-input type="textarea" v-model="form.reason" placeholder="请输入请假事由" :rows="3" :maxlength="200"
            show-word-limit />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showApplyDialog = false">取消</el-button>
        <el-button type="primary" @click="submitForm">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { FormRules } from 'element-plus'
import { ElMessage } from 'element-plus'
import { computed, onMounted, reactive, ref } from 'vue'
import {
  getPersonalLeaveListSvc,
  submitLeaveRequestSvc
} from '../../service/modules/leave/leave'
import type { ILeaveRequestResp } from '../../service/modules/leave/types'
import { useUserStore } from '../../store/main/user'

type DatePickerOptions = {
  disabledDate: (date: Date) => boolean
}

const userStore = useUserStore()
const loading = ref(false)
const showApplyDialog = ref(false)
const leaveList = ref<ILeaveRequestResp[]>([])
// 表单验证规则
const rules = reactive<FormRules>({
  type: [{ required: true, message: '请选择请假类型', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  reason: [{
    required: true,
    message: '请输入请假事由',
    trigger: 'blur'
  }, {
    max: 200,
    message: '备注最多200字',
    trigger: 'blur'
  }]
})

// 日期选择器配置
const startPickerOptions = reactive<DatePickerOptions>({
  disabledDate: (date: Date) => {
    if (!form.endTime) return false
    return date > new Date(form.endTime)
  }
})

const endPickerOptions = reactive<DatePickerOptions>({
  disabledDate: (date: Date) => {
    if (!form.startTime) return false
    return date < new Date(form.startTime)
  }
})

// 类型映射
const typeMap: Record<number, string> = {
  0: '病假',
  1: '事假',
  2: '年假'
}

const statusMap: Record<number, string> = {
  0: '待审批',
  1: '已通过',
  2: '已拒绝'
}

// 分页配置
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

// 表单配置
const formRef = ref()
const form = reactive({
  type: 1, // 默认事假
  startTime: '',
  endTime: '',
  reason: ''
})

// 类型选项
const typeOptions = [
  { value: 0, label: '病假' },
  { value: 1, label: '事假' },
  { value: 2, label: '年假' }
]

// 计算请假天数
const formDays = computed(() => {
  if (!form.startTime || !form.endTime) return 0
  const start = dayjs(form.startTime)
  const end = dayjs(form.endTime)
  return end.diff(start, 'day') + 1
})

// 处理日期变化
const handleDateChange = () => {
  if (form.startTime && form.endTime) {
    const start = dayjs(form.startTime)
    const end = dayjs(form.endTime)

    if (end.isBefore(start)) {
      form.endTime = form.startTime
    }
  }
}

// 加载请假数据
const loadLeaveData = async () => {
  try {
    loading.value = true
    const params = {
      userId: userStore.userId,
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize
    }

    const res = await getPersonalLeaveListSvc(params)
    if (res.code === 200) {
      leaveList.value = res.data || []
      pagination.total = res.total || 0
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

// 提交表单
const submitForm = async () => {
  try {
    await formRef.value.validate()

    // 格式化日期时间为完整格式
    const params = {
      type: Number(form.type),
      startTime: dayjs(form.startTime).format('YYYY-MM-DD 00:00:00'),
      endTime: dayjs(form.endTime).format('YYYY-MM-DD 23:59:59'),
      reason: form.reason
    }

    console.log('提交参数：', params)

    const res = await submitLeaveRequestSvc(params)
    if (res.code === 200) {
      ElMessage.success('提交成功')
      showApplyDialog.value = false
      resetForm()
      await loadLeaveData()
    }
  } catch (error) {
    ElMessage.error('提交失败，请检查表单')
    console.error('提交错误：', error)
  }
}

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields()
  form.type = 1
  form.startTime = ''
  form.endTime = ''
  form.reason = ''
}

// 状态标签类型
const statusType = (status: number) => {
  switch (status) {
    case 1: return 'success'
    case 0: return 'warning'
    case 2: return 'danger'
    default: return 'info'
  }
}

// 计算实际天数
const calculateDays = (start: string, end: string) => {
  return dayjs(end).diff(dayjs(start), 'day') + 1
}

// 格式化日期时间显示
const formatDateTime = (datetime: string) => {
  return dayjs(datetime).format('YYYY-MM-DD HH:mm:ss')
}

// 初始化加载数据
onMounted(() => {
  loadLeaveData()
})
</script>

<style scoped>
.leave-management {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 30px;
  border-radius: 10px;
  box-shadow: 0 4px 0 0 rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  font-size: 18px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-textarea) textarea {
  --el-input-textarea-rows: 3;
}

.add-button {
  margin-left: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-date-editor {
  width: 100%;
}
</style>