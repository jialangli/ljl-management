<template>
  <div class="search">
    <el-form :model="searchForm" ref="formRef" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="关键字" prop="name">
            <el-input
              v-model="searchForm.name"
              placeholder="商品名称/收件人/店铺名称"
            />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="价格范围">
            <el-input
              v-model="priceRange.min"
              placeholder="最低价"
              style="width: 120px; margin-right: 10px"
            />
            <span>-</span>
            <el-input
              v-model="priceRange.max"
              placeholder="最高价"
              style="width: 120px; margin-left: 10px"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态" prop="enable">
            <el-select
              v-model="searchForm.enable"
              placeholder="请选择查询的状态"
              style="width: 100%"
            >
              <el-option label="已发货" :value="1" />
              <el-option label="代发货" :value="0" />
              <el-option label="已完成" :value="2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="下单时间" prop="createAt">
            <el-date-picker
              v-model="searchForm.createAt"
              type="daterange"
              range-separator="-"
              start-placeholder="下单时间"
              end-placeholder="结束时间"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="btns">
      <el-button icon="Refresh" @click="handleResetClick">重置</el-button>
      <el-button icon="Search" type="primary" @click="handleQueryClick">查询</el-button>
      <el-button icon="Plus" type="success" @click="handleAddClick">新增</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { ElForm } from 'element-plus'

// 定义自定义事件
const emit = defineEmits(['queryClick', 'resetClick', 'addClick'])

// 定义form的数据
const searchForm = reactive({
  name: '',
  enable: '',
  createAt: '',
})

// 定义价格范围
const priceRange = ref({
  min: '', // 最低价
  max: '', // 最高价
})

// 重置操作
const formRef = ref<InstanceType<typeof ElForm>>()
function handleResetClick() {
  formRef.value?.resetFields()
  priceRange.value = { min: '', max: '' }
  emit('resetClick')
}

function handleQueryClick() {
  const queryConditions = {
    ...searchForm,
    priceRange: priceRange.value,
  }
  emit('queryClick', queryConditions)
}

// 新增操作
function handleAddClick() {
  emit('addClick')
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
