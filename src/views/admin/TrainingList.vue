<template>
  <div class="training-list">
    <div class="header">
      <h2>培训管理</h2>
      <el-button type="primary" @click="handleAdd">新增培训</el-button>
    </div>

    <el-table :data="trainingList" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="creator" label="发起人" />
      <el-table-column prop="title" label="培训标题" />
      <el-table-column prop="startTime" label="开始时间" />
      <el-table-column prop="endTime" label="结束时间" />
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
      :title="dialogType === 'add' ? '新增培训' : '编辑培训'"
      width="500px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="培训标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="培训内容" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            placeholder="选择开始时间"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="form.endTime"
            type="datetime"
            placeholder="选择结束时间"
          />
        </el-form-item>
        <el-form-item label="参与人员" prop="participants">
          <el-select
            v-model="form.participants"
            multiple
            filterable
            placeholder="请选择参与人员"
          >
            <el-option
              v-for="user in userList"
              :key="user.id"
              :label="user.realName"
              :value="user.id"
            />
          </el-select>
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
import { trainingApi, userApi } from '../../service/api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Training, User } from '../../types'

const trainingList = ref<Training[]>([])
const userList = ref<User[]>([])
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref()

const form = reactive({
  title: '',
  content: '',
  startTime: '',
  endTime: '',
  participants: [],
})

const rules = {
  title: [{ required: true, message: '请输入培训标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入培训内容', trigger: 'blur' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  participants: [
    { required: true, message: '请选择参与人员', trigger: 'change' },
  ],
}

const fetchData = async () => {
  try {
    const [trainings, users] = await Promise.all([
      trainingApi.getList(),
      userApi.getUserList(),
    ])
    trainingList.value = trainings.data
    userList.value = users.data
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

const handleEdit = (row: Training) => {
  dialogType.value = 'edit'
  Object.keys(form).forEach(key => {
    form[key] = row[key]
  })
  dialogVisible.value = true
}

const handleDelete = async (row: Training) => {
  try {
    await ElMessageBox.confirm('确定要删除该培训吗？', '提示', {
      type: 'warning',
    })
    await trainingApi.delete(row.id)
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
      await trainingApi.create(form)
      ElMessage.success('新增成功')
    } else {
      await trainingApi.update(form.id, form)
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
.training-list {
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