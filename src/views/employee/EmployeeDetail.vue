<template>
  <div class="employee-detail">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>员工详情</span>
          <el-button type="primary" @click="handleEdit">编辑信息</el-button>
        </div>
      </template>

      <el-descriptions :column="2" border>
        <el-descriptions-item label="员工编号">
          {{ employeeInfo.id }}
        </el-descriptions-item>
        <el-descriptions-item label="姓名">
          {{ employeeInfo.name }}
        </el-descriptions-item>
        <el-descriptions-item label="性别">
          {{ employeeInfo.gender }}
        </el-descriptions-item>
        <el-descriptions-item label="年龄">
          {{ employeeInfo.age }}
        </el-descriptions-item>
        <el-descriptions-item label="部门">
          {{ employeeInfo.department }}
        </el-descriptions-item>
        <el-descriptions-item label="职位">
          {{ employeeInfo.position }}
        </el-descriptions-item>
        <el-descriptions-item label="入职时间">
          {{ employeeInfo.entryDate }}
        </el-descriptions-item>
        <el-descriptions-item label="联系电话">
          {{ employeeInfo.phone }}
        </el-descriptions-item>
        <el-descriptions-item label="邮箱">
          {{ employeeInfo.email }}
        </el-descriptions-item>
        <el-descriptions-item label="地址">
          {{ employeeInfo.address }}
        </el-descriptions-item>
        <el-descriptions-item label="学历">
          {{ employeeInfo.education }}
        </el-descriptions-item>
        <el-descriptions-item label="专业">
          {{ employeeInfo.major }}
        </el-descriptions-item>
        <el-descriptions-item label="毕业院校">
          {{ employeeInfo.school }}
        </el-descriptions-item>
        <el-descriptions-item label="毕业时间">
          {{ employeeInfo.graduationDate }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 编辑对话框 -->
      <el-dialog v-model="dialogVisible" title="编辑员工信息" width="500px">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="form.gender">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input-number v-model="form.age" :min="18" :max="60" />
          </el-form-item>
          <el-form-item label="部门" prop="department">
            <el-input v-model="form.department" placeholder="请输入部门" />
          </el-form-item>
          <el-form-item label="职位" prop="position">
            <el-input v-model="form.position" placeholder="请输入职位" />
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入联系电话" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="地址" prop="address">
            <el-input v-model="form.address" placeholder="请输入地址" />
          </el-form-item>
          <el-form-item label="学历" prop="education">
            <el-select v-model="form.education" placeholder="请选择学历">
              <el-option label="高中" value="高中" />
              <el-option label="大专" value="大专" />
              <el-option label="本科" value="本科" />
              <el-option label="硕士" value="硕士" />
              <el-option label="博士" value="博士" />
            </el-select>
          </el-form-item>
          <el-form-item label="专业" prop="major">
            <el-input v-model="form.major" placeholder="请输入专业" />
          </el-form-item>
          <el-form-item label="毕业院校" prop="school">
            <el-input v-model="form.school" placeholder="请输入毕业院校" />
          </el-form-item>
          <el-form-item label="毕业时间" prop="graduationDate">
            <el-date-picker
              v-model="form.graduationDate"
              type="date"
              placeholder="选择毕业时间"
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

const dialogVisible = ref(false)
const formRef = ref()

// 模拟数据
const employeeInfo = reactive({
  id: '1001',
  name: '张三',
  gender: '男',
  age: 28,
  department: '技术部',
  position: '前端开发工程师',
  entryDate: '2020-01-01',
  phone: '13800138000',
  email: 'zhangsan@example.com',
  address: '北京市海淀区',
  education: '本科',
  major: '计算机科学与技术',
  school: '北京大学',
  graduationDate: '2019-06-01'
})

const form = reactive({ ...employeeInfo })

const rules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
  age: [{ required: true, message: '请输入年龄', trigger: 'blur' }],
  department: [{ required: true, message: '请输入部门', trigger: 'blur' }],
  position: [{ required: true, message: '请输入职位', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
  address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
  education: [{ required: true, message: '请选择学历', trigger: 'change' }],
  major: [{ required: true, message: '请输入专业', trigger: 'blur' }],
  school: [{ required: true, message: '请输入毕业院校', trigger: 'blur' }],
  graduationDate: [
    { required: true, message: '请选择毕业时间', trigger: 'change' }
  ]
}

const handleEdit = () => {
  dialogVisible.value = true
  Object.assign(form, employeeInfo)
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid: boolean) => {
    if (valid) {
      // 调用API
      Object.assign(employeeInfo, form)
      dialogVisible.value = false
      ElMessage.success('修改成功')
    }
  })
}
</script>

<style scoped>
.employee-detail {
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

:deep(.el-descriptions__label) {
  width: 120px;
}
</style>
