<template>
  <div class="department-list">
    <div class="header">
      <h2>部门管理</h2>
      <el-button type="primary" @click="handleAdd">新增部门</el-button>
    </div>

    <el-table :data="departmentList" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="部门名称" />
      <el-table-column prop="leaderId" label="负责人ID" />
      <el-table-column prop="zhiwei" label="职位" />
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)"
            >编辑</el-button
          >
          <el-button type="danger" link @click="handleDelete(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增部门' : '编辑部门'"
      width="500px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="负责人ID" prop="leaderId">
          <el-input v-model.number="form.leaderId" type="number" />
        </el-form-item>
        <el-form-item label="职位" prop="zhiwei">
          <el-input v-model="form.zhiwei" />
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
import { ref, reactive, onMounted } from 'vue'
import { departmentApi } from '../../service/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Department } from '../../types'

const departmentList = ref<Department[]>([])
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref()

const form = reactive({
  name: '',
  leaderId: '',
  zhiwei: '',
})

const rules = {
  name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }],
  leaderId: [{ required: true, message: '请输入负责人ID', trigger: 'blur' }],
  zhiwei: [{ required: true, message: '请输入职位', trigger: 'blur' }],
}

const fetchData = async () => {
  try {
    const res = await departmentApi.getList()
    departmentList.value = res.data
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

const handleEdit = (row: Department) => {
  dialogType.value = 'edit'
  Object.keys(form).forEach(key => {
    form[key] = row[key]
  })
  dialogVisible.value = true
}

const handleDelete = async (row: Department) => {
  try {
    await ElMessageBox.confirm('确定要删除该部门吗？', '提示', {
      type: 'warning',
    })
    await departmentApi.delete(row.id)
    ElMessage.success('删除成功')
    fetchData()
  } catch (error) {
    console.error(error)
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    if (dialogType.value === 'add') {
      await departmentApi.create(form)
      ElMessage.success('新增成功')
    } else {
      await departmentApi.update(form.id, form)
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
.department-list {
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
