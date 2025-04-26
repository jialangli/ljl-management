<template>
  <div class="salary-management">
    <el-card class="card">
      <div slot="header" class="card-header">
        <span>员工工资管理</span>
        <el-button type="primary" icon="el-icon-plus" size="small" @click="openDialog('add')">新增发放</el-button>
      </div>

      <!-- 筛选面板 -->
      <el-form :model="filters" inline size="small" class="filter-form" @submit.native.prevent>
        <el-form-item label="月份" prop="month">
          <el-date-picker
            v-model="filters.month"
            type="month"
            placeholder="选择月份"
            value-format="YYYY-MM"
            style="width: 150px"
          />
        </el-form-item>
        <el-form-item label="员工" prop="realName">
          <el-input v-model="filters.realName" placeholder="员工姓名" style="width: 150px"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 记录表格 -->
      <el-table 
        :data="salaryRecords" 
        stripe 
        style="margin-top: 20px" 
        border
        v-loading="loading"
      >
        <el-table-column prop="month" label="月份" width="120" />
        <el-table-column prop="realName" label="员工" width="150" />
        <el-table-column prop="baseSalary" label="基本工资" width="120">
          <template #default="{ row }">
            {{ row.baseSalary }} 元
          </template>
        </el-table-column>
        <el-table-column prop="bonus" label="奖金" width="120">
          <template #default="{ row }">
            {{ row.bonus || 0 }} 元
          </template>
        </el-table-column>
        <el-table-column prop="deduction" label="扣款" width="120">
          <template #default="{ row }">
            {{ row.deduction || 0 }} 元
          </template>
        </el-table-column>
        <el-table-column prop="totalSalary" label="应发工资" width="120">
          <template #default="{ row }">
            {{ row.totalSalary }} 元
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="120" fixed="right" v-slot="scope">
          <el-button size="mini" type="text" @click="editRecord(scope.row)">编辑</el-button>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pagination.pageNum"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[5, 10, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        style="text-align: right; margin-top: 10px;"
      />

      <!-- 新增/编辑弹窗 -->
      <el-dialog
        :title="dialogTitle"
        v-model="dialogVisible"
        width="500px"
        @close="resetForm"
      >
        <el-form 
          :model="currentRecord" 
          ref="salaryFormRef" 
          label-width="100px" 
          :rules="rules"
        >
          <el-form-item label="月份" prop="month">
            <el-date-picker
              v-model="currentRecord.month"
              type="month"
              placeholder="选择月份"
              value-format="YYYY-MM"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="员工ID" prop="userId">
            <el-input-number 
              v-model="currentRecord.userId"
              placeholder="员工ID"
              :min="1"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="基本工资" prop="baseSalary">
            <el-input-number
              v-model="currentRecord.baseSalary"
              placeholder="基本工资"
              :min="0"
              :precision="2"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="奖金" prop="bonus">
            <el-input-number
              v-model="currentRecord.bonus"
              placeholder="奖金"
              :min="0"
              :precision="2"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="扣款" prop="deduction">
            <el-input-number
              v-model="currentRecord.deduction"
              placeholder="扣款"
              :min="0"
              :precision="2"
              style="width: 100%"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveRecord">保存</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  getSalaryListSvc,
  addSalarySvc,
  updateSalarySvc
} from '../../service/modules/salary/salary'
import type { ISalaryListReq, ISalaryReq, ISalaryResp, ISalaryUpdateReq } from '../../service/modules/salary/types'

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
  month: '',
  realName: ''
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

// 弹窗控制
const dialogVisible = ref(false)
const dialogTitle = ref('新增工资发放')
const isEdit = ref(false)
const salaryFormRef = ref()

// 表单验证规则
const rules = {
  month: [{ required: true, message: '请选择月份', trigger: 'change' }],
  userId: [{ required: true, message: '请输入员工ID', trigger: 'blur' }],
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
      month: filters.month,
      realName: filters.realName
    }

    const res = await getSalaryListSvc(params)
    if (res.code === 200) {
      salaryRecords.value = res.data || []
      pagination.total = res.total || 0
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
  filters.realName = ''
  fetchData()
}

// 打开弹窗
const openDialog = (mode: 'add' | 'edit', record?: ISalaryResp) => {
  if (mode === 'add') {
    dialogTitle.value = '新增工资发放'
    Object.assign(currentRecord, {
      id: undefined,
      userId: 0,
      month: '',
      baseSalary: 0,
      bonus: 0,
      deduction: 0
    })
  } else if (record) {
    dialogTitle.value = '编辑工资发放'
    Object.assign(currentRecord, {
      id: record.id,
      userId: record.userId,
      month: record.month,
      baseSalary: record.baseSalary,
      bonus: record.bonus,
      deduction: record.deduction
    })
  }
  isEdit.value = mode === 'edit'
  dialogVisible.value = true
}

// 保存记录
const saveRecord = async () => {
  try {
    await salaryFormRef.value.validate()
    
    if (currentRecord.id) {
      // 编辑操作
      const updateData: ISalaryUpdateReq = {
        baseSalary: currentRecord.baseSalary,
        bonus: currentRecord.bonus,
        deduction: currentRecord.deduction,
        month: currentRecord.month
      }
      const res = await updateSalarySvc(currentRecord.id, updateData)
      if (res.code === 200) {
        ElMessage.success('更新成功')
        fetchData()
      }
    } else {
      // 新增操作
      const createData: ISalaryReq = {
        userId: currentRecord.userId,
        month: currentRecord.month,
        baseSalary: currentRecord.baseSalary,
        bonus: currentRecord.bonus,
        deduction: currentRecord.deduction
      }
      const res = await addSalarySvc(createData)
      if (res.code === 200) {
        ElMessage.success('创建成功')
        fetchData()
      }
    }
    dialogVisible.value = false
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败，请检查表单')
  }
}

// 初始化加载
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