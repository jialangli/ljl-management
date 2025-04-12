<template>
  <div class="leave-list">
    <div class="header">
      <h2>请假管理</h2>
      <el-button type="primary" @click="handleAdd">申请请假</el-button>
    </div>

    <el-table :data="leaveList" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="userId" label="用户ID" />
      <el-table-column prop="startTime" label="开始时间" />
      <el-table-column prop="endTime" label="结束时间" />
      <el-table-column prop="type" label="请假类型">
        <template #default="{ row }">
          <el-tag :type="row.type === '病假' ? 'danger' : 'warning'">
            {{ row.type }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="reason" label="请假原因" />
      <el-table-column prop="status" label="状态">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button
            v-if="row.status === '审批中'"
            type="primary"
            link
            @click="handleApprove(row)"
          >
            审批
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="申请请假" width="500px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
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
        <el-form-item label="请假类型" prop="type">
          <el-select v-model="form.type">
            <el-option label="病假" value="病假" />
            <el-option label="事假" value="事假" />
          </el-select>
        </el-form-item>
        <el-form-item label="请假原因" prop="reason">
          <el-input v-model="form.reason" type="textarea" :rows="4" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="approveDialogVisible" title="审批请假" width="500px">
      <el-form ref="approveFormRef" :model="approveForm" label-width="100px">
        <el-form-item label="审批结果" prop="status">
          <el-radio-group v-model="approveForm.status">
            <el-radio label="已通过">通过</el-radio>
            <el-radio label="已拒绝">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="approveDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleApproveSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { leaveApi } from '../../service/api'
import { ElMessage } from 'element-plus'
import { LeaveRequest } from '../../types'
import { useUserStore } from '../../store/user'

const userStore = useUserStore()
const leaveList = ref<LeaveRequest[]>([])
const dialogVisible = ref(false)
const approveDialogVisible = ref(false)
const formRef = ref()
const approveFormRef = ref()
const currentLeaveId = ref<number>()

const form = reactive({
  startTime: '',
  endTime: '',
  type: '',
  reason: '',
})

const approveForm = reactive({
  status: '已通过',
})

const rules = {
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  type: [{ required: true, message: '请选择请假类型', trigger: 'change' }],
  reason: [{ required: true, message: '请输入请假原因', trigger: 'blur' }],
}

const getStatusType = (status: string) => {
  switch (status) {
    case '审批中':
      return 'warning'
    case '已通过':
      return 'success'
    case '已拒绝':
      return 'danger'
    default:
      return 'info'
  }
}

const fetchData = async () => {
  try {
    const res = await leaveApi.getList(userStore.userInfo?.id)
    leaveList.value = res.data
  } catch (error) {
    console.error(error)
    ElMessage.error('获取数据失败')
  }
}

const handleAdd = () => {
  Object.keys(form).forEach(key => {
    form[key] = ''
  })
  dialogVisible.value = true
}

const handleApprove = (row: LeaveRequest) => {
  currentLeaveId.value = row.id
  approveForm.status = '已通过'
  approveDialogVisible.value = true
}

const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    if (!userStore.userInfo?.id) {
      ElMessage.error('请先登录')
      return
    }

    await leaveApi.create({
      ...form,
      userId: userStore.userInfo.id,
      status: '审批中',
    })

    ElMessage.success('申请成功')
    dialogVisible.value = false
    fetchData()
  } catch (error) {
    console.error(error)
  }
}

const handleApproveSubmit = async () => {
  try {
    if (!currentLeaveId.value) return

    await leaveApi.update(currentLeaveId.value, {
      status: approveForm.status,
    })

    ElMessage.success('审批成功')
    approveDialogVisible.value = false
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
.leave-list {
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
