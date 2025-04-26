<template>
  <div class="training-list-container">
    <h1>培训记录</h1>

    <!-- 搜索和过滤 -->
    <div class="search-filter">
      <el-input v-model="searchParams.title" placeholder="搜索培训标题" clearable style="width: 200px" />
      <el-input v-model="searchParams.creator" placeholder="创建人" clearable style="width: 150px" />
      <el-button type="primary" @click="fetchData">搜索</el-button>
      <el-button @click="resetSearch">重置</el-button>

    </div>

    <!-- 培训列表 -->
    <el-table :data="trainingList" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" label="ID" width="60" align="center" />
      <el-table-column prop="title" label="培训标题" width="200" />
      <el-table-column prop="content" label="培训内容" min-width="100" />
      <el-table-column prop="creator" label="创建人" width="150" />
      <el-table-column prop="startTime" label="开始时间" width="160">
        <template #default="scope">
          {{ formatUTC(scope.row.startTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="endTime" label="结束时间" width="160">
        <template #default="scope">
          {{ formatUTC(scope.row.endTime) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="150" align="center">
        <template #default="scope">
          <el-tag :type="statusType(scope.row)">
            {{ calculateStatus(scope.row) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right" align="center">
        <template #default="scope">
          <el-button size="small" @click="viewDetails(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination v-model:current-page="pagination.pageNum" v-model:page-size="pagination.pageSize"
      :page-sizes="[5, 10, 20, 50]" :background="true" layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total" @size-change="handleSizeChange" @current-change="handlePageChange"
      style="margin-top: 20px;" />


    <!-- 培训详情对话框 -->
    <el-dialog v-model="detailVisible" title="培训详情" width="60%">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="培训标题">{{ currentDetail?.title }}</el-descriptions-item>
        <el-descriptions-item label="创建人">{{ currentDetail?.creator }}</el-descriptions-item>
        <el-descriptions-item label="开始时间">{{ formatUTC(currentDetail?.startTime) }}</el-descriptions-item>
        <el-descriptions-item label="结束时间">{{ formatUTC(currentDetail?.endTime) }}</el-descriptions-item>
        <el-descriptions-item label="参与人员" :span="2">
          <el-tag v-for="(participant, index) in currentDetail?.participants" :key="index"
            style="margin-right: 5px; margin-bottom: 5px;">
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
import { formatUTC } from '@/utils/format'
import dayjs from 'dayjs'
import { ElMessage } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import {
  getTrainingDetailSvc,
  getTrainingListSvc
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

const detailVisible = ref(false)

const formRef = ref()



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
      console.log(currentDetail)
      detailVisible.value = true
    }
  } catch (error) {
    ElMessage.error('获取详情失败')
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

.el-tag+.el-tag {
  margin-left: 10px;
}
</style>