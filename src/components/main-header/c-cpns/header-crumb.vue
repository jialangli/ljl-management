<template>
  <div class="curmb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item>
        <router-link to="/main">总览</router-link>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <router-link to="/main/analysis/GoodList">商品列表</router-link>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <router-link to="/main/amalysis/ListMang">列表管理</router-link>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        <router-link to="/main/system/BrandList">品牌管理</router-link>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import useLoginStore from '@/store/login/login'
import { mapPathToBreadcrumbs } from '@/utils/map-menus'

const route = useRoute()
const userMenus = useLoginStore().userMenus

// 确保 breadcrumbs 是响应式的
const breadcrumbs = computed(() => {
  const paths = mapPathToBreadcrumbs(route.path, userMenus)
  console.log('Breadcrumbs:', paths) // 添加调试信息
  return paths
})
</script>

<style lang="less" scoped>
.curmb {
  color: red;
}
</style>
