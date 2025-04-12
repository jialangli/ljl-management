<template>
  <div class="user-profile">
    <el-card class="profile-card">
      <template #header>
        <div class="card-header">
          <span>个人信息</span>
          <el-button
            type="primary"
            size="small"
            @click="isEditing = !isEditing"
          >
            {{ isEditing ? '取消' : '编辑' }}
          </el-button>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="userForm"
        :rules="formRules"
        label-width="100px"
        :disabled="!isEditing"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="userForm.username" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色">
              <el-tag :type="userForm.role === 'admin' ? 'danger' : 'success'">
                {{ userForm.role === 'admin' ? '管理员' : '员工' }}
              </el-tag>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="真实姓名" prop="realName">
              <el-input v-model="userForm.realName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="userForm.email" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="电话号码" prop="phone">
              <el-input v-model="userForm.phone" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="department">
              <el-input v-model="userForm.department" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="职位" prop="position">
              <el-input v-model="userForm.position" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="isEditing">
          <el-col :span="24">
            <el-form-item>
              <el-button type="primary" @click="handleUpdateInfo" :loading="isSubmitting">保存</el-button>
              <el-button @click="isEditing = false">取消</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="password-card">
      <template #header>
        <div class="card-header">
          <span>修改密码</span>
        </div>
      </template>

      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="100px"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            show-password
            placeholder="请输入原密码"
          />
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            show-password
            placeholder="请输入新密码"
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            show-password
            placeholder="请再次输入新密码"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="handleChangePassword"
            :loading="isPasswordSubmitting"
          >
            修改密码
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { updateUserInfo, changePassword } from '@/api/user'
import type { FormInstance } from 'element-plus'

const userStore = useUserStore()
const formRef = ref<FormInstance>()
const passwordFormRef = ref<FormInstance>()
const isEditing = ref(false)
const isSubmitting = ref(false)
const isPasswordSubmitting = ref(false)

// 获取当前用户信息
const userInfo = computed(() => userStore.userInfo)

// 用户信息表单
const userForm = reactive({
  username: userInfo.value?.username || '',
  realName: userInfo.value?.realName || '',
  email: userInfo.value?.email || '',
  phone: userInfo.value?.phone || '',
  department: userInfo.value?.department || '',
  position: userInfo.value?.position || '',
  role: userInfo.value?.role || ''
})

// 密码表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 表单校验规则
const formRules = {
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在2-20个字符之间', trigger: 'blur' }
  ],
  email: [
    { required: false, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: false, message: '请输入电话号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
}

// 密码校验规则
const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20个字符之间', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20个字符之间', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 组件挂载时，获取最新的用户信息
onMounted(async () => {
  try {
    const userInfo = await userStore.getUserInfoAction()
    if (userInfo) {
      Object.assign(userForm, {
        username: userInfo.username,
        realName: userInfo.realName,
        email: userInfo.email,
        phone: userInfo.phone,
        department: userInfo.department,
        position: userInfo.position,
        role: userInfo.role
      })
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
})

// 更新用户信息
const handleUpdateInfo = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        isSubmitting.value = true

        const updateData = {
          realName: userForm.realName,
          email: userForm.email,
          phone: userForm.phone,
          department: userForm.department,
          position: userForm.position
        }

        await updateUserInfo(updateData)

        // 更新存储的用户信息
        await userStore.getUserInfoAction()

        ElMessage.success('个人信息更新成功')
        isEditing.value = false
      } catch (error) {
        console.error('更新用户信息失败:', error)
        ElMessage.error('更新用户信息失败')
      } finally {
        isSubmitting.value = false
      }
    }
  })
}

// 修改密码
const handleChangePassword = async () => {
  if (!passwordFormRef.value) return

  await passwordFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        isPasswordSubmitting.value = true

        await changePassword({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        })

        ElMessage.success('密码修改成功，请重新登录')

        // 清空表单
        passwordForm.oldPassword = ''
        passwordForm.newPassword = ''
        passwordForm.confirmPassword = ''

        // 重置表单校验
        passwordFormRef.value?.resetFields()

        // 退出登录
        setTimeout(() => {
          userStore.logoutAction()
        }, 1500)
      } catch (error) {
        console.error('修改密码失败:', error)
        ElMessage.error('修改密码失败，请检查原密码是否正确')
      } finally {
        isPasswordSubmitting.value = false
      }
    }
  })
}
</script>

<style scoped>
.user-profile {
  padding: 20px;
}

.profile-card,
.password-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-form {
  margin-top: 20px;
}
</style>
