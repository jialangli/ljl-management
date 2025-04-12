<template>
  <div class="leave">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>请假申请</span>
          <el-button type="primary" @click="handleAdd">新增请假</el-button>
        </div>
      </template>

      <el-table :data="leaveList" style="width: 100%">
        <el-table-column prop="startDate" label="开始日期" />
        <el-table-column prop="endDate" label="结束日期" />
        <el-table-column prop="type" label="请假类型" />
        <el-table-column prop="reason" label="请假原因" />
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

      <!-- 请假申请对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="dialogType === 'add' ? '新增请假' : '编辑请假'"
        width="500px"
      >
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="请假类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择请假类型">
              <el-option label="事假" value="事假" />
              <el-option label="病假" value="病假" />
              <el-option label="年假" value="年假" />
              <el-option label="婚假" value="婚假" />
              <el-option label="产假" value="产假" />
            </el-select>
          </el-form-item>
          <el-form-item label="开始日期" prop="startDate">
            <el-date-picker
              v-model="form.startDate"
              type="date"
              placeholder="选择开始日期"
            />
          </el-form-item>
          <el-form-item label="结束日期" prop="endDate">
            <el-date-picker
              v-model="form.endDate"
              type="date"
              placeholder="选择结束日期"
            />
          </el-form-item>
          <el-form-item label="请假原因" prop="reason">
            <el-input
              v-model="form.reason"
              type="textarea"
              :rows="3"
              placeholder="请输入请假原因"
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
  type: '',
  startDate: '',
  endDate: '',
  reason: ''
})

const rules = {
  type: [{ required: true, message: '请选择请假类型', trigger: 'change' }],
  startDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
  endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
  reason: [{ required: true, message: '请输入请假原因', trigger: 'blur' }]
}

// 模拟数据
const leaveList = ref([
  {
    id: 1,
    type: '事假',
    startDate: '2024-04-15',
    endDate: '2024-04-16',
    reason: '家中有事',
    status: '待审核'
  },
  {
    id: 2,
    type: '病假',
    startDate: '2024-04-10',
    endDate: '2024-04-11',
    reason: '身体不适',
    status: '已通过'
  }
])

const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  Object.assign(form, {
    type: '',
    startDate: '',
    endDate: '',
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
        leaveList.value.push({
          id: leaveList.value.length + 1,
          ...form,
          status: '待审核'
        })
      } else {
        // 调用编辑API
        const index = leaveList.value.findIndex(item => item.id === form.id)
        if (index !== -1) {
          leaveList.value[index] = { ...form, status: '待审核' }
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
.leave {
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
