import { defineStore } from 'pinia'
import { ref } from 'vue'
import { login, getUserInfo, logout } from '@/api/user'
import type { UserInfo, LoginParams } from '@/types/user'
import router from '@/router'
import { addRoutes } from '@/router'
import { ElMessage } from 'element-plus'

const TOKEN_KEY = 'user_token'
const USER_KEY = 'user_info'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY) || '')
  const userInfo = ref<UserInfo | null>(JSON.parse(localStorage.getItem(USER_KEY) || 'null'))
  const loading = ref(false)

  // 登录
  async function loginAction(loginForm: LoginParams) {
    loading.value = true
    try {
      const res = await login(loginForm)
      const { token: resToken, userInfo: resUserInfo } = res.data

      setToken(resToken)
      setUserInfo(resUserInfo)

      // 根据用户角色添加路由
      addRoutes(resUserInfo.role)

      ElMessage.success('登录成功')
      return Promise.resolve(resUserInfo)
    } catch (error) {
      return Promise.reject(error)
    } finally {
      loading.value = false
    }
  }

  // 获取用户信息
  async function getUserInfoAction() {
    if (!token.value) return null

    try {
      const res = await getUserInfo()
      const resUserInfo = res.data
      setUserInfo(resUserInfo)
      return resUserInfo
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // 退出登录
  async function logoutAction() {
    if (token.value) {
      try {
        await logout()
      } catch (error) {
        console.error('登出请求失败:', error)
      } finally {
        resetState()
        router.replace('/login')
      }
    }
  }

  // 设置token
  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem(TOKEN_KEY, newToken)
  }

  // 设置用户信息
  function setUserInfo(newUserInfo: UserInfo) {
    userInfo.value = newUserInfo
    localStorage.setItem(USER_KEY, JSON.stringify(newUserInfo))
  }

  // 重置状态
  function resetState() {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  return {
    token,
    userInfo,
    loading,
    loginAction,
    getUserInfoAction,
    logoutAction,
    setToken,
    setUserInfo,
    resetState
  }
})
