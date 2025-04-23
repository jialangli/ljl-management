<template>
  <div class="training-list-container">
    <h1>培训记录</h1>

    <!-- 搜索和过滤 -->
    <div class="search-filter">
      <el-input v-model="searchKeyword" placeholder="搜索培训名称" clearable />
      <!-- 其他搜索和过滤选项，例如培训状态、培训日期等 -->
      <el-button type="primary" @click="searchTraining">搜索</el-button>
      <el-button @click="resetSearch">重置</el-button>
    </div>

    <!-- 培训列表 -->
    <el-table :data="filteredTrainingList" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="50" />
      <el-table-column prop="name" label="培训名称" width="200" />
      <el-table-column prop="description" label="描述" />
      <el-table-column prop="startDate" label="开始日期" width="120">
        <template #default="scope">{{ formatDate(scope.row.startDate) }}</template>
      </el-table-column>
      <el-table-column prop="endDate" label="结束日期" width="120">
        <template #default="scope">{{ formatDate(scope.row.endDate) }}</template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template #default="scope">
          <el-tag :type="statusType(scope.row.status)">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="small" @click="viewDetails(scope.row)">查看</el-button>
          <!-- 其他操作按钮，例如报名、取消报名等 -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 50, 100]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="trainingList.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 培训详情对话框 -->
    <el-dialog v-model="dialogVisible" title="培训详情" width="60%">
      <TrainingDetail :training="selectedTraining" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

interface Training {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  // 其他培训相关属性
}

//Data:
const trainingList = ref<Training[]>([]); // 存储培训列表数据
const searchKeyword = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const dialogVisible = ref(false);
const selectedTraining = ref<Training | null>(null);

//Pagination options
const small = ref(false)
const background = ref(true)
const disabled = ref(false)

//Computed Properties:
const filteredTrainingList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return trainingList.value
    .filter((training) => training.name.toLowerCase().includes(searchKeyword.value.toLowerCase()))
    .slice(start, end);
});

//Functions/Methods:
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(); // 你可以自定义日期格式
};

const statusType = (status: string) => {
  if (status === '进行中') {
    return 'success';
  } else if (status === '已结束') {
    return 'info';
  } else {
    return 'warning';
  }
};

const searchTraining = () => {
  // 执行搜索操作，可以调用 API 或直接过滤 data
  console.log('搜索关键词:', searchKeyword.value);
  currentPage.value = 1; // Reset page to 1
};

const resetSearch = () => {
  searchKeyword.value = '';
  currentPage.value = 1;
  // 重置其他搜索条件
};

const viewDetails = (training: Training) => {
  selectedTraining.value = training;
  dialogVisible.value = true;
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
};

const handleCurrentChange = (page: number) => {
  currentPage.value = page;
};


onMounted(() => {

  setTimeout(() => {
    trainingList.value = [
      { id: 1, name: 'Vue.js 3.0 基础入门', description: 'Vue 3.0 基础知识', startDate: '2024-01-15', endDate: '2024-01-20', status: '已结束' },
      { id: 2, name: 'React Hooks 深入浅出', description: 'React Hooks 使用技巧', startDate: '2024-02-01', endDate: '2024-02-10', status: '进行中' },
      { id: 3, name: '前端性能优化实战', description: '前端性能优化方法', startDate: '2024-03-01', endDate: '2024-03-05', status: '未开始' },
      { id: 4, name: 'Webpack5高级教程', description: 'Webpack5配置', startDate: '2024-04-01', endDate: '2024-04-05', status: '已结束' },
      { id: 5, name: 'Node.js 入门与实践', description: 'Node.js 基础知识', startDate: '2024-05-01', endDate: '2024-05-05', status: '进行中' },
      { id: 6, name: '前端面试准备', description: '面试常见问题分享', startDate: '2024-05-01', endDate: '2024-05-05', status: '已结束' },
      { id: 7, name: 'Typescript', description: '强类型语言学习', startDate: '2024-05-01', endDate: '2024-05-05', status: '进行中' },
      { id: 8, name: '项目管理', description: 'Gantt图表原理', startDate: '2024-05-01', endDate: '2024-05-05', status: '未开始' },
    ];
  }, 500);
});
</script>

<style scoped>
.training-list-container {
  padding: 20px;
}

.search-filter {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
}
</style>
