<template>
  <div class="employee-management">
    <!-- 搜索和操作栏 -->
    <div class="operation-bar">
      <div class="search-area">
        <el-input v-model="searchForm.keyword" placeholder="请输入姓名/工号搜索" class="search-input" clearable
          @clear="handleSearch" @keyup.enter="handleSearch">
          <template #prefix>
            <el-icon>
              <Search />
            </el-icon>
          </template>
        </el-input>
        <el-select v-model="searchForm.deptId" placeholder="选择部门" clearable @change="handleSearch">
          <el-option v-for="dept in departments" :key="dept.id" :label="dept.name" :value="dept.id" />
        </el-select>
      </div>
      <el-button type="primary" @click="handleAdd">
        <el-icon>
          <Plus />
        </el-icon>新增员工
      </el-button>
    </div>

    <!-- 员工列表表格 -->
    <el-table v-loading="loading" :data="employeeList" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="realName" label="姓名" width="120" />
      <el-table-column prop="deptName" label="所属部门" width="120" />
      <el-table-column prop="role" label="角色" width="120" />
      <el-table-column prop="phone" label="联系电话" width="120" />
      <el-table-column prop="email" label="邮箱" width="180" />
      <el-table-column prop="createTime" label="创建时间" width="180" />

      <el-table-column label="操作" width="250" fixed="right">
        <template #default="{ row }">
          <el-button-group>
            <el-button type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="success" size="small" @click="handleView(row)">
              详情
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
      <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
        :total="total" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>

    <!-- 新增/编辑员工对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogType === 'add' ? '新增员工' : '编辑员工'" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="姓名" prop="realName">
              <el-input v-model="form.realName" placeholder="请输入姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名" :disabled="dialogType === 'edit'" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" v-if="dialogType === 'add'">
            <el-form-item label="密码" prop="password">
              <el-input v-model="form.password" type="password" placeholder="请输入密码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属部门" prop="deptId">
              <el-select v-model="form.deptId" placeholder="请选择部门">
                <el-option v-for="dept in departments" :key="dept.id" :label="dept.name" :value="dept.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色" prop="role">
              <el-input v-model="form.role" placeholder="请输入角色" />
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
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 员工详情对话框 -->
    <el-dialog v-model="detailVisible" title="员工详情" width="800px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="工号">{{ currentEmployee.id }}</el-descriptions-item>
        <el-descriptions-item label="用户名">{{
          currentEmployee.username
        }}</el-descriptions-item>
        <el-descriptions-item label="姓名">{{
          currentEmployee.realName
        }}</el-descriptions-item>
        <el-descriptions-item label="所属部门">{{
          currentEmployee.deptName
        }}</el-descriptions-item>
        <el-descriptions-item label="角色">{{
          currentEmployee.role
        }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{
          currentEmployee.phone
        }}</el-descriptions-item>
        <el-descriptions-item label="邮箱">{{
          currentEmployee.email
        }}</el-descriptions-item>

        <el-descriptions-item label="备注" :span="2">{{
          currentEmployee.remark
        }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { Plus, Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

import {
  addUserSvc,
  deleteUserSvc,
  getUserDetailSvc,
  getUserListSvc,
  updateUserSvc,
  type IAddUserReq,
  type IUserListReq,
  type IUserListResp
} from '@/service/modules/user/user'

import type { IDepartmentResp } from '@/service/modules/department/department'
import { getDepartmentListSvc } from '@/service/modules/department/department'; // 假设department模块有getList接口
import { formatUTC } from '@/utils/format'


// 搜索表单
const searchForm = reactive({
  keyword: '',
  deptId: undefined,
})

// 部门列表
const departments = ref<IDepartmentResp[]>([])

// 表格数据
const loading = ref(false)
const employeeList = ref<IUserListResp[]>([])

// 分页
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

// 对话框
const dialogVisible = ref(false)
const dialogType = ref<'add' | 'edit'>('add')
const formRef = ref()

// 详情对话框
const detailVisible = ref(false)
const currentEmployee = ref<Partial<IUserListResp>>({}) // 使用Partial使其属性可选

// 表单数据
const form = reactive<IAddUserReq>({ // 或者 IUpdateUserReq，根据实际情况
  username: '',
  password: '',
  realName: '',
  deptId: undefined,
  role: 0,
  phone: '',
  avatar: '',
  email: ''
})

// 表单验证规则
const rules = {
  realName: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ],
  deptId: [
    { required: true, message: '请选择部门', trigger: 'change' }
  ],
  role: [
    { required: true, message: '请输入角色', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],

}

// 加载员工列表
const loadEmployeeList = async () => {
  loading.value = true
  try {
    const params: IUserListReq = {
      pageNum: currentPage.value,
      pageSize: pageSize.value,
      username: searchForm.keyword,
      realName: searchForm.keyword,
      deptId: searchForm.deptId,
    }

    const res = await getUserListSvc(params)

    if (res.code === 200) {
      employeeList.value = res.data || []

      // 转化时间
      employeeList.value.forEach(item => {
        if (item.createTime) item.createTime = formatUTC(item.createTime)

      });


    } else {
      ElMessage.error('加载员工列表失败')
    }
  } catch (error) {
    ElMessage.error('加载员工列表出错，请检查网络')
  } finally {
    loading.value = false
  }
}

// 加载部门列表
const loadDepartmentList = async () => {
  try {
    const res = await getDepartmentListSvc({ pageNum: 1, pageSize: 1000 }) // 获取所有部门，或者按需分页
    if (res.code === 200) {
      departments.value = res.data || []
    } else {
      ElMessage.error('加载部门列表失败')
    }
  } catch (error) {
    ElMessage.error('加载部门列表出错，请检查网络')
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1 // 搜索后回到第一页
  loadEmployeeList()
}

// 新增员工
const handleAdd = () => {
  dialogType.value = 'add'
  dialogVisible.value = true
  resetForm() // 重置表单
}

// 编辑员工
const handleEdit = async (row: IUserListResp) => {

  dialogType.value = 'edit'
  dialogVisible.value = true
  try {
    const res = await getUserDetailSvc(row.id);

    if (res.code === 200) {
      Object.assign(form, res.data);

    } else {
      ElMessage.error('获取用户详情失败')
    }
  } catch (error) {
    ElMessage.error('获取用户详情失败，请检查网络')
  }

}

// 查看详情
const handleView = (row: IUserListResp) => {
  currentEmployee.value = { ...row }
  detailVisible.value = true
}

// 删除员工
const handleDelete = async (row: IUserListResp) => {
  try {
    await ElMessageBox.confirm(`确定要删除用户 "${row.username}" 吗?`, '确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const res = await deleteUserSvc(row.id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      loadEmployeeList() // 重新加载数据
    } else {
      ElMessage.error('删除失败')
    }
  } catch (error) {
    // 取消删除
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        let res
        if (dialogType.value === 'add') {
          res = await addUserSvc(form)
        } else {
          res = await updateUserSvc(form.id, form) //id必须传递
        }

        if (res.code === 200) {
          ElMessage.success(dialogType.value === 'add' ? '新增成功' : '编辑成功')
          dialogVisible.value = false
          loadEmployeeList() // 重新加载数据
        } else {
          ElMessage.error(res.message || (dialogType.value === 'add' ? '新增失败' : '编辑失败'))
        }
      } catch (error) {
        ElMessage.error('操作失败，请检查网络')
      }
    } else {
      ElMessage.error('请检查表单')
    }
  })
}

// 分页大小改变
const handleSizeChange = (val: number) => {
  pageSize.value = val
  loadEmployeeList()
}

// 当前页改变
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  loadEmployeeList()
}

// 重置表单
const resetForm = () => {
  Object.assign(form, {
    username: '',
    password: '',
    realName: '',
    deptId: undefined,
    role: 0,
    phone: '',
    avatar: '',
    email: ''
  })
  formRef.value?.clearValidate() // 清除表单验证
}

onMounted(() => {
  loadEmployeeList()
  loadDepartmentList()
})
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
