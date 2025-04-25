<template>
  <div class="employee-profile">
    <!-- 个人信息卡片 -->
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <span>个人信息</span>
          <el-button type="primary" @click="handleEdit">
            <el-icon>
              <Edit />
            </el-icon>编辑信息
          </el-button>
        </div>
      </template>

      <div class="profile-content">
        <div class="avatar-section">
          <el-avatar :size="120" :src="avatarVar" />
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

    <!-- 编辑信息对话框 -->
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
                <el-option v-for="dept in departmentOptions" :key="dept.value" :label="dept.label"
                  :value="dept.value" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="角色" prop="role">
              <el-select v-model="form.role" placeholder="请选择角色">
                <el-option v-for="role in roleOptions" :key="role.value" :label="role.label" :value="role.value" />
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
          <el-upload class="avatar-uploader" :action="uploadAvatarUrl" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :headers="uploadHeaders">
            <img v-if="form.avatar" :src="form.avatar" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { getUserAvatarSvc, getUserDetailSvc, updateUserSvc } from '@/service/modules/user/user'
import { localCache } from '@/utils/cache/cache'
import { Account_USER } from '@/utils/cache/keys'
import { Edit, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { useUserStore } from '../../store/main/user'


const userStore = useUserStore()




// 部门选项
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

// 获取用户信息
let employeeInfo = ref()
employeeInfo.value = localCache.getCache(Account_USER);

// 获取用户头像
const avatarVar = ref()
if (employeeInfo.value?.avatar) {
  getUserAvatarSvc(employeeInfo.value?.avatar)
    .then(blob => {
      if (!(blob instanceof Blob) || !blob.type.startsWith('image/')) {
        throw new Error('无效的图片格式')
      }

      URL.revokeObjectURL(avatarVar.value)
      avatarVar.value = URL.createObjectURL(blob)
    })
    .catch(error => {
      console.log(error)
      ElMessage.warning('头像加载失败')
    })
}

// 对话框
const dialogVisible = ref(false)
const formRef = ref()

// 表单数据
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
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
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
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ]
}

// 获取角色名称
const getRoleName = (role: number) => {
  const roleMap: Record<number, string> = {
    1: '管理员',
    0: '员工',

  }
  return roleMap[role] || '未知角色'
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleString()
}

// 加载员工信息
const loadEmployeeInfo = async () => {
  try {
    // 获取当前用户ID，这里假设编辑的是当前用户
    const userId = employeeInfo.value.id

    const res = await getUserDetailSvc(userId)

    if (res.code === 200 && res.data) {
      Object.assign(employeeInfo, res.data)
    } else {
      ElMessage.error(res.message || '获取用户信息失败')
    }
  } catch (error) {
    ElMessage.error('获取用户信息出错')
    console.error(error)
  }
}

// 编辑信息
const handleEdit = () => {
  dialogVisible.value = true
  Object.assign(form, employeeInfo)
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

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
      dialogVisible.value = false
      loadEmployeeInfo() // 刷新数据
    } else {
      ElMessage.error(res.message || '更新失败')
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 头像上传成功
const handleAvatarSuccess = async (response: any) => {
  if (response.code === 200) {
    form.avatar = response.data
    ElMessage.success('头像上传成功')
  } else {
    ElMessage.error(response.message || '头像上传失败')
  }
}

// 头像上传前校验
const beforeAvatarUpload = (file: File) => {
  const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPGOrPNG) {
    ElMessage.error('上传头像图片只能是 JPG/PNG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传头像图片大小不能超过 2MB!')
  }
  return isJPGOrPNG && isLt2M
}

onMounted(() => {
  loadEmployeeInfo()
})
</script>

<style scoped>
/* 保持原有的样式不变 */
.employee-profile {
  padding: 20px;
}

.profile-card {
  max-width: 900px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-content {
  padding: 20px;
}

.avatar-section {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
}

.basic-info {
  margin-left: 30px;
}

.basic-info h3 {
  margin: 0 0 10px 0;
  font-size: 24px;
}

.basic-info p {
  margin: 5px 0;
  color: #666;
}

.info-details {
  margin-top: 20px;
}

.avatar-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 120px;
  height: 120px;
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
}
</style>
