<template>
  <div class="training-list">
    <div class="header">
      <h2>培训管理</h2>
      <el-button type="primary" @click="handleAdd">新增培训</el-button>
    </div>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <el-input
        v-model="searchParams.title"
        placeholder="请输入培训标题"
        style="width: 200px; margin-right: 10px"
        clearable
      />
      <el-input
        v-model="searchParams.creator"
        placeholder="请输入发起人"
        style="width: 200px; margin-right: 10px"
        clearable
      />
      <el-button type="primary" @click="loadTrainingData">
        <el-icon><Search /></el-icon>搜索
      </el-button>
    </div>

    <!-- 培训列表表格 -->
    <el-table :data="trainingList" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="creator" label="发起人" width="120" />
      <el-table-column prop="title" label="培训标题" />
      <el-table-column label="时间" width="220">
        <template #default="{ row }">
          <div>开始：{{ formatTime(row.startTime) }}</div>
          <div>结束：{{ formatTime(row.endTime) }}</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          <el-button type="success" link @click="handleViewDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="pagination.pageNum"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增培训' : '编辑培训'"
      width="600px"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            placeholder="选择开始时间"
            value-format="YYYY-MM-DDTHH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="form.endTime"
            type="datetime"
            placeholder="选择结束时间"
            value-format="YYYY-MM-DDTHH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="参与人员" prop="participants">
          <el-select
            v-model="selectedParticipants"
            multiple
            filterable
            placeholder="请选择参与人员"
            style="width: 100%"
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import {
  getTrainingListSvc,
  addTrainingSvc,
  updateTrainingSvc,
  deleteTrainingSvc,
  type ITrainingListReq,
  type ITrainingReq,
  type ITrainingResp
} from '@/service/modules/training/training'
import { getUserListSvc } from '@/service/modules/user/user'

// 分页参数
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

// 搜索参数
const searchParams = reactive<ITrainingListReq>({
  title: '',
  creator: ''
})

// 培训列表数据
const trainingList = ref<ITrainingResp[]>([])
const loading = ref(false)

// 用户列表数据
const userList = ref<any[]>([])

// 对话框相关
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref()
const form = reactive<ITrainingReq & { id?: number }>({
  title: '',
  content: '',
  startTime: '',
  endTime: '',
  participants: ''
})
const selectedParticipants = ref<string[]>([])

// 表单验证规则
const rules = {
  title: [{ required: true, message: '请输入培训标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入培训内容', trigger: 'blur' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  participants: [
    { required: true, message: '请选择参与人员', trigger: 'change' }
  ]
}

// 加载培训数据
const loadTrainingData = async () => {
  try {
    loading.value = true
    const params: ITrainingListReq = {
      ...searchParams,
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize
    }

    const res = await getTrainingListSvc(params)
    if (res.code === 200) {
      trainingList.value = res.data || []
      pagination.total = res.total || 0
    } else {
      ElMessage.error(res.message || '获取数据失败')
    }
  } catch (error) {
    ElMessage.error('请求失败')
  } finally {
    loading.value = false
  }
}

// 加载用户列表
const loadUserList = async () => {
  try {
    const res = await getUserListSvc({ pageSize: 1000 })
    if (res.code === 200) {
      userList.value = res.data || []
    }
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  }
}

// 时间格式化
const formatTime = (time: string) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm')
}

// 新增培训
const handleAdd = () => {
  dialogType.value = 'add'
  resetForm()
  dialogVisible.value = true
}

// 编辑培训
const handleEdit = async (row: ITrainingResp) => {
  dialogType.value = 'edit'
  try {
    // 获取详情数据
    Object.assign(form, {
      id: row.id,
      title: row.title,
      content: row.content,
      startTime: row.startTime,
      endTime: row.endTime,
      participants: row.participants.join(',')
    })
    selectedParticipants.value = row.participants
    dialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取详情失败')
  }
}

// 删除培训
const handleDelete = async (row: ITrainingResp) => {
  try {
    await ElMessageBox.confirm(`确定删除【${row.title}】培训吗？`, '提示', {
      type: 'warning'
    })
    const res = await deleteTrainingSvc(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      loadTrainingData()
    }
  } catch (error) {
    // 取消删除
  }
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    
    // 处理参与人员格式
    form.participants = selectedParticipants.value.join(',')

    if (dialogType.value === 'add') {
      await addTrainingSvc(form)
      ElMessage.success('新增成功')
    } else {
      if (!form.id) return
      await updateTrainingSvc(form.id, form)
      ElMessage.success('更新成功')
    }
    
    dialogVisible.value = false
    loadTrainingData()
  } catch (error) {
    console.error('提交失败', error)
  }
}

// 重置表单
const resetForm = () => {
  form.id = undefined
  form.title = ''
  form.content = ''
  form.startTime = ''
  form.endTime = ''
  form.participants = ''
  selectedParticipants.value = []
}

// 分页大小改变
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadTrainingData()
}

// 页码改变
const handlePageChange = (page: number) => {
  pagination.pageNum = page
  loadTrainingData()
}

// 初始化
onMounted(() => {
  loadTrainingData()
  loadUserList()
})
</script>

<style scoped>
.training-list {
  padding: 20px;
  height: 100vh;


}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar {
  margin-bottom: 20px;
}

.pagination {
  margin-top: auto;
  padding: 16px 0;
  background: white;
  border-top: 1px solid #ebeef5;
}

:deep(.el-table) {
  flex: 1;
  overflow: auto;
}
</style>