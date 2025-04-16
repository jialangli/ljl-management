<template>
  <div class="department-list">
    <!-- 搜索和操作栏 -->
    <div class="operation-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="请输入部门名称搜索"
        class="search-input"
        clearable
        @clear="handleSearch"
        @keyup.enter="handleSearch"
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>新增部门
      </el-button>
    </div>

    <!-- 部门列表表格 -->
    <el-table
      v-loading="loading"
      :data="departmentList"
      border
      style="width: 100%"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="部门名称" />
      <el-table-column prop="manager" label="部门主管" />
      <el-table-column prop="employeeCount" label="员工人数" width="100" />
      <el-table-column prop="createTime" label="创建时间" width="180" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button-group>
            <el-button type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/编辑部门对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增部门' : '编辑部门'"
      width="500px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="部门主管" prop="manager">
          <el-input v-model="form.manager" placeholder="请输入部门主管姓名" />
        </el-form-item>
        <el-form-item label="部门描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入部门描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'

// 搜索关键词
const searchKeyword = ref('')

// 表格数据
const loading = ref(false)
const departmentList = ref([
  {
    id: 1,
    name: '技术部',
    manager: '张三',
    employeeCount: 35,
    createTime: '2024-03-20 10:00:00'
  },
  {
    id: 2,
    name: '人事部',
    manager: '李四',
    employeeCount: 20,
    createTime: '2024-03-20 10:00:00'
  }
])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

// 对话框
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref()

// 表单数据
const form = reactive({
  name: '',
  manager: '',
  description: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  manager: [
    { required: true, message: '请输入部门主管', trigger: 'blur' }
  ]
}

// 搜索
const handleSearch = () => {
  // TODO: 调用搜索接口
  console.log('搜索关键词：', searchKeyword.value)
}

// 新增部门
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  form.name = ''
  form.manager = ''
  form.description = ''
}

// 编辑部门
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  form.name = row.name
  form.manager = row.manager
  form.description = row.description || ''
}

// 删除部门
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确定要删除部门"${row.name}"吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用删除接口
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      // TODO: 调用新增/编辑接口
      ElMessage.success(dialogType.value === 'add' ? '新增成功' : '编辑成功')
      dialogVisible.value = false
    }
  })
}

// 分页大小改变
const handleSizeChange = (val: number) => {
  pageSize.value = val
  // TODO: 重新加载数据
}

// 当前页改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  // TODO: 重新加载数据
}
</script>

<style scoped>
.department-list {
  padding: 20px;
}

.operation-bar {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-input {
  width: 300px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-button-group) {
  .el-button {
    margin-left: 0;
  }
}
</style>
