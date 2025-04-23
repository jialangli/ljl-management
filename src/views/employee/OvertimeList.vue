<template>
  <div class="overtime-management">
    <el-card class="card">
      <div slot="header" class="card-header">
        <span>加班申请管理</span>
        <el-button type="primary" @click="showApplyDialog = true" icon="el-icon-plus" size="small">
          新建加班申请
        </el-button>
      </div>

      <!-- 加班列表 -->
      <el-table
        :data="overtimeList"
        stripe
        border
        style="width: 100%; margin-top: 20px"
      >
        <el-table-column prop="type" label="加班类型" width="120" />
        <el-table-column prop="startTime" label="开始时间" width="180" />
        <el-table-column prop="endTime" label="结束时间" width="180" />
        <el-table-column prop="hours" label="加班时长(小时)" width="140" />
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

    <!-- 新建加班申请弹窗 -->
    <el-dialog
      title="新建加班申请"
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
        <el-form-item label="加班类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择加班类型">
            <el-option label="日常加班" value="日常加班" />
            <el-option label="周末加班" value="周末加班" />
            <el-option label="节假日加班" value="节假日加班" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            placeholder="请选择开始时间"
            style="width: 100%"
            :picker-options="startPickerOptions"
            @change="handleTimeChange"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="form.endTime"
            type="datetime"
            placeholder="请选择结束时间"
            style="width: 100%"
            :picker-options="endPickerOptions"
            @change="handleTimeChange"
          />
        </el-form-item>
        <el-form-item label="加班时长" prop="hours">
          <el-input-number
            v-model="form.hours"
            :min="0.5"
            :max="24"
            :precision="1"
            :step="0.5"
            :disabled="true"
          />
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

interface OvertimeItem {
  id: number
  type: string
  startTime: string
  endTime: string
  hours: number
  status: string
  remark: string
}

const showApplyDialog = ref(false)

const overtimeList = ref<OvertimeItem[]>([
  {
    id: 1,
    type: '日常加班',
    startTime: '2024-06-01 18:30',
    endTime: '2024-06-01 21:00',
    hours: 2.5,
    status: '已批准',
    remark: '项目紧急上线'
  },
  {
    id: 2,
    type: '周末加班',
    startTime: '2024-05-25 09:00',
    endTime: '2024-05-25 17:00',
    hours: 8,
    status: '审批中',
    remark: '系统维护'
  },
])

const formRef = ref()
const form = reactive({
  type: '',
  startTime: '',
  endTime: '',
  hours: 0.5,
  remark: ''
})

// 日期时间选择器限制
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

function handleTimeChange() {
  if (!form.startTime || !form.endTime) {
    form.hours = 0.5
    return
  }
  const start = new Date(form.startTime)
  const end = new Date(form.endTime)
  const diffHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
  form.hours = diffHours > 0 ? Number(diffHours.toFixed(1)) : 0.5
}

const rules = {
  type: [{ required: true, message: '请选择加班类型', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  remark: [{ max: 200, message: '备注最多200字', trigger: 'blur' }],
}

function resetForm() {
  form.type = ''
  form.startTime = ''
  form.endTime = ''
  form.hours = 0.5
  form.remark = ''
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

function submitForm() {
  if (!formRef.value) return

  formRef.value.validate((valid: boolean) => {
    if (valid) {
      overtimeList.value.push({
        id: Date.now(),
        type: form.type,
        startTime: form.startTime,
        endTime: form.endTime,
        hours: form.hours,
        status: '审批中',
        remark: form.remark
      })
      ElMessage.success('加班申请提交成功，等待审批')
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
.overtime-management {
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