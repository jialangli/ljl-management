<template>
  <div class="header">
    <GoodReviewHeader />
    <GoodReviewContent />
  </div>
</template>

<script setup lang="ts">
import GoodReviewContent from './c-cpns/GoodReviewContent.vue'
import GoodReviewHeader from './c-cpns/GoodReviewHeader.vue'
</script>


<style lang="less" scoped>
.header {
  border-radius: 8px;
  overflow: hidden;
}
</style>
