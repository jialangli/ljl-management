<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>SSM人事管理系统</h2>
        <div class="login-type-switch">
          <el-radio-group v-model="loginType" size="large">
            <el-radio-button label="admin">管理员登录</el-radio-button>
            <el-radio-button label="employee">员工登录</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" class="login-form">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            :placeholder="loginType === 'admin' ? '管理员账号' : '员工工号'"
            prefix-icon="User"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="密码"
            prefix-icon="Lock"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            class="login-button"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>

      <div class="login-footer">
        <p v-if="loginType === 'admin'">管理员默认账号：admin，密码：admin123</p>
        <p v-else>员工请使用工号和密码登录</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import axios from 'axios'

const router = useRouter()
const loginFormRef = ref()
const loading = ref(false)
const loginType = ref('admin') // 默认管理员登录

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    await loginFormRef.value.validate()
    loading.value = true

    const apiUrl = 'http://47.115.160.54:28080/auth/login'

    const res = await axios.post(apiUrl, {
      username: loginForm.username,
      password: loginForm.password,
      userType: loginType.value
    })

    console.log('后端返回数据:', res.data)

    // 判断登录是否成功
    if (res.data && res.data.code === 200 && res.data.data && res.data.data.token) {
      // 存储Token
      localStorage.setItem('token', res.data.data.token)
      // 其他存储
      localStorage.setItem('userId', res.data.data.userId)
      localStorage.setItem('username', res.data.data.username)
      localStorage.setItem('realName', res.data.data.realName)
      localStorage.setItem('role', res.data.data.role)
      localStorage.setItem('userType', loginType.value)

      ElMessage.success('登录成功')

      // 根据角色跳转
      if (loginType.value === 'admin') {
        router.push('./admin')
      } else {
        router.push('./employee')
      }
    } else {
      // 登录失败，显示错误信息
      ElMessage.error('登录失败：' + (res.data.message || '未知错误'))
    }
  } catch (error: any) {
    console.error('请求错误:', error)
    if (error.response && error.response.data) {
      ElMessage.error('登录失败：' + (error.response.data.message || error.response.statusText))
    } else {
      ElMessage.error('登录失败：' + error.message)
    }
  } finally {
    loading.value = false
  }
}

</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('../assets/img/login-bg.svg');
  background-size: cover;
  background-position: center;
}

.login-box {
  width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #1890ff;
  margin-bottom: 20px;
}

.login-type-switch {
  margin-bottom: 20px;
}

.login-form {
  margin-top: 20px;
}

.login-button {
  width: 100%;
  height: 40px;
}

.login-footer {
  margin-top: 20px;
  text-align: center;
  color: #666;
  font-size: 14px;
}

:deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.8);
}

:deep(.el-input__inner) {
  height: 40px;
}

:deep(.el-radio-button__inner) {
  padding: 8px 20px;
}
</style>
