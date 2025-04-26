<template>
  <div class="employee-profile">
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <span>个人信息</span>
          <el-button type="primary" @click="handleEdit">
            <el-icon><Edit /></el-icon>编辑信息
          </el-button>
        </div>
      </template>

      <div class="profile-content">
        <div class="avatar-section">
          <el-avatar :size="120" :src="avatarUrl" />
          <div class="basic-info">
            <h3>{{ employeeInfo.realName }}</h3>
            <p>{{ employeeInfo.deptName }}</p>
            <p>{{ getRoleName(employeeInfo.role) }}</p>
          </div>
        </div>

        <el-descriptions :column="2" border class="info-details">
          <el-descriptions-item label="用户ID">{{ employeeInfo.id }}</el-descriptions-item>
          <el-descriptions-item label="用户名">{{ employeeInfo.username }}</el-descriptions-item>
          <el-descriptions-item label="真实姓名">{{ employeeInfo.realName }}</el-descriptions-item>
          <el-descriptions-item label="部门">{{ employeeInfo.deptName }}</el-descriptions-item>
          <el-descriptions-item label="角色">{{ getRoleName(employeeInfo.role) }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ employeeInfo.phone }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ employeeInfo.email }}</el-descriptions-item>
          <el-descriptions-item label="注册时间">{{ formatDate(employeeInfo.createTime) }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="'编辑个人信息'" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户ID" prop="id">
              <el-input v-model="form.id" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="真实姓名" prop="realName">
              <el-input v-model="form.realName" placeholder="请输入真实姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="deptId">
              <el-select v-model="form.deptId" placeholder="请选择部门">
                <el-option 
                  v-for="dept in departmentOptions" 
                  :key="dept.value" 
                  :label="dept.label"
                  :value="dept.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="角色" prop="role">
              <el-select v-model="form.role" placeholder="请选择角色">
                <el-option 
                  v-for="role in roleOptions" 
                  :key="role.value" 
                  :label="role.label" 
                  :value="role.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>

        <el-form-item label="头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            :action="uploadAvatarUrl"
            :headers="uploadHeaders"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-error="handleUploadError"
          >
            <img v-if="form.avatar" :src="form.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Plus } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import type { UploadProps } from 'element-plus'
import { 
  getUserAvatarSvc, 
  getUserDetailSvc, 
  updateUserSvc 
} from '@/service/modules/user/user'
import { localCache } from '@/utils/cache/cache'
import { Account_USER } from '@/utils/cache/keys'

interface IUpdateEmployeeReq {
  id?: number
  username?: string
  realName: string
  deptId: number
  role: number
  phone: string
  email: string
  avatar?: string
}

// 部门选项（实际应从接口获取）
const departmentOptions = [
  { value: 1, label: '技术部' },
  { value: 2, label: '人事部' },
  { value: 3, label: '财务部' },
  { value: 4, label: '市场部' },
  { value: 5, label: '销售部' }
]

// 角色选项
const roleOptions = [
  { value: 1, label: '管理员' },
  { value: 2, label: '部门经理' },
  { value: 3, label: '普通员工' }
]

// 用户信息
const employeeInfo = ref(localCache.getCache(Account_USER) || {})
const avatarUrl = ref('')

// 获取头像
const loadAvatar = async () => {
  try {
    if (employeeInfo.value?.avatar) {
      const blob = await getUserAvatarSvc(employeeInfo.value.avatar)
      avatarUrl.value = URL.createObjectURL(blob)
    }
  } catch (error) {
    console.error('头像加载失败:', error)
    avatarUrl.value = '/default-avatar.png'
  }
}

// 编辑相关
const dialogVisible = ref(false)
const formRef = ref()
const form = reactive<IUpdateEmployeeReq>({
  id: 0,
  username: '',
  realName: '',
  deptId: 0,
  role: 0,
  phone: '',
  email: '',
  avatar: ''
})

// 表单验证规则
const rules = {
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在2到10个字符', trigger: 'blur' }
  ],
  deptId: [
    { required: true, message: '请选择部门', trigger: 'change' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ]
}

// 角色映射
const getRoleName = (role: number) => {
  const roleMap: Record<number, string> = {
    1: '管理员',
    2: '部门经理',
    3: '普通员工'
  }
  return roleMap[role] || '未知角色'
}

// 日期格式化
const formatDate = (dateString: string) => {
  return dateString ? dayjs(dateString).format('YYYY-MM-DD HH:mm') : '--'
}

// 加载用户信息
const loadEmployeeInfo = async () => {
  try {
    const res = await getUserDetailSvc(employeeInfo.value.id)
    if (res.code === 200) {
      Object.assign(employeeInfo.value, res.data)
      loadAvatar()
    }
  } catch (error) {
    ElMessage.error('获取用户信息失败')
  }
}

// 打开编辑对话框
const handleEdit = () => {
  dialogVisible.value = true
  Object.assign(form, employeeInfo.value)
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    
    const params: IUpdateEmployeeReq = {
      realName: form.realName,
      deptId: form.deptId,
      role: form.role,
      phone: form.phone,
      email: form.email,
      avatar: form.avatar
    }

    const res = await updateUserSvc(form.id!, params)
    if (res.code === 200) {
      ElMessage.success('更新成功')
      await loadEmployeeInfo()
      dialogVisible.value = false
    }
  } catch (error) {
    console.error('表单提交失败:', error)
  }
}

// 头像上传处理
const uploadAvatarUrl = import.meta.env.VITE_UPLOAD_URL + '/avatar'
const uploadHeaders = {
  Authorization: 'Bearer ' + localCache.getCache('token')
}

const handleAvatarSuccess: UploadProps['onSuccess'] = (res) => {
  if (res.code === 200) {
    form.avatar = res.data
    employeeInfo.value.avatar = res.data
    ElMessage.success('头像更新成功')
  }
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (file) => {
  const isImage = ['image/jpeg', 'image/png'].includes(file.type)
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) ElMessage.error('仅支持JPG/PNG格式!')
  if (!isLt2M) ElMessage.error('图片大小不能超过2MB!')
  return isImage && isLt2M
}

const handleUploadError = () => {
  ElMessage.error('头像上传失败，请重试')
}

// 清理资源
onBeforeUnmount(() => {
  if (avatarUrl.value) {
    URL.revokeObjectURL(avatarUrl.value)
  }
})

// 初始化加载
onMounted(() => {
  loadEmployeeInfo()
})
</script>

<style scoped>
.employee-profile {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.profile-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  font-size: 18px;
}

.profile-content {
  padding: 24px;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 40px;
  margin-bottom: 32px;
}

.basic-info h3 {
  margin: 0 0 12px 0;
  font-size: 24px;
  color: #303133;
}

.basic-info p {
  margin: 8px 0;
  font-size: 14px;
  color: #606266;
}

.info-details {
  :deep(.el-descriptions__label) {
    width: 100px;
    font-weight: 500;
  }
}

.avatar-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  width: 120px;
  height: 120px;
  transition: border-color 0.3s;

  &:hover {
    border-color: var(--el-color-primary);
  }
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

@media (max-width: 768px) {
  .avatar-section {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }

  .profile-content {
    padding: 16px;
  }

  .card-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
}
</style>