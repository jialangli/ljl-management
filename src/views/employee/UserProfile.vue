<template>
  <div class="employee-profile">
    <!-- 个人信息卡片 -->
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
          <el-avatar :size="120" :src="employeeInfo.photo || defaultAvatar" />
          <div class="basic-info">
            <h3>{{ employeeInfo.name }}</h3>
            <p>{{ employeeInfo.position }}</p>
            <p>{{ employeeInfo.department }}</p>
          </div>
        </div>

        <el-descriptions :column="2" border class="info-details">
          <el-descriptions-item label="工号">{{ employeeInfo.employeeId }}</el-descriptions-item>
          <el-descriptions-item label="姓名">{{ employeeInfo.name }}</el-descriptions-item>
          <el-descriptions-item label="部门">{{ employeeInfo.department }}</el-descriptions-item>
          <el-descriptions-item label="职位">{{ employeeInfo.position }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ employeeInfo.gender }}</el-descriptions-item>
          <el-descriptions-item label="年龄">{{ employeeInfo.age }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ employeeInfo.phone }}</el-descriptions-item>
          <el-descriptions-item label="基本工资">{{ employeeInfo.baseSalary }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>

    <!-- 编辑信息对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="'编辑个人信息'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工号" prop="employeeId">
              <el-input v-model="form.employeeId" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="部门" prop="department">
              <el-select v-model="form.department" placeholder="请选择部门">
                <el-option
                  v-for="dept in departmentOptions"
                  :key="dept.value"
                  :label="dept.label"
                  :value="dept.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职位" prop="position">
              <el-input v-model="form.position" placeholder="请输入职位" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="性别" prop="gender">
              <el-radio-group v-model="form.gender">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="年龄" prop="age">
              <el-input-number v-model="form.age" :min="18" :max="65" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入手机号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="基本工资" prop="baseSalary">
              <el-input v-model="form.baseSalary" placeholder="请输入基本工资">
                <template #append>元</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="照片" prop="photo">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.photo" :src="form.photo" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit, Plus } from '@element-plus/icons-vue'
import defaultAvatar from '@/assets/default-avatar.png'

// 员工信息
const employeeInfo = reactive({
  employeeId: 'EMP10001',
  name: '张三',
  department: '技术部',
  position: '前端开发工程师',
  gender: '男',
  age: 28,
  phone: '13800138000',
  photo: '',
  baseSalary: '15000'
})

// 部门选项
const departmentOptions = [
  { value: '技术部', label: '技术部' },
  { value: '人事部', label: '人事部' },
  { value: '财务部', label: '财务部' },
  { value: '市场部', label: '市场部' },
  { value: '销售部', label: '销售部' }
]

// 对话框
const dialogVisible = ref(false)
const formRef = ref()

// 表单数据
const form = reactive({
  employeeId: '',
  name: '',
  department: '',
  position: '',
  gender: '',
  age: 0,
  phone: '',
  photo: '',
  baseSalary: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  department: [
    { required: true, message: '请选择部门', trigger: 'change' }
  ],
  position: [
    { required: true, message: '请输入职位', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  baseSalary: [
    { required: true, message: '请输入基本工资', trigger: 'blur' },
    { pattern: /^\d+$/, message: '请输入数字', trigger: 'blur' }
  ]
}

// 加载员工信息
const loadEmployeeInfo = () => {
  // TODO: 调用API获取员工信息
  // 模拟API返回
  Object.assign(employeeInfo, {
    employeeId: 'EMP10001',
    name: '张三',
    department: '技术部',
    position: '前端开发工程师',
    gender: '男',
    age: 28,
    phone: '13800138000',
    photo: '',
    baseSalary: '15000'
  })
}

// 编辑信息
const handleEdit = () => {
  dialogVisible.value = true
  Object.assign(form, employeeInfo)
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      // TODO: 调用API保存信息
      Object.assign(employeeInfo, form)
      ElMessage.success('保存成功')
      dialogVisible.value = false
    }
  })
}

// 头像上传成功
const handleAvatarSuccess = (response: any, file: File) => {
  form.photo = URL.createObjectURL(file.raw)
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