<template>
  <div class="salary-list">
    <div class="header">
      <h2>薪资管理</h2>
      <el-button type="primary" @click="handleAdd">新增薪资记录</el-button>
    </div>

    <el-table :data="salaryList" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="month" label="月份" />
      <el-table-column prop="baseSalary" label="基本工资">
        <template #default="{ row }">
          {{ row.baseSalary.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="bonus" label="奖金">
        <template #default="{ row }">
          {{ row.bonus.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="deduction" label="扣款">
        <template #default="{ row }">
          {{ row.deduction.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column prop="finalSalary" label="最终工资">
        <template #default="{ row }">
          {{ row.finalSalary.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增薪资记录' : '编辑薪资记录'"
      width="500px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model.number="form.userId" type="number" />
        </el-form-item>
        <el-form-item label="月份" prop="month">
          <el-date-picker
            v-model="form.month"
            type="month"
            placeholder="选择月份"
            value-format="YYYY-MM"
          />
        </el-form-item>
        <el-form-item label="基本工资" prop="baseSalary">
          <el-input-number
            v-model="form.baseSalary"
            :precision="2"
            :step="100"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="奖金" prop="bonus">
          <el-input-number
            v-model="form.bonus"
            :precision="2"
            :step="100"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="扣款" prop="deduction">
          <el-input-number
            v-model="form.deduction"
            :precision="2"
            :step="100"
            :min="0"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { salaryApi } from '../../service/api'
import { ElMessage } from 'element-plus'
import { Salary } from '../../types'

const salaryList = ref<Salary[]>([])
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref()

const form = reactive({
  userId: '',
  month: '',
  baseSalary: 0,
  bonus: 0,
  deduction: 0,
})

const rules = {
  userId: [{ required: true, message: '请输入用户ID', trigger: 'blur' }],
  month: [{ required: true, message: '请选择月份', trigger: 'change' }],
  baseSalary: [{ required: true, message: '请输入基本工资', trigger: 'blur' }],
  bonus: [{ required: true, message: '请输入奖金', trigger: 'blur' }],
  deduction: [{ required: true, message: '请输入扣款', trigger: 'blur' }],
}

const finalSalary = computed(() => {
  return form.baseSalary + form.bonus - form.deduction
})

const fetchData = async () => {
  try {
    const res = await salaryApi.getList()
    salaryList.value = res.data
  } catch (error) {
    console.error(error)
    ElMessage.error('获取数据失败')
  }
}

const handleAdd = () => {
  dialogType.value = 'add'
  Object.keys(form).forEach(key => {
    form[key] = ''
  })
  dialogVisible.value = true
}

const handleEdit = (row: Salary) => {
  dialogType.value = 'edit'
  Object.keys(form).forEach(key => {
    form[key] = row[key]
  })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    const data = {
      ...form,
      finalSalary: finalSalary.value,
    }

    if (dialogType.value === 'add') {
      await salaryApi.create(data)
      ElMessage.success('新增成功')
    } else {
      await salaryApi.update(form.id, data)
      ElMessage.success('更新成功')
    }
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.salary-list {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
}
</style>
