<template>
  <div class="main-menu">
    <div class="logo">
      <img
        class="img"
        src="D:\Desktop\tiktok\tiktok-mall\src\assets\img\img1.jpg"
        alt="logo"
      />
      <h2 class="title">用户信息管理系统</h2>
    </div>
    <div class="menu">
      <el-menu
        :default-active="defaultActive"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        :collapse="isFold"
        text-color="#b7bdc3"
        active-text-color="#fff"
        background-color="#001529"
      >
        <el-sub-menu index="1">
          <template #title>
            <el-icon><Files /></el-icon>
            <span>首页</span>
          </template>
          <el-menu-item-group title="商品管理">
            <el-menu-item index="1-1" @click="handleItemClick({ url: '/main/analysis/GoodList' })">商品列表</el-menu-item>
            <el-menu-item index="1-2" @click="handleItemClick({ url: '/main/analysis/GoodReview' })">商品审核</el-menu-item>
            <el-menu-item index="1-3" @click="handleItemClick({ url: '/main/analysis/GoodSets' })">商品设置</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="订单管理">
            <el-menu-item index="1-4" @click="handleItemClick({ url: '/main/analysis/ListMang' })">订单管理</el-menu-item>
          </el-menu-item-group>
          <el-sub-menu index="1-5">
            <template #title>分类列表</template>
            <el-menu-item index="1-5-1" @click="handleItemClick({ url: '/main/system/BrandList' })">品牌列表</el-menu-item>
            <el-menu-item index="1-5-2" @click="handleItemClick({ url: '/main/system/SpecList' })">规格列表</el-menu-item>
          </el-sub-menu>
        </el-sub-menu>
      </el-menu>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import useLoginStore from '@/store/login/login';
import { useRoute, useRouter } from 'vue-router';
import { Files, Money, User } from '@element-plus/icons-vue'; // 确保导入图标

// 使用登录状态的store
const loginStore = useLoginStore();
const router = useRouter();
const route = useRoute();

// 默认激活的菜单项
const defaultActive = computed(() => {
  return route.path; // 或者根据你的逻辑返回对应的 index
});

// 路由跳转处理
function handleItemClick(item: { url: string }) {
  router.push(item.url);
}

// 其他事件处理函数
function handleOpen() {
  // 处理打开子菜单的逻辑
}

function handleClose() {
  // 处理关闭子菜单的逻辑
}
</script>

<style lang="less" scoped>
.main-menu {
  height: 100%;
  background-color: skyblue;
}

.logo {
  display: flex;
  height: 28px;
  padding: 12px 10px 8px 10px;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;

  .img {
    height: 100%;
    margin: 0 10px;
  }

  .title {
    font-size: 16px;
    font-weight: 700;
    color: white;
    white-space: nowrap;
  }
}

.el-menu {
  border-right: none;
  user-select: none;
}

.el-sub-menu {
  .el-menu-item {
    padding-left: 50px !important;
    background-color: #fff;
  }

  .el-menu-item:hover {
    color: #fff;
  }

  .el-menu-item.is-active {
    background-color: #0a60bd;
  }
}
</style>
