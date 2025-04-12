<template>
  <div class="overtime">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>加班申请</span>
          <el-button type="primary" @click="handleAdd">新增加班</el-button>
        </div>
      </template>

      <el-table :data="overtimeList" style="width: 100%">
        <el-table-column prop="date" label="加班日期" />
        <el-table-column prop="startTime" label="开始时间" />
        <el-table-column prop="endTime" label="结束时间" />
        <el-table-column prop="reason" label="加班原因" />
        <el-table-column prop="status" label="状态">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button
              type="text"
              @click="handleEdit(row)"
              v-if="row.status === '待审核'"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              @click="handleDelete(row)"
              v-if="row.status === '待审核'"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 加班申请对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="dialogType === 'add' ? '新增加班' : '编辑加班'"
        width="500px"
      >
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="加班日期" prop="date">
            <el-date-picker
              v-model="form.date"
              type="date"
              placeholder="选择加班日期"
            />
          </el-form-item>
          <el-form-item label="开始时间" prop="startTime">
            <el-time-picker
              v-model="form.startTime"
              placeholder="选择开始时间"
            />
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime">
            <el-time-picker
              v-model="form.endTime"
              placeholder="选择结束时间"
            />
          </el-form-item>
          <el-form-item label="加班原因" prop="reason">
            <el-input
              v-model="form.reason"
              type="textarea"
              :rows="3"
              placeholder="请输入加班原因"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref()

const form = reactive({
  date: '',
  startTime: '',
  endTime: '',
  reason: ''
})

const rules = {
  date: [{ required: true, message: '请选择加班日期', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  reason: [{ required: true, message: '请输入加班原因', trigger: 'blur' }]
}

// 模拟数据
const overtimeList = ref([
  {
    id: 1,
    date: '2024-04-15',
    startTime: '18:00',
    endTime: '20:00',
    reason: '项目紧急，需要加班完成',
    status: '待审核'
  },
  {
    id: 2,
    date: '2024-04-10',
    startTime: '19:00',
    endTime: '21:00',
    reason: '处理客户需求',
    status: '已通过'
  }
])

const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  Object.assign(form, {
    date: '',
    startTime: '',
    endTime: '',
    reason: ''
  })
}

const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  Object.assign(form, row)
}

const handleDelete = (row: any) => {
  // 调用删除API
  ElMessage.success('删除成功')
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      if (dialogType.value === 'add') {
        // 调用新增API
        overtimeList.value.push({
          id: overtimeList.value.length + 1,
          ...form,
          status: '待审核'
        })
      } else {
        // 调用编辑API
        const index = overtimeList.value.findIndex(item => item.id === form.id)
        if (index !== -1) {
          overtimeList.value[index] = { ...form, status: '待审核' }
        }
      }
      dialogVisible.value = false
      ElMessage.success(dialogType.value === 'add' ? '新增成功' : '编辑成功')
    }
  })
}

const getStatusType = (status: string) => {
  switch (status) {
    case '待审核':
      return 'warning'
    case '已通过':
      return 'success'
    case '已拒绝':
      return 'danger'
    default:
      return 'info'
  }
}
</script>

<style scoped>
.overtime {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
