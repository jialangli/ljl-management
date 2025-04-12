<template>
  <div class="search">
    <el-form :model="searchForm" ref="formRef" label-width="80px">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="关键字" prop="name">
            <el-input
              v-model="searchForm.name"
              placeholder="品牌ID/店铺/品牌名称"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分类" prop="category">
            <el-select
              v-model="searchForm.category"
              placeholder="请选择分类"
              style="width: 100%"
            >
              <el-option
                v-for="category in categories"
                :key="category.value"
                :label="category.label"
                :value="category.value"
              />
            </el-select>
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
              <el-option label="待审核" :value="0" />
              <el-option label="已上架" :value="1" />
              <el-option label="已驳回" :value="2" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div class="btns">
      <el-button icon="search" type="primary" @click="handleQueryClick">查询</el-button>
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
  cellphone: '',
  enable: null, // 初始值设为 null
  category: '', // 分类字段
})

// 定义价格范围
const priceRange = ref({
  min: '',
  max: '',
});

// 分类数据（示例）
const categories = ref([
  { label: '电子产品', value: 'electronics' },
  { label: '服装', value: 'clothing' },
  { label: '家居', value: 'home' },
]);

// 重置操作
const formRef = ref<InstanceType<typeof ElForm>>()
function handleResetClick() {
  formRef.value?.resetFields()
  priceRange.value = { min: '', max: '' };
  emit('resetClick')
}

// 查询操作
function handleQueryClick() {
  const queryConditions = {
    ...searchForm,
    priceRange: priceRange.value,
  };
  console.log('查询条件:', queryConditions); // 打印查询条件
  emit('queryClick', queryConditions)
}

// 新增操作
function handleAddClick() {
  console.log('执行新增操作');
  emit('addClick') // 发出新增事件
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

