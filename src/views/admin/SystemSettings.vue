<template>
  <div class="system-settings">
    <el-tabs v-model="activeTab">
      <!-- 基本设置 -->
      <el-tab-pane label="基本设置" name="basic">
        <el-form
          ref="basicFormRef"
          :model="basicForm"
          :rules="basicRules"
          label-width="120px"
        >
          <el-form-item label="系统名称" prop="systemName">
            <el-input v-model="basicForm.systemName" />
          </el-form-item>
          <el-form-item label="系统Logo">
            <el-upload
              class="avatar-uploader"
              action="/api/upload"
              :show-file-list="false"
              :on-success="handleLogoSuccess"
              :before-upload="beforeLogoUpload"
            >
              <img v-if="basicForm.logo" :src="basicForm.logo" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item>
          <el-form-item label="系统描述" prop="description">
            <el-input
              v-model="basicForm.description"
              type="textarea"
              :rows="3"
            />
          </el-form-item>
          <el-form-item label="版权信息" prop="copyright">
            <el-input v-model="basicForm.copyright" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleBasicSubmit">保存设置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 考勤设置 -->
      <el-tab-pane label="考勤设置" name="attendance">
        <el-form
          ref="attendanceFormRef"
          :model="attendanceForm"
          :rules="attendanceRules"
          label-width="120px"
        >
          <el-form-item label="工作日设置">
            <el-checkbox-group v-model="attendanceForm.workdays">
              <el-checkbox label="1">周一</el-checkbox>
              <el-checkbox label="2">周二</el-checkbox>
              <el-checkbox label="3">周三</el-checkbox>
              <el-checkbox label="4">周四</el-checkbox>
              <el-checkbox label="5">周五</el-checkbox>
              <el-checkbox label="6">周六</el-checkbox>
              <el-checkbox label="7">周日</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="上班时间" prop="workStartTime">
            <el-time-picker
              v-model="attendanceForm.workStartTime"
              format="HH:mm"
              placeholder="选择时间"
            />
          </el-form-item>
          <el-form-item label="下班时间" prop="workEndTime">
            <el-time-picker
              v-model="attendanceForm.workEndTime"
              format="HH:mm"
              placeholder="选择时间"
            />
          </el-form-item>
          <el-form-item label="迟到时间(分钟)" prop="lateThreshold">
            <el-input-number
              v-model="attendanceForm.lateThreshold"
              :min="0"
              :max="120"
            />
          </el-form-item>
          <el-form-item label="早退时间(分钟)" prop="earlyThreshold">
            <el-input-number
              v-model="attendanceForm.earlyThreshold"
              :min="0"
              :max="120"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleAttendanceSubmit">保存设置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 请假设置 -->
      <el-tab-pane label="请假设置" name="leave">
        <el-form
          ref="leaveFormRef"
          :model="leaveForm"
          :rules="leaveRules"
          label-width="120px"
        >
          <el-form-item label="年假天数" prop="annualLeaveDays">
            <el-input-number
              v-model="leaveForm.annualLeaveDays"
              :min="0"
              :max="365"
            />
          </el-form-item>
          <el-form-item label="事假天数限制" prop="personalLeaveLimit">
            <el-input-number
              v-model="leaveForm.personalLeaveLimit"
              :min="0"
              :max="365"
            />
          </el-form-item>
          <el-form-item label="病假天数限制" prop="sickLeaveLimit">
            <el-input-number
              v-model="leaveForm.sickLeaveLimit"
              :min="0"
              :max="365"
            />
          </el-form-item>
          <el-form-item label="调休有效期(天)" prop="compensatoryValidDays">
            <el-input-number
              v-model="leaveForm.compensatoryValidDays"
              :min="0"
              :max="365"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleLeaveSubmit">保存设置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <!-- 通知设置 -->
      <el-tab-pane label="通知设置" name="notification">
        <el-form
          ref="notificationFormRef"
          :model="notificationForm"
          label-width="120px"
        >
          <el-form-item label="邮件通知">
            <el-switch v-model="notificationForm.emailEnabled" />
          </el-form-item>
          <el-form-item label="SMTP服务器" v-if="notificationForm.emailEnabled">
            <el-input v-model="notificationForm.smtpServer" />
          </el-form-item>
          <el-form-item label="SMTP端口" v-if="notificationForm.emailEnabled">
            <el-input-number v-model="notificationForm.smtpPort" :min="1" :max="65535" />
          </el-form-item>
          <el-form-item label="发件人邮箱" v-if="notificationForm.emailEnabled">
            <el-input v-model="notificationForm.senderEmail" />
          </el-form-item>
          <el-form-item label="短信通知">
            <el-switch v-model="notificationForm.smsEnabled" />
          </el-form-item>
          <el-form-item label="短信API地址" v-if="notificationForm.smsEnabled">
            <el-input v-model="notificationForm.smsApiUrl" />
          </el-form-item>
          <el-form-item label="短信API密钥" v-if="notificationForm.smsEnabled">
            <el-input v-model="notificationForm.smsApiKey" type="password" show-password />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleNotificationSubmit">保存设置</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

// 当前激活的标签页
const activeTab = ref('basic')

// 基本设置表单
const basicFormRef = ref()
const basicForm = reactive({
  systemName: 'SSM人事管理系统',
  logo: '',
  description: '一个现代化的企业人事管理系统',
  copyright: '© 2024 SSM人事管理系统 版权所有'
})

const basicRules = {
  systemName: [
    { required: true, message: '请输入系统名称', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入系统描述', trigger: 'blur' }
  ],
  copyright: [
    { required: true, message: '请输入版权信息', trigger: 'blur' }
  ]
}

// 考勤设置表单
const attendanceFormRef = ref()
const attendanceForm = reactive({
  workdays: ['1', '2', '3', '4', '5'],
  workStartTime: new Date(2024, 0, 1, 9, 0),
  workEndTime: new Date(2024, 0, 1, 18, 0),
  lateThreshold: 15,
  earlyThreshold: 15
})

const attendanceRules = {
  workdays: [
    { required: true, message: '请选择工作日', trigger: 'change' }
  ],
  workStartTime: [
    { required: true, message: '请选择上班时间', trigger: 'change' }
  ],
  workEndTime: [
    { required: true, message: '请选择下班时间', trigger: 'change' }
  ]
}

// 请假设置表单
const leaveFormRef = ref()
const leaveForm = reactive({
  annualLeaveDays: 5,
  personalLeaveLimit: 10,
  sickLeaveLimit: 15,
  compensatoryValidDays: 30
})

const leaveRules = {
  annualLeaveDays: [
    { required: true, message: '请设置年假天数', trigger: 'blur' }
  ],
  personalLeaveLimit: [
    { required: true, message: '请设置事假天数限制', trigger: 'blur' }
  ],
  sickLeaveLimit: [
    { required: true, message: '请设置病假天数限制', trigger: 'blur' }
  ]
}

// 通知设置表单
const notificationFormRef = ref()
const notificationForm = reactive({
  emailEnabled: false,
  smtpServer: '',
  smtpPort: 465,
  senderEmail: '',
  smsEnabled: false,
  smsApiUrl: '',
  smsApiKey: ''
})

// Logo上传相关方法
const handleLogoSuccess = (response: any) => {
  basicForm.logo = response.url
  ElMessage.success('Logo上传成功')
}

const beforeLogoUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('上传Logo只能是图片格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传Logo大小不能超过 2MB!')
    return false
  }
  return true
}

// 提交方法
const handleBasicSubmit = async () => {
  if (!basicFormRef.value) return

  await basicFormRef.value.validate((valid: boolean) => {
    if (valid) {
      // TODO: 调用保存接口
      ElMessage.success('基本设置保存成功')
    }
  })
}

const handleAttendanceSubmit = async () => {
  if (!attendanceFormRef.value) return

  await attendanceFormRef.value.validate((valid: boolean) => {
    if (valid) {
      // TODO: 调用保存接口
      ElMessage.success('考勤设置保存成功')
    }
  })
}

const handleLeaveSubmit = async () => {
  if (!leaveFormRef.value) return

  await leaveFormRef.value.validate((valid: boolean) => {
    if (valid) {
      // TODO: 调用保存接口
      ElMessage.success('请假设置保存成功')
    }
  })
}

const handleNotificationSubmit = async () => {
  if (!notificationFormRef.value) return

  await notificationFormRef.value.validate((valid: boolean) => {
    if (valid) {
      // TODO: 调用保存接口
      ElMessage.success('通知设置保存成功')
    }
  })
}
</script>

<style scoped>
.system-settings {
  padding: 20px;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}

.avatar-uploader:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  line-height: 178px;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

:deep(.el-form-item) {
  max-width: 500px;
}

:deep(.el-checkbox-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
