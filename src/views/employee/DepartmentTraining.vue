<template>
  <div class="department-training">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>部门培训</span>
          <el-button type="primary" @click="handleApply">申请部门培训</el-button>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="部门培训计划" name="plan">
          <el-table :data="departmentTrainings" style="width: 100%">
            <el-table-column prop="name" label="培训名称" />
            <el-table-column prop="type" label="培训类型" />
            <el-table-column prop="department" label="申请部门" />
            <el-table-column prop="startTime" label="开始时间" />
            <el-table-column prop="endTime" label="结束时间" />
            <el-table-column prop="status" label="状态">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="{ row }">
                <el-button type="text" @click="handleView(row)">查看详情</el-button>
                <el-button
                  type="text"
                  @click="handleCancel(row)"
                  v-if="row.status === '待审核'"
                >
                  取消申请
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="培训记录" name="record">
          <el-table :data="trainingRecords" style="width: 100%">
            <el-table-column prop="name" label="培训名称" />
            <el-table-column prop="type" label="培训类型" />
            <el-table-column prop="department" label="部门" />
            <el-table-column prop="startTime" label="开始时间" />
            <el-table-column prop="endTime" label="结束时间" />
            <el-table-column prop="teacher" label="培训讲师" />
            <el-table-column prop="location" label="培训地点" />
            <el-table-column prop="participants" label="参与人数" />
            <el-table-column label="操作" width="100">
              <template #default="{ row }">
                <el-button type="text" @click="handleViewRecord(row)">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 培训申请对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="dialogType === 'add' ? '申请部门培训' : '培训详情'"
        width="500px"
      >
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="培训名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入培训名称" />
          </el-form-item>
          <el-form-item label="培训类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择培训类型">
              <el-option label="技术培训" value="技术培训" />
              <el-option label="管理培训" value="管理培训" />
              <el-option label="职业发展" value="职业发展" />
            </el-select>
          </el-form-item>
          <el-form-item label="申请部门" prop="department">
            <el-input v-model="form.department" placeholder="请输入申请部门" />
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
          <el-form-item label="培训地点" prop="location">
            <el-input v-model="form.location" placeholder="请输入培训地点" />
          </el-form-item>
          <el-form-item label="培训讲师" prop="teacher">
            <el-input v-model="form.teacher" placeholder="请输入培训讲师" />
          </el-form-item>
          <el-form-item label="预计人数" prop="expectedParticipants">
            <el-input-number v-model="form.expectedParticipants" :min="1" />
          </el-form-item>
          <el-form-item label="培训内容" prop="content">
            <el-input
              v-model="form.content"
              type="textarea"
              :rows="3"
              placeholder="请输入培训内容"
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

const activeTab = ref('plan')
const dialogVisible = ref(false)
const dialogType = ref('add')
const formRef = ref()

const form = reactive({
  name: '',
  type: '',
  department: '',
  startTime: '',
  endTime: '',
  location: '',
  teacher: '',
  expectedParticipants: 1,
  content: ''
})

const rules = {
  name: [{ required: true, message: '请输入培训名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择培训类型', trigger: 'change' }],
  department: [{ required: true, message: '请输入申请部门', trigger: 'blur' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  location: [{ required: true, message: '请输入培训地点', trigger: 'blur' }],
  teacher: [{ required: true, message: '请输入培训讲师', trigger: 'blur' }],
  expectedParticipants: [
    { required: true, message: '请输入预计人数', trigger: 'blur' }
  ],
  content: [{ required: true, message: '请输入培训内容', trigger: 'blur' }]
}

// 模拟数据
const departmentTrainings = ref([
  {
    id: 1,
    name: 'Vue3高级开发',
    type: '技术培训',
    department: '技术部',
    startTime: '2024-03-15 09:00',
    endTime: '2024-03-15 17:00',
    status: '待审核'
  },
  {
    id: 2,
    name: '项目管理实战',
    type: '管理培训',
    department: '技术部',
    startTime: '2024-03-20 09:00',
    endTime: '2024-03-20 17:00',
    status: '已通过'
  }
])

const trainingRecords = ref([
  {
    id: 1,
    name: 'Vue3高级开发',
    type: '技术培训',
    department: '技术部',
    startTime: '2024-03-15 09:00',
    endTime: '2024-03-15 17:00',
    teacher: '张老师',
    location: '培训室A',
    participants: 20
  },
  {
    id: 2,
    name: '项目管理实战',
    type: '管理培训',
    department: '技术部',
    startTime: '2024-03-20 09:00',
    endTime: '2024-03-20 17:00',
    teacher: '李老师',
    location: '培训室B',
    participants: 15
  }
])

const handleApply = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  Object.assign(form, {
    name: '',
    type: '',
    department: '',
    startTime: '',
    endTime: '',
    location: '',
    teacher: '',
    expectedParticipants: 1,
    content: ''
  })
}

const handleView = (row: any) => {
  dialogType.value = 'view'
  dialogVisible.value = true
  Object.assign(form, row)
}

const handleViewRecord = (row: any) => {
  dialogType.value = 'view'
  dialogVisible.value = true
  Object.assign(form, row)
}

const handleCancel = (row: any) => {
  // 调用取消API
  ElMessage.success('取消成功')
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      // 调用API
      departmentTrainings.value.push({
        id: departmentTrainings.value.length + 1,
        ...form,
        status: '待审核'
      })
      dialogVisible.value = false
      ElMessage.success('申请成功')
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
.department-training {
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
