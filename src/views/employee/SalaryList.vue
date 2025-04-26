<template>
  <div class="salary-management">
    <el-card class="card">
      <div slot="header" class="card-header">
        <span>员工工资管理</span>
      </div>

      <!-- 筛选面板 -->
      <el-form :model="filters" inline size="small" class="filter-form" @submit.native.prevent>
        <el-form-item label="月份" prop="month">
          <el-date-picker v-model="filters.month" type="month" placeholder="选择月份" value-format="YYYY-MM"
            style="width: 150px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 记录表格 -->
      <el-table :data="salaryRecords" stripe style="margin-top: 20px" border v-loading="loading">
        <el-table-column prop="month" label="月份" width="150" />
        <el-table-column prop="realName" label="员工" width="150" />
        <el-table-column prop="baseSalary" label="基本工资" width="180">
          <template #default="{ row }">
            {{ row.baseSalary }} 元
          </template>
        </el-table-column>
        <el-table-column prop="bonus" label="奖金" width="150">
          <template #default="{ row }">
            {{ row.bonus || 0 }} 元
          </template>
        </el-table-column>
        <el-table-column prop="deduction" label="扣款" width="150">
          <template #default="{ row }">
            {{ row.deduction || 0 }} 元
          </template>
        </el-table-column>
        <el-table-column prop="finalSalary" label="应发工资" width="180">
          <template #default="{ row }">
            {{ row.finalSalary }} 元
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" />
      </el-table>

      <!-- 分页 -->
      <el-pagination v-model:current-page="pagination.pageNum" :page-size="pagination.pageSize"
        :total="pagination.total" :page-sizes="[5, 10, 20]" layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange" @current-change="handlePageChange"
        style="text-align: right; margin-top: 10px;" />


    </el-card>
  </div>
</template>

<script setup lang="ts">
import { formatUTC } from '@/utils/format'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import {
  getPersonalSalaryListSvc
} from '../../service/modules/salary/salary'
import type { ISalaryListReq, ISalaryReq, ISalaryResp } from '../../service/modules/salary/types'

// 表格数据
const salaryRecords = ref<ISalaryResp[]>([])
const loading = ref(false)

// 分页配置
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

// 筛选条件
const filters = reactive({
  month: ''
})

// 当前操作记录
const currentRecord = reactive<ISalaryReq & { id?: number }>({
  id: undefined,
  userId: 0,
  month: '',
  baseSalary: 0,
  bonus: 0,
  deduction: 0
})



const salaryFormRef = ref()

// 表单验证规则
const rules = {
  month: [{ required: true, message: '请选择月份', trigger: 'change' }],
  baseSalary: [{
    required: true,
    message: '请输入基本工资',
    trigger: 'blur'
  }, {
    type: 'number',
    min: 0,
    message: '工资不能为负数'
  }],
  bonus: [{
    type: 'number',
    min: 0,
    message: '奖金不能为负数'
  }],
  deduction: [{
    type: 'number',
    min: 0,
    message: '扣款不能为负数'
  }]
}

// 获取数据
const fetchData = async () => {
  try {
    loading.value = true
    const params: ISalaryListReq = {
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize,
      month: filters.month
    }

    const res = await getPersonalSalaryListSvc(params)
    if (res.code === 200) {
      salaryRecords.value = (res.data || []).map((record: ISalaryResp) => {
        record.createTime = formatUTC(record.createTime) // Assuming formatUTC is defined
        return record
      })
    }
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 分页大小变化
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  fetchData()
}

// 页码变化
const handlePageChange = (val: number) => {
  pagination.pageNum = val
  fetchData()
}

// 重置筛选条件
const resetFilters = () => {
  filters.month = ''
  fetchData()
}


// 初次加载
onMounted(() => {
  fetchData()
})
</script>


<style scoped>
.salary-management {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 30px;
}

.card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: #f8f9fa;
  border-bottom: 1px solid #ebeef5;
}

.card-header span {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.filter-form {
  margin-bottom: 20px;
  padding: 20px 0;
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-table) {
  font-size: 14px;
}

:deep(.el-table__header th) {
  background: #f5f7fa;
  font-weight: 600;
}

.dialog-footer {
  padding: 20px;
  border-top: 1px solid #ebeef5;
  text-align: right;
}
</style>