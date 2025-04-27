<template>
  <div class="salary-management">
    <!-- 搜索和操作栏 -->
    <div class="operation-bar">
      <el-input v-model="searchKeyword" placeholder="请输入员工姓名搜索" class="search-input" clearable @clear="handleSearch"
        @keyup.enter="handleSearch">
        <template #prefix>
          <el-icon>
            <Search />
          </el-icon>
        </template>
      </el-input>
      <el-date-picker v-model="searchMonth" type="month" placeholder="选择月份" value-format="YYYY-MM"
        style="margin-left: 10px; width: 150px" @change="handleSearch" />
      <el-button type="primary" @click="handleAdd" style="margin-left: 10px">
        <el-icon>
          <Plus />
        </el-icon>新增薪资记录
      </el-button>
    </div>

    <!-- 工资列表表格 -->
    <el-table v-loading="loading" :data="salaryList" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="realName" label="员工姓名" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="baseSalary" label="基本工资" />
      <el-table-column prop="bonus" label="奖金" />
      <el-table-column prop="deduction" label="扣款" />
      <el-table-column label="实发工资" align="right">
        <template #default="{ row }">
          {{ (row.baseSalary + row.bonus - row.deduction).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="month" label="月份" width="120" />
      <el-table-column prop="createTime" label="创建时间" width="180" :formatter="formatDateColumn" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button-group>
            <el-button type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
        :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>

    <!-- 新增/编辑薪资记录对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogType === 'add' ? '新增薪资记录' : '编辑薪资记录'" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="员工ID" prop="userId" v-if="dialogType === 'add'">
          <el-input-number v-model="form.userId" :min="1" />
        </el-form-item>

        <el-form-item label="员工姓名" v-if="dialogType === 'edit'">
          <el-input v-model="form.realName" disabled />
        </el-form-item>

        <el-form-item label="基本工资" prop="baseSalary">
          <el-input-number v-model="form.baseSalary" :min="0" :precision="2" />
        </el-form-item>

        <el-form-item label="奖金" prop="bonus">
          <el-input-number v-model="form.bonus" :min="0" :precision="2" />
        </el-form-item>

        <el-form-item label="扣款" prop="deduction">
          <el-input-number v-model="form.deduction" :min="0" :precision="2" />
        </el-form-item>

        <el-form-item label="月份" prop="month">
          <el-date-picker v-model="form.month" type="month" placeholder="选择月份" value-format="YYYY-MM" />
        </el-form-item>
        <!-- 实发工资预览 -->
        <el-form-item label="实发工资">
          <el-input :value="(form.baseSalary + form.bonus - form.deduction).toFixed(2)" disabled />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  addSalarySvc,
  deleteSalarySvc,
  getSalaryListSvc,
  updateSalarySvc,
  type ISalaryListReq,
  type ISalaryReq,
  type ISalaryResp,
  type ISalaryUpdateReq
} from '@/service/modules/salary/salary'
import { Plus, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

// 搜索关键词
const searchKeyword = ref('')
const searchMonth = ref('')

// 表格数据
const loading = ref(false)
const salaryList = ref<ISalaryResp[]>([])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref()
const currentSalaryId = ref<number | null>(null)

// 表单数据
const form = reactive({
  userId: null as number | null,
  realName: '',
  baseSalary: 0,
  bonus: 0,
  deduction: 0,
  month: ''
})

// 表单验证规则
const rules = {
  userId: [
    { required: true, message: '请输入员工ID', trigger: 'blur' },
    { type: 'number', min: 1, message: '员工ID必须大于0', trigger: 'blur' }
  ],
  baseSalary: [
    { required: true, message: '请输入基本工资', trigger: 'blur' },
    { type: 'number', min: 0, message: '基本工资不能为负数', trigger: 'blur' }
  ],
  bonus: [
    { required: true, message: '请输入奖金', trigger: 'blur' },
    { type: 'number', min: 0, message: '奖金不能为负数', trigger: 'blur' }
  ],
  deduction: [
    { required: true, message: '请输入扣款', trigger: 'blur' },
    { type: 'number', min: 0, message: '扣款不能为负数', trigger: 'blur' }
  ],
  month: [
    { required: true, message: '请选择月份', trigger: 'blur' }
  ]
}

// 格式化日期列
const formatDateColumn = (row: ISalaryResp, column: any, cellValue: string) => {
  if (!cellValue) return ''

  const date = new Date(cellValue)
  return `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`
}

// 补零函数
const padZero = (num: number) => {
  return num < 10 ? `0${num}` : num
}

// 加载工资列表
const loadSalaryList = async () => {
  try {
    loading.value = true

    const params: ISalaryListReq = {
      pageNum: currentPage.value,
      pageSize: pageSize.value
    }

    if (searchKeyword.value) {
      // 根据API文档，可能需要调整搜索字段
      params.userId = Number(searchKeyword.value) || undefined
    }

    if (searchMonth.value) {
      params.month = searchMonth.value
    }

    const res = await getSalaryListSvc(params)

    if (res.code === 200) {
      salaryList.value = res.data || []

    } else {
      ElMessage.error(res.message || '获取工资列表失败')
    }
  } catch (error) {
    ElMessage.error('请求工资列表出错')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadSalaryList()
}

// 新增薪资记录
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  currentSalaryId.value = null
  form.userId = null
  form.realName = ''
  form.baseSalary = 0
  form.bonus = 0
  form.deduction = 0
  form.month = ''
}

// 编辑薪资记录
const handleEdit = (row: ISalaryResp) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  currentSalaryId.value = row.id
  form.userId = row.userId
  form.realName = row.realName
  form.baseSalary = row.baseSalary
  form.bonus = row.bonus || 0
  form.deduction = row.deduction || 0
  form.month = row.month
}

// 删除薪资记录
const handleDelete = async (row: ISalaryResp) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除${row.realName}的${row.month}薪资记录吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );


    const res = await deleteSalarySvc(row.id)

    if (res.code === 200) {
      ElMessage.success('删除成功')
      loadSalaryList()
    } else {
      ElMessage.error(res.message || '删除失败')
    }
  } catch (error) {
    // 用户取消删除不做任何操作
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    if (dialogType.value === 'add') {
      // 新增薪资记录
      const salaryData: ISalaryReq = {
        userId: form.userId!,
        baseSalary: form.baseSalary,
        bonus: form.bonus,
        deduction: form.deduction,
        month: form.month
      }

      const res = await addSalarySvc(salaryData)

      if (res.code === 200) {
        ElMessage.success('新增成功')
        dialogVisible.value = false
        loadSalaryList()
      } else {
        ElMessage.error(res.message || '新增薪资记录失败')
      }
    } else if (currentSalaryId.value) {
      // 编辑薪资记录
      const salaryData: ISalaryUpdateReq = {
        baseSalary: form.baseSalary,
        bonus: form.bonus,
        deduction: form.deduction,
        month: form.month
      }

      const res = await updateSalarySvc(currentSalaryId.value, salaryData)

      if (res.code === 200) {
        ElMessage.success('编辑成功')
        dialogVisible.value = false
        loadSalaryList()
      } else {
        ElMessage.error(res.message || '编辑薪资记录失败')
      }
    }
  } catch (error) {
    // 验证失败不做任何操作
  }
}

// 分页大小改变
const handleSizeChange = (val: number) => {
  pageSize.value = val
  loadSalaryList()
}

// 当前页改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  loadSalaryList()
}

// 初始化加载数据
onMounted(() => {
  loadSalaryList()
})
</script>

<style scoped>
.salary-management {
  padding: 20px;
}

.operation-bar {
  margin-bottom: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.search-input {
  width: 250px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-button-group) {
  .el-button {
    margin-left: 0;
  }
}

:deep(.el-input-number) {
  width: 100%;
}
</style>
