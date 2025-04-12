<template>
  <div class="header">
    <ListMangHeader @queryClick="handleQuery" @resetClick="handleReset" @addClick="handleAdd" />
    <ListMangContent :queryConditions="queryConditions" />
  </div>
</template>

<script setup lang="ts">
import ListMangContent from './c-cpns/ListMangContent.vue'
import ListMangHeader from './c-cpns/ListMangHeader.vue'
import { ref } from 'vue'

const queryConditions = ref({})

// 查询处理函数
function handleQuery(conditions) {
  queryConditions.value = conditions
}

// 重置处理函数
function handleReset() {
  queryConditions.value = {}
}

// 新增处理函数
function handleAdd() {
  console.log('执行新增操作')
}
</script>

<style lang="less" scoped>
.header {
  border-radius: 8px;
  overflow: hidden;
}
</style>
