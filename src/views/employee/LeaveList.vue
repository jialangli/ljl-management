<template>
  <div class="leave-management">
    <el-card class="card">
      <div slot="header" class="card-header">
        <span>请假申请管理</span>
        <el-button type="primary" @click="showApplyDialog = true" icon="el-icon-plus" size="small">
          新建请假申请
        </el-button>
      </div>

      <!-- 请假列表 -->
      <el-table
        :data="leaveList"
        stripe
        border
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="type" label="请假类型" width="120" />
        <el-table-column prop="startTime" label="开始时间" width="180" />
        <el-table-column prop="endTime" label="结束时间" width="180" />
        <el-table-column prop="days" label="请假天数" width="100" />
        <el-table-column prop="status" label="审批状态" width="120">
          <template #default="{ row }">
            <el-tag
              :type="statusType(row.status)"
              disable-transitions
            >
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
      </el-table>
    </el-card>

    <!-- 新建请假申请弹窗 -->
    <el-dialog
      title="新建请假申请"
      :model-value="showApplyDialog"
      width="500px"
      @close="resetForm"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="formRef"
        label-width="100px"
      >
        <el-form-item label="请假类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择请假类型">
            <el-option label="事假" value="事假" />
            <el-option label="病假" value="病假" />
            <el-option label="年假" value="年假" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="date"
            placeholder="请选择开始日期"
            style="width: 100%"
            :picker-options="startPickerOptions"
            @change="handleDateChange"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="form.endTime"
            type="date"
            placeholder="请选择结束日期"
            style="width: 100%"
            :picker-options="endPickerOptions"
            @change="handleDateChange"
          />
        </el-form-item>
        <el-form-item label="请假天数" prop="days">
          <el-input-number v-model="form.days" :min="1" :max="365" :disabled="true" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            v-model="form.remark"
            placeholder="请输入备注（可选）"
            rows="3"
          />
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
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'

interface LeaveItem {
  id: number
  type: string
  startTime: string
  endTime: string
  days: number
  status: string
  remark: string
}

const showApplyDialog = ref(false)

const leaveList = ref<LeaveItem[]>([
  {
    id: 1,
    type: '事假',
    startTime: '2024-06-01',
    endTime: '2024-06-03',
    days: 3,
    status: '已批准',
    remark: '陪同家人'
  },
  {
    id: 2,
    type: '年假',
    startTime: '2024-05-20',
    endTime: '2024-05-24',
    days: 5,
    status: '审批中',
    remark: '休假旅游'
  },
])

const formRef = ref()
const form = reactive({
  type: '',
  startTime: '',
  endTime: '',
  days: 1,
  remark: ''
})

// 日期选择器限制，结束日期不能早于开始日期，开始日期不能晚于结束日期
const startPickerOptions = {
  disabledDate(date: Date) {
    if (!form.endTime) return false
    return date.getTime() > new Date(form.endTime).getTime()
  }
}
const endPickerOptions = {
  disabledDate(date: Date) {
    if (!form.startTime) return false
    return date.getTime() < new Date(form.startTime).getTime()
  }
}

function handleDateChange() {
  // 计算请假天数，包含起止日期
  if (!form.startTime || !form.endTime) {
    form.days = 1
    return
  }
  const start = new Date(form.startTime)
  const end = new Date(form.endTime)
  const diffTime = end.getTime() - start.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
  form.days = diffDays > 0 ? diffDays : 1
}

const rules = {
  type: [{ required: true, message: '请选择请假类型', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  remark: [{ max: 200, message: '备注最多200字', trigger: 'blur' }],
}

function resetForm() {
  form.type = ''
  form.startTime = ''
  form.endTime = ''
  form.days = 1
  form.remark = ''
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

function submitForm() {
  if (!formRef.value) return

  formRef.value.validate((valid: boolean) => {
    if (valid) {
      // 模拟提交到接口
      leaveList.value.push({
        id: Date.now(),
        type: form.type,
        startTime: form.startTime,
        endTime: form.endTime,
        days: form.days,
        status: '审批中',
        remark: form.remark
      })
      ElMessage.success('请假申请提交成功，等待审批')
      showApplyDialog.value = false
      resetForm()
    }
  })
}

// 状态颜色
function statusType(status: string) {
  switch (status) {
    case '已批准':
      return 'success'
    case '审批中':
      return 'warning'
    case '未通过':
      return 'info'
    default:
      return ''
  }
}
</script>

<style scoped>
.leave-management {
  max-width: 900px;
  margin: 20px auto;
}
.card {
  padding: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 18px;
}
</style>
