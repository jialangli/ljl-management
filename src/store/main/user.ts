import { defineStore } from 'pinia';
import { LoginByPwdSvc } from '../../service/modules/auth/auth';
import { getUserDetailSvc } from '../../service/modules/user/user';
import type { IUserListResp } from '../../service/modules/user/types';
import type { ILoginByPwdRequest } from '../../service/modules/auth/types';
import { Account_TOKEN, Account_USER } from '@/utils/cache/keys';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    userInfo: null as IUserListResp | null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
  },

  actions: {
    async login(username: string, password: string): Promise<boolean> {
      try {
        const res = await LoginByPwdSvc({
          username,
          password
        });

        if (res.code === 200 && res.data?.token) {
          // 保存token
          this.setToken(res.data.token);
          return true;
        }
        return false;
      } catch (error) {
        console.error('登录失败:', error);
        return false;
      }
    },

    setToken(token: string) {
      this.token = token;
      localStorage.setItem(Account_TOKEN, token);
    },

    setUserInfo(userInfo: IUserListResp) {
      this.userInfo = userInfo;
      localStorage.setItem(Account_USER, JSON.stringify(userInfo));
    },

    logout() {
      this.token = '';
      this.userInfo = null;
      localStorage.removeItem(Account_TOKEN);
      localStorage.removeItem(Account_USER);
    }
  }
});