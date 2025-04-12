<template>
  <div class="header">
    <BrandListHeader />
    <BrandListContent />
  </div>
</template>

<script setup lang="ts">
import BrandListContent from './c-cpns/BrandListContent.vue'
import BrandListHeader from './c-cpns/BrandListHeader.vue'

</script>

<style lang="less" scoped>
.header {
  border-radius: 8px;
  overflow: hidden;
}
</style>
