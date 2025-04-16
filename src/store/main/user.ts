import { defineStore } from 'pinia';
import { LoginByPwdSvc } from '../../service/modules/auth/auth';
import { getUserDetailSvc } from '../../service/modules/user/user';
import type { IUserListResp } from '../../service/modules/user/types';
import type { ILoginByPwdRequest } from '../../service/modules/auth/types';

interface UserState {
  token: string;
  userInfo: IUserListResp | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null'),
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    getUserRole: (state) => state.userInfo?.role,
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

          // 获取并保存用户信息
          await this.fetchUserInfo();

          return true;
        }
        return false;
      } catch (error) {
        console.error('登录失败:', error);
        return false;
      }
    },

    async fetchUserInfo(): Promise<void> {
      try {
        const res = await getUserDetailSvc();
        if (res.data) {
          this.setUserInfo(res.data);
        }
      } catch (error) {
        console.error('获取用户信息失败:', error);
      }
    },

    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    },

    setUserInfo(userInfo: IUserListResp) {
      this.userInfo = userInfo;
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    },

    logout() {
      this.token = '';
      this.userInfo = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
    }
  }
});