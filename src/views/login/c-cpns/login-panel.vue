<template>
  <div class="login-panel">
    <h1 class="title">管理端后台管理系统</h1>
    <div class="tabs">
      <el-tabs type="border-card" stretch v-model="activeName">
        <el-tab-pane name="account">
          <template #label>
            <div class="label">
              <el-icon><UserFilled /></el-icon>
              <span class="text">帐号登录</span>
            </div>
          </template>
          <pane-account ref="accountRef" />
        </el-tab-pane>
        <el-tab-pane name="phone">
          <template #label>
            <div class="label">
              <el-icon><Cellphone /></el-icon>
              <span class="text">手机登录</span>
            </div>
          </template>
          <pane-phone ref="phoneRef" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="controls">
      <el-checkbox v-model="isRemPwd" label="记住密码" size="large" />
      <el-link type="primary">忘记密码</el-link>
    </div>
    <el-button
      class="login-btn"
      type="primary"
      size="large"
      @click="handleLoginBtnClick"
    >
      立即登录
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { localCache } from '@/utils/cache'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import PaneAccount from './pane-account.vue'
import PanePhone from './pane-phone.vue'

const router = useRouter()

const activeName = ref('account')
const isRemPwd = ref<boolean>(localCache.getCache('isRemPwd') ?? false)

watch(isRemPwd, (newValue) => {
  localCache.setCache('isRemPwd', newValue)
})

const accountRef = ref<InstanceType<typeof PaneAccount>>()
const phoneRef = ref<InstanceType<typeof PanePhone>>()

async function handleLoginBtnClick() {
  try {
    if (activeName.value === 'account') {
      // 调用帐号登录
      await accountRef.value?.loginAction(isRemPwd.value)
    } else {
      // 调用手机登录
      await phoneRef.value?.loginAction(isRemPwd.value)
    }

    // 登录成功后跳转到 Main 页面
    router.push('/main') // 使用路径字符串
  } catch (error) {
    console.error('登录失败', error)
    // 这里可以添加用户友好的错误提示
  }
}
</script>

<style lang="less" scoped>
.login-panel {
  width: 330px;
  margin-bottom: 150px;

  .title {
    text-align: center;
    margin-bottom: 15px;
  }

  .label {
    display: flex;
    align-items: center;
    justify-content: center;

    .text {
      margin-left: 5px;
    }
  }

  .controls {
    margin-top: 12px;
    display: flex;

    justify-content: space-between;
  }

  .login-btn {
    margin-top: 10px;
    width: 100%;
  }
}
</style>
