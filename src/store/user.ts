import { defineStore } from 'pinia'
import { User } from '../types'
import { userApi } from '../service/api'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: null as User | null,
  }),

  actions: {
    async login(username: string, password: string) {
      try {
        const res = await userApi.login(username, password)
        this.token = res.data.token
        localStorage.setItem('token', res.data.token)
        return true
      } catch (error) {
        return false
      }
    },

    async getUserInfo() {
      try {
        const res = await userApi.getUserList()
        this.userInfo = res.data
        return true
      } catch (error) {
        return false
      }
    },

    logout() {
      this.token = ''
      this.userInfo = null
      localStorage.removeItem('token')
    },
  },
})
