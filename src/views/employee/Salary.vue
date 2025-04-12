<template>
  <div class="salary">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>工资管理</span>
          <el-date-picker
            v-model="selectedMonth"
            type="month"
            placeholder="选择月份"
            @change="handleMonthChange"
          />
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>本月工资</span>
              </div>
            </template>
            <div class="salary-info">
              <p>基本工资：{{ currentSalary?.baseSalary }}</p>
              <p>加班工资：{{ currentSalary?.overtimeSalary }}</p>
              <p>绩效工资：{{ currentSalary?.performanceSalary }}</p>
              <p>补贴：{{ currentSalary?.allowance }}</p>
              <p>扣款：{{ currentSalary?.deduction }}</p>
              <p class="total">实发工资：{{ currentSalary?.total }}</p>
            </div>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <span>工资记录</span>
              </div>
            </template>
            <el-table :data="salaryRecords" style="width: 100%">
              <el-table-column prop="month" label="月份" />
              <el-table-column prop="baseSalary" label="基本工资" />
              <el-table-column prop="overtimeSalary" label="加班工资" />
              <el-table-column prop="performanceSalary" label="绩效工资" />
              <el-table-column prop="allowance" label="补贴" />
              <el-table-column prop="deduction" label="扣款" />
              <el-table-column prop="total" label="实发工资" />
              <el-table-column label="操作" width="100">
                <template #default="{ row }">
                  <el-button type="text" @click="handleViewDetail(row)">
                    查看详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>

      <!-- 工资详情对话框 -->
      <el-dialog v-model="detailVisible" title="工资详情" width="600px">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="月份">
            {{ salaryDetail.month }}
          </el-descriptions-item>
          <el-descriptions-item label="基本工资">
            {{ salaryDetail.baseSalary }}
          </el-descriptions-item>
          <el-descriptions-item label="加班工资">
            {{ salaryDetail.overtimeSalary }}
          </el-descriptions-item>
          <el-descriptions-item label="绩效工资">
            {{ salaryDetail.performanceSalary }}
          </el-descriptions-item>
          <el-descriptions-item label="补贴">
            {{ salaryDetail.allowance }}
          </el-descriptions-item>
          <el-descriptions-item label="扣款">
            {{ salaryDetail.deduction }}
          </el-descriptions-item>
          <el-descriptions-item label="实发工资" :span="2">
            <span class="total">{{ salaryDetail.total }}</span>
          </el-descriptions-item>
        </el-descriptions>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

const selectedMonth = ref(new Date())
const detailVisible = ref(false)

// 模拟数据
const currentSalary = ref({
  baseSalary: '8000',
  overtimeSalary: '500',
  performanceSalary: '1000',
  allowance: '300',
  deduction: '200',
  total: '9600'
})

const salaryRecords = ref([
  {
    month: '2024-03',
    baseSalary: '8000',
    overtimeSalary: '400',
    performanceSalary: '900',
    allowance: '300',
    deduction: '200',
    total: '9400'
  },
  {
    month: '2024-02',
    baseSalary: '8000',
    overtimeSalary: '600',
    performanceSalary: '1100',
    allowance: '300',
    deduction: '200',
    total: '9800'
  }
])

const salaryDetail = reactive({
  month: '',
  baseSalary: '',
  overtimeSalary: '',
  performanceSalary: '',
  allowance: '',
  deduction: '',
  total: ''
})

const handleMonthChange = (val: Date) => {
  // 根据选择的月份获取工资数据
  console.log('选择月份：', val)
}

const handleViewDetail = (row: any) => {
  Object.assign(salaryDetail, row)
  detailVisible.value = true
}
</script>

<style scoped>
.salary {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.salary-info {
  font-size: 14px;
  color: #606266;
}

.salary-info p {
  margin: 10px 0;
}

.total {
  font-size: 16px;
  font-weight: bold;
  color: #f56c6c;
}

:deep(.el-descriptions__label) {
  width: 120px;
}
</style>
