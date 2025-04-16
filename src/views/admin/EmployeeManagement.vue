<template>
  <div class="employee-management">
    <!-- 搜索和操作栏 -->
    <div class="operation-bar">
      <div class="search-area">
        <el-input
          v-model="searchForm.keyword"
          placeholder="请输入姓名/工号搜索"
          class="search-input"
          clearable
          @clear="handleSearch"
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="searchForm.department" placeholder="选择部门" clearable @change="handleSearch">
          <el-option
            v-for="dept in departments"
            :key="dept.id"
            :label="dept.name"
            :value="dept.id"
          />
        </el-select>
        <el-select v-model="searchForm.status" placeholder="在职状态" clearable @change="handleSearch">
          <el-option label="在职" value="active" />
          <el-option label="离职" value="inactive" />
        </el-select>
      </div>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>新增员工
      </el-button>
    </div>

    <!-- 员工列表表格 -->
    <el-table
      v-loading="loading"
      :data="employeeList"
      border
      style="width: 100%"
    >
      <el-table-column prop="id" label="工号" width="100" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="department" label="所属部门" width="120" />
      <el-table-column prop="position" label="职位" width="120" />
      <el-table-column prop="phone" label="联系电话" width="120" />
      <el-table-column prop="email" label="邮箱" width="180" />
      <el-table-column prop="entryDate" label="入职日期" width="120" />
      <el-table-column prop="status" label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
            {{ row.status === 'active' ? '在职' : '离职' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" fixed="right">
        <template #default="{ row }">
          <el-button-group>
            <el-button type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="success" size="small" @click="handleView(row)">
              详情
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(row)"
              :disabled="row.status === 'inactive'"
            >
              离职
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

    <!-- 新增/编辑员工对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '新增员工' : '编辑员工'"
      width="600px"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工号" prop="id">
              <el-input v-model="form.id" placeholder="请输入工号" :disabled="dialogType === 'edit'" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="所属部门" prop="department">
              <el-select v-model="form.department" placeholder="请选择部门">
                <el-option
                  v-for="dept in departments"
                  :key="dept.id"
                  :label="dept.name"
                  :value="dept.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职位" prop="position">
              <el-input v-model="form.position" placeholder="请输入职位" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="入职日期" prop="entryDate">
              <el-date-picker
                v-model="form.entryDate"
                type="date"
                placeholder="选择入职日期"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status">
              <el-select v-model="form.status" placeholder="请选择状态">
                <el-option label="在职" value="active" />
                <el-option label="离职" value="inactive" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
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

    <!-- 员工详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="员工详情"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="工号">{{ currentEmployee.id }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{ currentEmployee.name }}</el-descriptions-item>
        <el-descriptions-item label="所属部门">{{ currentEmployee.department }}</el-descriptions-item>
        <el-descriptions-item label="职位">{{ currentEmployee.position }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ currentEmployee.phone }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{ currentEmployee.email }}</el-descriptions-item>
        <el-descriptions-item label="入职日期">{{ currentEmployee.entryDate }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentEmployee.status === 'active' ? 'success' : 'danger'">
            {{ currentEmployee.status === 'active' ? '在职' : '离职' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ currentEmployee.remark }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'

// 搜索表单
const searchForm = reactive({
  keyword: '',
  department: '',
  status: ''
})

// 部门列表
const departments = ref([
  { id: 1, name: '技术部' },
  { id: 2, name: '人事部' },
  { id: 3, name: '财务部' },
  { id: 4, name: '市场部' }
])

// 表格数据
const loading = ref(false)
const employeeList = ref([
  {
    id: 'EMP001',
    name: '张三',
    department: '技术部',
    position: '前端开发',
    phone: '13800138000',
    email: 'zhangsan@example.com',
    entryDate: '2024-01-01',
    status: 'active',
    remark: '优秀员工'
  },
  {
    id: 'EMP002',
    name: '李四',
    department: '人事部',
    position: 'HR专员',
    phone: '13800138001',
    email: 'lisi@example.com',
    entryDate: '2024-02-01',
    status: 'active',
    remark: ''
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

// 详情对话框
const detailVisible = ref(false)
const currentEmployee = ref({})

// 表单数据
const form = reactive({
  id: '',
  name: '',
  department: '',
  position: '',
  phone: '',
  email: '',
  entryDate: '',
  status: 'active',
  remark: ''
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  id: [
    { required: true, message: '请输入工号', trigger: 'blur' }
  ],
  department: [
    { required: true, message: '请选择部门', trigger: 'change' }
  ],
  position: [
    { required: true, message: '请输入职位', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  entryDate: [
    { required: true, message: '请选择入职日期', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

// 搜索
const handleSearch = () => {
  // TODO: 调用搜索接口
  console.log('搜索条件：', searchForm)
}

// 新增员工
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  Object.keys(form).forEach(key => {
    form[key] = key === 'status' ? 'active' : ''
  })
}

// 编辑员工
const handleEdit = (row: any) => {
  dialogType.value = 'edit'
  dialogVisible.value = true
  Object.keys(form).forEach(key => {
    form[key] = row[key]
  })
}

// 查看详情
const handleView = (row: any) => {
  currentEmployee.value = { ...row }
  detailVisible.value = true
}

// 删除/离职
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    `确定要将员工"${row.name}"设置为离职状态吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用离职接口
    ElMessage.success('操作成功')
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
.employee-management {
  padding: 20px;
}

.operation-bar {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-area {
  display: flex;
  gap: 10px;
}

.search-input {
  width: 200px;
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

:deep(.el-descriptions) {
  margin: 20px 0;
}
</style>
