<template>
  <div class="training-list-container">
    <h1>培训记录</h1>

    <!-- 搜索和过滤 -->
    <div class="search-filter">
      <el-input 
        v-model="searchParams.title" 
        placeholder="搜索培训标题" 
        clearable 
        style="width: 200px"
      />
      <el-input
        v-model="searchParams.creator"
        placeholder="创建人"
        clearable
        style="width: 150px"
      />
      <el-button type="primary" @click="fetchData">搜索</el-button>
      <el-button @click="resetSearch">重置</el-button>
      <el-button type="success" @click="openDialog('add')" icon="el-icon-plus">新增培训</el-button>
    </div>

    <!-- 培训列表 -->
    <el-table 
      :data="trainingList" 
      border 
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column prop="id" label="ID" width="60" align="center" />
      <el-table-column prop="title" label="培训标题" width="200" />
      <el-table-column prop="content" label="培训内容" min-width="100" />
      <el-table-column prop="creator" label="创建人" width="120" />
      <el-table-column prop="startTime" label="开始时间" width="160">
        <template #default="scope">
          {{ formatDateTime(scope.row.startTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间" width="160">
        <template #default="scope">
          {{ formatDateTime(scope.row.endTime) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="center">
        <template #default="scope">
          <el-tag :type="statusType(scope.row)">
            {{ calculateStatus(scope.row) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="380" fixed="right" align="center">
        <template #default="scope">
          <el-button size="small" @click="viewDetails(scope.row)">查看</el-button>
          <el-button 
            size="small" 
            type="primary" 
            @click="openDialog('edit', scope.row)"
          >编辑</el-button>
          <el-button 
            size="small" 
            type="danger" 
            @click="deleteTraining(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="pagination.pageNum"
      v-model:page-size="pagination.pageSize"
      :page-sizes="[5, 10, 20, 50]"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
      @size-change="handleSizeChange"
      @current-change="handlePageChange"
      style="margin-top: 20px;"
    />

    <!-- 新增/编辑弹窗 -->
    <el-dialog 
      :title="dialogTitle" 
      v-model="dialogVisible" 
      width="600px"
      @closed="resetForm"
    >
      <el-form 
        :model="currentTraining" 
        ref="formRef" 
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="标题" prop="title">
          <el-input v-model="currentTraining.title" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input 
            v-model="currentTraining.content" 
            type="textarea" 
            :rows="4"
          />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="currentTraining.startTime"
            type="datetime"
            placeholder="选择开始时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="currentTraining.endTime"
            type="datetime"
            placeholder="选择结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="参与人员" prop="participants">
          <el-input 
            v-model="currentTraining.participants"
            placeholder="请输入参与人员，多个用逗号分隔"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </template>
    </el-dialog>

    <!-- 培训详情对话框 -->
    <el-dialog 
      v-model="detailVisible" 
      title="培训详情" 
      width="60%"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="培训标题">{{ currentDetail?.title }}</el-descriptions-item>
        <el-descriptions-item label="创建人">{{ currentDetail?.creator }}</el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ formatDateTime(currentDetail?.startTime) }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ formatDateTime(currentDetail?.endTime) }}</el-descriptions-item>
        <el-descriptions-item label="参与人员" :span="2">
          <el-tag 
            v-for="(participant, index) in currentDetail?.participants" 
            :key="index"
            style="margin-right: 5px; margin-bottom: 5px;"
          >
            {{ participant }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="培训内容" :span="2">
          {{ currentDetail?.content }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'
import { 
  getTrainingListSvc,
  getTrainingDetailSvc,
  addTrainingSvc,
  updateTrainingSvc,
  deleteTrainingSvc
} from '../../service/modules/training/training'
import type { 
  ITrainingListReq,
  ITrainingReq,
  ITrainingResp 
} from '../../service/modules/training/types'

// 表格数据
const trainingList = ref<ITrainingResp[]>([])
const loading = ref(false)

// 分页配置
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

// 当前操作记录
const currentTraining = reactive<ITrainingReq>({
  title: '',
  content: '',
  startTime: '',
  endTime: '',
  participants: ''
})

// 当前查看详情
const currentDetail = ref<ITrainingResp>()
const dialogVisible = ref(false)
const detailVisible = ref(false)
const dialogTitle = ref('新增培训')
const isEditMode = ref(false)
const formRef = ref()

// 表单验证规则
const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  participants: [{ required: true, message: '请输入参与人员', trigger: 'blur' }]
}

// 获取数据
const fetchData = async () => {
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
    }
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

// 查看详情
const viewDetails = async (row: ITrainingResp) => {
  try {
    const res = await getTrainingDetailSvc(row.id)
    if (res.code === 200) {
      currentDetail.value = res.data
      detailVisible.value = true
    }
  } catch (error) {
    ElMessage.error('获取详情失败')
  }
}

// 删除培训
const deleteTraining = (id: number) => {
  ElMessageBox.confirm('确认删除该培训记录？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res = await deleteTrainingSvc(id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      fetchData()
    }
  }).catch(() => {})
}

// 打开弹窗
const openDialog = (mode: 'add' | 'edit', row?: ITrainingResp) => {
  isEditMode.value = mode === 'edit'
  dialogTitle.value = mode === 'add' ? '新增培训' : '编辑培训'
  
  if (mode === 'edit' && row) {
    Object.assign(currentTraining, {
      title: row.title,
      content: row.content,
      startTime: row.startTime,
      endTime: row.endTime,
      participants: row.participants
    })
    // 添加编辑时需要传递的ID
    ;(currentTraining as any).id = row.id
  }
  dialogVisible.value = true
}

// 提交表单
const submitForm = async () => {
  try {
    await formRef.value.validate()
    
    if (isEditMode.value) {
      // 编辑操作
      const res = await updateTrainingSvc((currentTraining as any).id, currentTraining)
      if (res.code === 200) {
        ElMessage.success('更新成功')
        fetchData()
      }
    } else {
      // 新增操作
      const res = await addTrainingSvc(currentTraining)
      if (res.code === 200) {
        ElMessage.success('添加成功')
        fetchData()
      }
    }
    dialogVisible.value = false
  } catch (error) {
    console.error('提交失败:', error)
  }
}

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields()
  Object.assign(currentTraining, {
    title: '',
    content: '',
    startTime: '',
    endTime: '',
    participants: ''
  })
  delete (currentTraining as any).id
}

// 分页处理
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  fetchData()
}

const handlePageChange = (val: number) => {
  pagination.pageNum = val
  fetchData()
}

// 重置搜索
const resetSearch = () => {
  searchParams.title = ''
  searchParams.creator = ''
  fetchData()
}

// 状态计算
const calculateStatus = (row: ITrainingResp) => {
  const now = dayjs()
  const start = dayjs(row.startTime)
  const end = dayjs(row.endTime)
  
  if (now.isBefore(start)) return '未开始'
  if (now.isAfter(end)) return '已结束'
  return '进行中'
}

const statusType = (row: ITrainingResp) => {
  const status = calculateStatus(row)
  return {
    '进行中': 'success',
    '已结束': 'info',
    '未开始': 'warning'
  }[status]
}

// 日期格式化
const formatDateTime = (time?: string) => {
  return time ? dayjs(time).format('YYYY-MM-DD HH:mm') : ''
}

// 初始化加载
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.training-list-container {
  padding: 20px 30px;
  max-width: 1400px;
  margin: 0 auto;
}

.search-filter {
  margin: 20px 0;
  display: flex;
  gap: 10px;
  align-items: center;
}

.el-descriptions {
  margin: 20px;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
</style>