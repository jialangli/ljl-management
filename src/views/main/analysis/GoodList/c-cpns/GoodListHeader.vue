<template>

  <div class="search">
    <!-- 输入搜索关键字的表单 -->
    <el-form :model="searchForm" ref="formRef" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="一级类目" prop="name">
            <el-input
              v-model="searchForm.name"
              placeholder="请输入一级类目名称"
            />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="二级类目" prop="subCategory1">
            <el-input
              v-model="searchForm.subCategory1"
              placeholder="请输入二级类目名称"
            />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="三级类目" prop="subCategory2">
            <el-input
              v-model="searchForm.subCategory2"
              placeholder="请输入三级类目名称"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <div class="btns">
        <el-button type="primary" @click="handleQueryClick">查询</el-button>
        <el-button @click="handleResetClick">重置</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { ElForm } from 'element-plus'

// 定义自定义事件
const emit = defineEmits(['queryClick', 'resetClick'])

// 定义form的数据
const searchForm = reactive({
  name: '',
  subCategory1: '', // 修改为更符合逻辑的属性名
  subCategory2: '', // 修改为更符合逻辑的属性名
})

// 定义价格范围
const priceRange = ref({
  min: '', // 最低价
  max: '', // 最高价
})

// 重置操作
const formRef = ref<InstanceType<typeof ElForm>>()
function handleResetClick() {
  // 1. form中的数据全部重置
  formRef.value?.resetFields()

  // 2. 将价格范围重置
  priceRange.value = { min: '', max: '' }

  // 3. 将事件出去, content内部重新发送网络请求
  emit('resetClick')
}

// 查询操作
function handleQueryClick() {
  emit('queryClick', searchForm)
}
</script>

<style scoped>
.search {
  margin: 20px;
}

.btns {
  margin-top: 20px;
}
</style>

<style lang="less" scoped>
.search {
  background-color: #fff;
  padding: 20px;

  .el-form-item {
    padding: 20px 30px;
    margin-bottom: 0;
  }

  .btns {
    text-align: right;
    padding: 0 50px 10px 0;

    .el-button {
      height: 36px;
    }
  }
}
</style>
