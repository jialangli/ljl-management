<template>
  <div class="dashboard">
    <!-- 数据统计卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>员工总数</span>
              <el-icon>
                <User />
              </el-icon>
            </div>
          </template>
          <div class="card-content">
            <span class="number">{{ statistics.employeeCount }}</span>
            <span class="unit">人</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>部门总数</span>
              <el-icon>
                <Office />
              </el-icon>
            </div>
          </template>
          <div class="card-content">
            <span class="number">{{ statistics.departmentCount }}</span>
            <span class="unit">个</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>本月考勤</span>
              <el-icon>
                <Calendar />
              </el-icon>
            </div>
          </template>
          <div class="card-content">
            <span class="number">{{ statistics.attendanceRate }}</span>
            <span class="unit">%</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>待审批</span>
              <el-icon>
                <Bell />
              </el-icon>
            </div>
          </template>
          <div class="card-content">
            <span class="number">{{ statistics.pendingApprovals }}</span>
            <span class="unit">条</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>部门人员分布</span>
            </div>
          </template>
          <div class="chart-container">
            <div
              ref="departmentChartRef"
              class="department-chart"
              style="width: 100%; height: 300px"
            ></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>考勤统计</span>
            </div>
          </template>
          <div class="chart-container">
            <div
              ref="attendanceChartRef"
              class="attendance-chart"
              style="width: 100%; height: 300px"
            ></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近动态 -->
    <el-card shadow="hover" class="activity-card">
      <template #header>
        <div class="card-header">
          <span>最近动态</span>
        </div>
      </template>
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in recentActivities"
          :key="index"
          :timestamp="activity.time"
          :type="activity.type"
        >
          {{ activity.content }}
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Bell, Calendar, OfficeBuilding as Office, User } from "@element-plus/icons-vue";
import type { EChartsOption } from "echarts"; // 引入 EChartsOption 类型
import * as echarts from "echarts";
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";

// 模拟数据
const statistics = ref({
  employeeCount: 10,
  departmentCount: 5,
  attendanceRate: 82,
  pendingApprovals: 3,
});

const recentActivities = ref([
  {
    content: "张三提交了请假申请",
    time: "2024-03-20 10:30",
    type: "primary",
  },
  {
    content: "李四完成了考勤打卡",
    time: "2024-03-20 09:15",
    type: "success",
  },
  {
    content: "王五加入了技术部",
    time: "2024-03-19 16:45",
    type: "info",
  },
  {
    content: "人事部更新了考勤规则",
    time: "2024-03-19 14:20",
    type: "warning",
  },
]);

// 使用正确的类型定义 ref
const departmentChartRef = ref<HTMLElement | null>(null);
const attendanceChartRef = ref<HTMLElement | null>(null);

//图表实例
let departmentChartInstance: echarts.ECharts | null = null;
let attendanceChartInstance: echarts.ECharts | null = null;

// 初始化部门分布图表
const initDepartmentChart = () => {
  if (departmentChartRef.value) {
    departmentChartInstance = echarts.init(departmentChartRef.value);
    const option: EChartsOption = {
      //添加类型标注
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        left: 10,
        data: ["技术部", "人事部", "财务部", "市场部", "运营部"],
      },
      series: [
        {
          name: "部门分布",
          type: "pie",
          radius: ["50%", "70%"],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: "center",
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "20",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 35, name: "技术部" },
            { value: 20, name: "人事部" },
            { value: 15, name: "财务部" },
            { value: 25, name: "市场部" },
            { value: 5, name: "运营部" },
          ],
        },
      ],
    };
    departmentChartInstance.setOption(option);
  } else {
    console.error("Department chart container not found."); // 加入错误处理
  }
};

// 初始化考勤统计图表
const initAttendanceChart = () => {
  if (attendanceChartRef.value) {
    attendanceChartInstance = echarts.init(attendanceChartRef.value);
    const option: EChartsOption = {
      //添加类型标注
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      legend: {
        data: ["正常", "迟到", "早退", "缺勤"],
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: ["周一", "周二", "周三", "周四", "周五"],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "正常",
          type: "bar",
          stack: "total",
          data: [15, 21, 16, 17, 14],
        },
        {
          name: "迟到",
          type: "bar",
          stack: "total",
          data: [2, 3, 1, 2, 1],
        },
        {
          name: "早退",
          type: "bar",
          stack: "total",
          data: [1, 2, 1, 1, 0],
        },
        {
          name: "缺勤",
          type: "bar",
          stack: "total",
          data: [0, 1, 0, 0, 1],
        },
      ],
    };
    attendanceChartInstance.setOption(option);
  } else {
    console.error("Attendance chart container not found."); // 加入错误处理
  }
};

// 监听窗口大小变化，注意现在使用的是chart实例来 resize
const handleResize = () => {
  if (departmentChartInstance) {
    departmentChartInstance.resize();
  }
  if (attendanceChartInstance) {
    attendanceChartInstance.resize();
  }
};

onMounted(() => {
  nextTick(() => {
    initDepartmentChart();
    initAttendanceChart();
  });
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);

  if (departmentChartInstance) {
    departmentChartInstance.dispose();
    departmentChartInstance = null;
  }

  if (attendanceChartInstance) {
    attendanceChartInstance.dispose();
    attendanceChartInstance = null;
  }
});
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.data-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-content {
  text-align: center;
  padding: 10px 0;
}

.number {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
}

.unit {
  font-size: 14px;
  color: #909399;
  margin-left: 4px;
}

.chart-row {
  margin-bottom: 20px;
}

.chart-container {
  height: 300px;
}

.activity-card {
  margin-bottom: 20px;
}

:deep(.el-timeline-item__content) {
  color: #606266;
}

:deep(.el-timeline-item__timestamp) {
  color: #909399;
}
</style>
