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
          <el-input v-model="form.name" />
        </el-form-item>

        <el-form-item label="部门主管" prop="leaderName">
          <el-input v-model="form.leaderName" />
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
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'
import {
  getDepartmentListSvc,
  getDepartmentDetailSvc,
  deleteDepartmentSvc,
  addDepartmentSvc,
  updateDepartmentSvc,
  type IDepartmentListReq,
  type IDepartmentResp,
  type IDepartmentReq
} from '@/service/modules/department/department'

// 搜索关键词
const searchKeyword = ref('')

// 表格数据
const loading = ref(false)
const departmentList = ref<IDepartmentResp[]>([])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref()
const currentDepartmentId = ref<number | null>(null)

// 表单数据
const form = reactive<{
  name: string
  leaderId?: number
  leaderName: string
  description: string
}>({
  name: '',
  leaderId: undefined,
  leaderName: '',
  description: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  leaderName: [
    { required: true, message: '请输入部门主管', trigger: 'blur' }
  ]
}

// 加载部门列表
const loadDepartmentList = async () => {
  try {
    loading.value = true

    const params: IDepartmentListReq = {
      pageNum: currentPage.value,
      pageSize: pageSize.value
    }

    if (searchKeyword.value) {
      params.name = searchKeyword.value
    }

    const res = await getDepartmentListSvc(params)

    if (res.code === 200) {
      departmentList.value = res.data || []
      total.value = res.total || 0
    } else {
      ElMessage.error(res.message || '获取部门列表失败')
    }
  } catch (error) {
    ElMessage.error('请求部门列表出错')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1
  loadDepartmentList()
}

// 新增部门
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  currentDepartmentId.value = null
  form.name = ''
  form.leaderId = undefined
  form.leaderName = ''
  form.description = ''
}

// 编辑部门
const handleEdit = async (row: IDepartmentResp) => {
  try {
    loading.value = true
    dialogType.value = 'edit'
    currentDepartmentId.value = row.id

    // 获取部门详情
    const res = await getDepartmentDetailSvc(row.id)

    if (res.code === 200) {
      const department = res.data
      form.name = department.name
      form.leaderId = department.leaderId
      form.leaderName = department.leaderName || ''
      form.description = '' // 根据实际接口调整
      dialogVisible.value = true
    } else {
      ElMessage.error(res.message || '获取部门详情失败')
    }
  } catch (error) {
    ElMessage.error('请求部门详情出错')
  } finally {
    loading.value = false
  }
}

// 删除部门
const handleDelete = async (row: IDepartmentResp) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除部门"${row.name}"吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const res = await deleteDepartmentSvc(row.id)

    if (res.code === 200) {
      ElMessage.success('删除成功')
      loadDepartmentList()
    } else {
      ElMessage.error(res.message || '删除部门失败')
    }
  } catch (error) {
    // 用户取消删除不做任何操作
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    const departmentData: IDepartmentReq = {
      name: form.name,
      leaderId: form.leaderId
      // 根据实际接口可能需要添加其他字段
    }

    if (dialogType.value === 'add') {
      // 新增部门
      const res = await addDepartmentSvc(departmentData)

      if (res.code === 200) {
        ElMessage.success('新增成功')
        dialogVisible.value = false
        loadDepartmentList()
      } else {
        ElMessage.error(res.message || '新增部门失败')
      }
    } else if (currentDepartmentId.value) {
      // 编辑部门
      const res = await updateDepartmentSvc(currentDepartmentId.value, departmentData)

      if (res.code === 200) {
        ElMessage.success('编辑成功')
        dialogVisible.value = false
        loadDepartmentList()
      } else {
        ElMessage.error(res.message || '编辑部门失败')
      }
    }
  } catch (error) {
    // 验证失败不做任何操作
  }
}

// 分页大小改变
const handleSizeChange = (val: number) => {
  pageSize.value = val
  loadDepartmentList()
}

// 当前页改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  loadDepartmentList()
}

// 初始化加载数据
onMounted(() => {
  loadDepartmentList()
})
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
