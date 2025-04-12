<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <span>SSM人事管理系统</span>
        </div>
      </template>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        class="login-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleLogin"
            class="login-button"
            :loading="userStore.loading"
          >
            登录
          </el-button>
        </el-form-item>
        <div class="temp-login-buttons">
          <el-button type="success" @click="handleTempAdminLogin">
            管理临时登录
          </el-button>
          <el-button type="warning" @click="handleTempEmployeeLogin">
            员工临时登录
          </el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { addRoutes } from '@/router'
import type { FormInstance } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref<FormInstance>()

const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3-20个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6-20个字符之间', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        await userStore.loginAction(form)
        router.replace('/')
      } catch (error) {
        console.error('登录失败:', error)
        ElMessage.error('用户名或密码错误')
      }
    }
  })
}

const handleTempAdminLogin = () => {
  userStore.setToken('admin-temp-token')
  userStore.setUserInfo({
    id: 1,
    username: 'admin',
    realName: '管理员',
    role: 'admin',
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  })
  const routes = addRoutes('admin')
  console.log('添加的管理员路由:', routes)
  ElMessage.success('管理员临时登录成功')
  setTimeout(() => {
    router.replace('/')
  }, 300)
}

const handleTempEmployeeLogin = () => {
  userStore.setToken('employee-temp-token')
  userStore.setUserInfo({
    id: 2,
    username: 'employee',
    realName: '员工',
    role: 'employee',
    createTime: new Date().toISOString(),
    updateTime: new Date().toISOString()
  })
  const routes = addRoutes('employee')
  console.log('添加的员工路由:', routes)
  ElMessage.success('员工临时登录成功')
  setTimeout(() => {
    router.replace('/')
  }, 300)
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.login-card {
  width: 400px;
}

.card-header {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}

.login-form {
  margin-top: 20px;
}

.login-button {
  width: 100%;
}

.temp-login-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.temp-login-buttons .el-button {
  flex: 1;
  margin: 0 5px;
}
</style>
