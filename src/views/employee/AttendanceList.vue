<template>
  <div class="attendance-management">
    <el-card class="card">
      <div slot="header" class="card-header">
        <span>员工考勤管理</span>
      </div>

      <!-- 打卡区域 -->
      <div class="punch-card">
        <el-button
          type="primary"
          :disabled="hasClockIn"
          @click="clockIn"
        >
          上班打卡
        </el-button>
        <el-button
          type="success"
          :disabled="!hasClockIn || hasClockOut"
          @click="clockOut"
        >
          下班打卡
        </el-button>
        <div class="status">
          <p>今日状态：</p>
          <p v-if="hasClockIn">已打上班卡：{{ clockInTime }}</p>
          <p v-if="hasClockOut">已打下班卡：{{ clockOutTime }}</p>
          <p v-if="!hasClockIn">未打上班卡</p>
        </div>
      </div>

      <!-- 申请区 -->
      <div class="application-actions">
        <el-button type="warning" @click="showLeaveDialog = true">请假申请</el-button>
        <el-button type="warning" @click="showOvertimeDialog = true">加班申请</el-button>
      </div>

      <!-- 请假申请弹窗 -->
      <el-dialog
        v-model="showLeaveDialog"
        title="请假申请"
        width="500px"
        :before-close="resetLeaveForm"
      >
        <el-form :model="leaveForm" ref="leaveFormRef" label-width="80px">
          <el-form-item label="类型" prop="type" :rules="[{ required: true, message: '请选择类型', trigger: 'change' }]">
            <el-select v-model="leaveForm.type" placeholder="请选择">
              <el-option label="事假" value="personal"></el-option>
              <el-option label="病假" value="sick"></el-option>
              <el-option label="年假" value="annual"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间" prop="startTime" :rules="[{ required: true, message: '请选择开始时间', trigger: 'change' }]">
            <el-date-picker v-model="leaveForm.startTime" type="datetime" placeholder="选择开始时间" style="width: 100%;"/>
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime" :rules="[{ required: true, message: '请选择结束时间', trigger: 'change' }]">
            <el-date-picker v-model="leaveForm.endTime" type="datetime" placeholder="选择结束时间" style="width: 100%;"/>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="leaveForm.remark" type="textarea" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showLeaveDialog = false">取消</el-button>
          <el-button type="primary" @click="submitLeave">提交</el-button>
        </div>
      </el-dialog>

      <!-- 加班申请弹窗 -->
      <el-dialog
        v-model="showOvertimeDialog"
        title="加班申请"
        width="500px"
        :before-close="resetOvertimeForm"
      >
        <el-form :model="overtimeForm" ref="overtimeFormRef" label-width="80px">
          <el-form-item label="日期" prop="date" :rules="[{ required: true, message: '请选择日期', trigger: 'change' }]">
            <el-date-picker v-model="overtimeForm.date" type="date" placeholder="选择日期" style="width: 100%;"/>
          </el-form-item>
          <el-form-item label="加班时间" prop="hours" :rules="[{ required: true, message: '请输入加班小时数', trigger: 'blur' }]">
            <el-input-number v-model="overtimeForm.hours" :min="1" :max="24" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="overtimeForm.remark" type="textarea" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showOvertimeDialog = false">取消</el-button>
          <el-button type="primary" @click="submitOvertime">提交</el-button>
        </div>
      </el-dialog>

      <!-- 申请记录表 -->
      <el-table :data="applicationRecords" style="margin-top:20px" stripe>
        <el-table-column prop="type" label="类型" width="100"/>
        <el-table-column prop="category" label="类别" width="120"/>
        <el-table-column prop="startTime" label="开始时间" width="180"/>
        <el-table-column prop="endTime" label="结束时间" width="180"/>
        <el-table-column prop="hours" label="小时" width="80"/>
        <el-table-column prop="status" label="状态" width="100"/>
        <el-table-column label="操作" width="120" v-slot="scope">
          <el-button
            v-if="scope.row.status === '待审核'"
            size="mini"
            type="text"
            @click="handleApprove(scope.row)"
          >审核</el-button>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 打卡状态
const hasClockIn = ref(false)
const hasClockOut = ref(false)
const clockInTime = ref('')
const clockOutTime = ref('')

// 打卡按钮
function clockIn() {
  hasClockIn.value = true
  clockInTime.value = new Date().toLocaleString()
  ElMessage.success('上班打卡成功')
}
function clockOut() {
  hasClockOut.value = true
  clockOutTime.value = new Date().toLocaleString()
  ElMessage.success('下班打卡成功')
}

// 请假申请
const showLeaveDialog = ref(false)
const leaveFormRef = ref()
const leaveForm = reactive({
  type: '',
  startTime: '',
  endTime: '',
  remark: ''
})
function resetLeaveForm() {
  leaveForm.type = ''
  leaveForm.startTime = ''
  leaveForm.endTime = ''
  leaveForm.remark = ''
}
function submitLeave() {
  leaveFormRef.value.validate((valid: boolean) => {
    if (valid) {
      // 模拟提交
      applicationRecords.value.push({
        type: '请假',
        category: leaveForm.type,
        startTime: leaveForm.startTime,
        endTime: leaveForm.endTime,
        hours: '',
        status: '待审核'
      })
      ElMessage.success('请假申请已提交')
      showLeaveDialog.value = false
      resetLeaveForm()
    }
  })
}

// 加班申请
const showOvertimeDialog = ref(false)
const overtimeFormRef = ref()
const overtimeForm = reactive({
  date: '',
  hours: 8,
  remark: ''
})
function resetOvertimeForm() {
  overtimeForm.date = ''
  overtimeForm.hours = 8
  overtimeForm.remark = ''
}
function submitOvertime() {
  overtimeFormRef.value.validate((valid: boolean) => {
    if (valid) {
      // 模拟提交
      applicationRecords.value.push({
        type: '加班',
        category: '',
        startTime: '',
        endTime: '',
        hours: overtimeForm.hours,
        status: '待审核'
      })
      ElMessage.success('加班申请已提交')
      showOvertimeDialog.value = false
      resetOvertimeForm()
    }
  })
}

// 申请记录
const applicationRecords = ref([
  // 示例数据
  { type: '请假', category: '事假', startTime: '2023-10-10 09:00', endTime: '2023-10-10 18:00', hours: '', status: '已通过' },
  { type: '加班', category: '', startTime: '', endTime: '', hours: 2, status: '待审核' }
])

// 审核操作
function handleApprove(record: any) {
  // 弹出确认框
  ElMessageBox.confirm('确定审核通过吗？', '审核', {
    confirmButtonText: '通过',
    cancelButtonText: '拒绝',
    type: 'warning'
  }).then(() => {
    record.status = '已通过'
    ElMessage.success('审核已通过')
  }).catch(() => {
    record.status = '未通过'
    ElMessage.info('审核已拒绝')
  })
}
</script>

<style scoped>
.attendance-management {
  max-width: 900px;
  margin: 20px auto;
}
.card {
  padding: 20px;
}
.punch-card {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}
.status {
  margin-left: 20px;
}
.application-actions {
  margin-top: 20px;
  display: flex;
  gap: 20px;
}
</style>
