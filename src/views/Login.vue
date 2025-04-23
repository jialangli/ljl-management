<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2>SSM人事管理系统</h2>
        <div class="login-type-switch">
          <el-radio-group v-model="loginType" size="large">
            <el-radio-button value="admin">管理员登录</el-radio-button>
            <el-radio-button value="employee">员工登录</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" class="login-form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" :placeholder="loginType === 'admin' ? '管理员账号' : '员工工号'"
            prefix-icon="User" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="密码" prefix-icon="Lock"
            @keyup.enter="handleLogin" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" class="login-button" @click="handleLogin">
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
import { addRoutes } from '@/router'; // 确保路径正确
import { LoginByPwdSvc } from '@/service/modules/auth/auth'; // 引入登录服务
import { localCache } from '@/utils/cache/cache'; // 本地缓存工具
import { Account_TOKEN, Account_Type } from '@/utils/cache/keys'; // 本地缓存 key
import { ElMessage } from 'element-plus'; 
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const loginFormRef = ref();
const loading = ref(false);
const loginType = ref('admin'); // 默认管理员登录
const loginForm = reactive({
  username: '',
  password: ''
});

const rules = {
  username: [
    { required: true, message: '请输入账号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
};

// 1. 定义写死的员工账号和密码
const hardcodedEmployeeUsername = 'cjh'; // 替换成你想要的员工账号
const hardcodedEmployeePassword = 'cjh123456'; // 替换成你想要的员工密码

const handleLogin = async () => {
  try {
    await loginFormRef.value.validate();
    loading.value = true;

    // 2. 判断是否是写死的员工账号密码
    if (loginType.value === 'employee' &&
      loginForm.username === hardcodedEmployeeUsername &&
      loginForm.password === hardcodedEmployeePassword) {
      console.log('使用写死的员工账号登录成功！');
      // 3. 存储 Token 和账号类型（这里只是模拟，真实项目中需要从后端获取）
      localCache.setCache(Account_TOKEN, 'hardcoded-employee-token'); // 模拟 Token
      localCache.setCache(Account_Type, 'employee');

      // 4. 添加员工路由
      addRoutes('employee');

      // 5. 跳转到员工 dashboard
      await router.push('/employee/dashboard');
      ElMessage.success('登录成功 (使用写死的账号)');
      loading.value = false;
      return;
    }

    // 如果不是写死的账号，则调用后端接口
    const res = await LoginByPwdSvc({
      username: loginForm.username,
      password: loginForm.password,
    });

    if (res.code === 200 && res.data?.token) {
      // 如果登录成功，存储 Token 和账号类型
      localCache.setCache(Account_TOKEN, res.data?.token);
      localCache.setCache(Account_Type, loginType.value);

      // 动态添加路由
      addRoutes(loginType.value);

      const targetPath = loginType.value === 'admin'
        ? '/admin/dashboard'
        : '/employee/dashboard';

      await router.push(targetPath); // 加 await 确保跳转完成
      ElMessage.success('登录成功');
    } else {
      ElMessage.error(res.message || '登录失败');
    }
  } catch (error) {
    console.error("跳转出错:", error); // 捕获路由跳转错误
    ElMessage.error(error.message);
  } finally {
    loading.value = false;
  }
};

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

