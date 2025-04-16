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
          <el-date-picker v-model="filters.month" type="month" placeholder="选择月份" style="width: 150px"/>
        </el-form-item>
        <el-form-item label="员工" prop="employeeName">
          <el-input v-model="filters.employeeName" placeholder="员工姓名" style="width: 150px"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="fetchData">搜索</el-button>
          <el-button @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 记录表格 -->
      <el-table :data="salaryRecords" stripe style="margin-top: 20px" border>
        <el-table-column prop="month" label="月份" width="120" />
        <el-table-column prop="employeeName" label="员工" width="150" />
        <el-table-column prop="baseSalary" label="基本工资" width="120">
          <template #default="{ row }">
            {{ row.baseSalary }} 元
          </template>
        </el-table-column>
        <el-table-column prop="bonus" label="奖金" width="120">
          <template #default="{ row }">
            {{ row.bonus }} 元
          </template>
        </el-table-column>
        <el-table-column prop="deduction" label="扣款" width="120">
          <template #default="{ row }">
            {{ row.deduction }} 元
          </template>
        </el-table-column>
        <el-table-column prop="total" label="应发工资" width="120">
          <template #default="{ row }">
            {{ row.total }} 元
          </template>
        </el-table-column>
        <el-table-column prop="payDate" label="发放日期" width="150" />
        <el-table-column label="操作" width="120" fixed="right" v-slot="scope">
          <el-button size="mini" type="text" @click="editRecord(scope.row)">编辑</el-button>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        @current-change="fetchData"
        style="text-align: right; margin-top: 10px;"
      />

      <!-- 新增/编辑弹窗 -->
      <el-dialog
        :title="dialogTitle"
        v-model="dialogVisible"
        width="500px"
        @close="resetForm"
      >
        <el-form :model="currentRecord" ref="salaryFormRef" label-width="100px" :rules="rules">
          <el-form-item label="月份" prop="month">
            <el-date-picker v-model="currentRecord.month" type="month" placeholder="选择月份" style="width: 100%"/>
          </el-form-item>
          <el-form-item label="员工" prop="employeeName">
            <el-input v-model="currentRecord.employeeName" placeholder="员工姓名" />
          </el-form-item>
          <el-form-item label="基本工资" prop="baseSalary">
            <el-input v-model.number="currentRecord.baseSalary" placeholder="基本工资" />
          </el-form-item>
          <el-form-item label="奖金" prop="bonus">
            <el-input v-model.number="currentRecord.bonus" placeholder="奖金" />
          </el-form-item>
          <el-form-item label="扣款" prop="deduction">
            <el-input v-model.number="currentRecord.deduction" placeholder="扣款" />
          </el-form-item>
          <el-form-item label="发放日期" prop="payDate">
            <el-date-picker v-model="currentRecord.payDate" type="date" placeholder="选择发放日期" style="width: 100%"/>
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

const salaryRecords = ref<any[]>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = 10

const filters = reactive({
  month: null,
  employeeName: ''
})

const currentRecord = reactive({
  id: null,
  month: '',
  employeeName: '',
  baseSalary: 0,
  bonus: 0,
  deduction: 0,
  total: 0,
  payDate: ''
})

const dialogVisible = ref(false)
const dialogTitle = ref('新增工资发放')
const isEdit = ref(false)
const totalRecords = ref(0)

const rules = {
  month: [{ required: true, message: '请选择月份', trigger: 'change' }],
  employeeName: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
  baseSalary: [{ required: true, message: '请输入基本工资', trigger: 'blur' }],
  bonus: [{ required: true, message: '请输入奖金', trigger: 'blur' }],
  deduction: [{ required: true, message: '请输入扣款', trigger: 'blur' }],
  payDate: [{ required: true, message: '请选择发放日期', trigger: 'change' }]
}

const salaryFormRef = ref()

// 模拟数据
const mockData = () => {
  let list = []
  for(let i=1;i<=25;i++){
    list.push({
      id: i,
      month: `2023-${i<10 ? '0'+i : i}`,
      employeeName: '员工'+i,
      baseSalary: (15000 + i * 100).toString(),
      bonus: (500 + i * 10).toString(),
      deduction: (200 + i * 5).toString(),
      total: (15000 + i * 100 + 500 + i * 10 - (200 + i * 5)).toString(),
      payDate: `2023-0${i%12+1}-15`
    })
  }
  total.value = list.length
  return list
}

// 获取数据（模仿请求）
const fetchData = () => {
  // 过滤和分页可以在此实现，当前简化为全部数据
  const allData = mockData()
  // 简单分页
  const start = (currentPage.value -1) * pageSize
  const end = start + pageSize
  salaryRecords.value = allData.slice(start, end).map(item => ({
    ...item,
    total: Number(item.baseSalary) + Number(item.bonus) - Number(item.deduction)
  }))
}

// 重新加载
const reloadData = () => {
  fetchData()
}

// 重置筛选条件
const resetFilters = () => {
  filters.month = null
  filters.employeeName = ''
  fetchData()
}

// 新增或编辑
const openDialog = (mode: 'add' | 'edit', record?: any) => {
  if(mode === 'add') {
    dialogTitle.value = '新增工资发放'
    Object.assign(currentRecord, {
      id: null,
      month: '',
      employeeName: '',
      baseSalary: 0,
      bonus: 0,
      deduction: 0,
      total: 0,
      payDate: ''
    })
  } else {
    dialogTitle.value = '编辑工资发放'
    Object.assign(currentRecord, record)
  }
  isEdit.value = mode === 'edit'
  dialogVisible.value = true
}

// 保存
const saveRecord = () => {
  salaryFormRef.value.validate((valid) => {
    if(valid) {
      if(currentRecord.id==null){
        // 添加
        currentRecord.id = Date.now()
        salaryRecords.value.unshift({ ...currentRecord, total: Number(currentRecord.baseSalary) + Number(currentRecord.bonus) - Number(currentRecord.deduction) })
        total.value +=1
      }else{
        // 编辑
        // 在实际中应更新后台，模拟为替换数组
        const index = salaryRecords.value.findIndex(r => r.id === currentRecord.id)
        if(index !== -1){
          salaryRecords.value.splice(index,1, {...currentRecord, total: Number(currentRecord.baseSalary) + Number(currentRecord.bonus) - Number(currentRecord.deduction)})
        }
      }
      ElMessage.success('保存成功')
      dialogVisible.value = false
    }
  })
}

// 页面加载
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.salary-management {
  max-width: 1000px;
  margin: 20px auto;
}
.card {
  padding: 20px;
}
.filter-form {
  margin-bottom: 20px;
}
</style>
