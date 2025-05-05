<template>
  <div class="employee-dashboard">
    <!-- 欢迎卡片 -->
    <el-card class="welcome-card">
      <div class="welcome-content">
        <div class="welcome-info">
          <h2>欢迎回来，{{ userInfo.realName }}</h2>
          <p class="time">{{ currentTime }}</p>
          <p class="department">
            <!-- {{ userInfo.deptName }} | {{ getRoleName(userInfo.role) }} -->
            {{ "技术部" }} | {{ getRoleName(userInfo.role) }}
          </p>
        </div>
        <div class="avatar-container">
          <el-avatar :size="80" :src="avatarUrl" v-if="avatarUrl" />
          <el-avatar :size="80" icon="el-icon-user" v-else />
        </div>
      </div>
    </el-card>

    <!-- 快捷打卡卡片 -->
    <el-card class="attendance-card">
      <template #header>
        <div class="card-header">
          <span>今日考勤</span>
          <div class="clock-container">{{ currentTime }}</div>
        </div>
      </template>
      <div class="punch-container">
        <div class="status-container">
          <div class="status-box" v-if="hasClockIn">
            <el-icon class="status-icon success">
              <CircleCheck />
            </el-icon>
            <div class="status-info">
              <div class="status-label">上班打卡</div>
              <div class="status-time">{{ formatTime(clockInTime) }}</div>
            </div>
          </div>
          <div class="status-box" v-else>
            <el-icon class="status-icon">
              <Timer />
            </el-icon>
            <div class="status-info">
              <div class="status-label">上班打卡</div>
              <div class="status-time">未打卡</div>
            </div>
          </div>

          <div class="status-box" v-if="hasClockOut">
            <el-icon class="status-icon success">
              <CircleCheck />
            </el-icon>
            <div class="status-info">
              <div class="status-label">下班打卡</div>
              <div class="status-time">{{ formatTime(clockOutTime) }}</div>
            </div>
          </div>
          <div class="status-box" v-else>
            <el-icon class="status-icon">
              <Timer />
            </el-icon>
            <div class="status-info">
              <div class="status-label">下班打卡</div>
              <div class="status-time">未打卡</div>
            </div>
          </div>
        </div>

        <div class="button-container">
          <el-button type="primary" :disabled="hasClockIn" @click="clockIn" size="large">
            <el-icon class="button-icon">
              <Clock />
            </el-icon>
            上班打卡
          </el-button>
          <el-button type="success" :disabled="!hasClockIn || hasClockOut" @click="clockOut" size="large">
            <el-icon class="button-icon">
              <Timer />
            </el-icon>
            下班打卡
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 信息概览 -->
    <el-row :gutter="20" class="data-overview">
      <el-col :span="12">
        <el-card class="info-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>我的考勤统计</span>
              <el-button type="text" @click="goToAttendance">
                查看详情<el-icon class="el-icon--right">
                  <ArrowRight />
                </el-icon>
              </el-button>
            </div>
          </template>
          <div class="stat-container">
            <div class="stat-item">
              <div class="stat-value">{{ attendanceStats.normalCount || 0 }}</div>
              <div class="stat-label">正常</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ attendanceStats.lateCount || 0 }}</div>
              <div class="stat-label">迟到</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ attendanceStats.earlyCount || 0 }}</div>
              <div class="stat-label">早退</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ attendanceStats.absentCount || 0 }}</div>
              <div class="stat-label">缺勤</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="info-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>我的请假申请</span>
              <el-button type="text" @click="goToLeave">
                查看详情<el-icon class="el-icon--right">
                  <ArrowRight />
                </el-icon>
              </el-button>
            </div>
          </template>
          <div class="stat-container">
            <div class="stat-item">
              <div class="stat-value">{{ leaveStats.pendingCount || 0 }}</div>
              <div class="stat-label">待审批</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ leaveStats.approvedCount || 0 }}</div>
              <div class="stat-label">已通过</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ leaveStats.rejectedCount || 0 }}</div>
              <div class="stat-label">已拒绝</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ leaveStats.totalDays || 0 }}</div>
              <div class="stat-label">总天数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最近工资和培训 -->
    <el-row :gutter="20" class="data-overview">
      <el-col :span="12">
        <el-card class="info-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>最近薪资信息</span>
              <el-button type="text" @click="goToSalary">
                查看详情<el-icon class="el-icon--right">
                  <ArrowRight />
                </el-icon>
              </el-button>
            </div>
          </template>
          <div v-if="latestSalary">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="月份">{{
                latestSalary.month
              }}</el-descriptions-item>
              <el-descriptions-item label="基本工资">{{ latestSalary.baseSalary }} 元</el-descriptions-item>
              <el-descriptions-item label="奖金">{{ latestSalary.bonus || 0 }} 元</el-descriptions-item>
              <el-descriptions-item label="扣款">{{ latestSalary.deduction || 0 }} 元</el-descriptions-item>
              <el-descriptions-item label="总计" :span="2">
                <strong>{{ latestSalary.finalSalary }} 元</strong>
              </el-descriptions-item>
            </el-descriptions>
          </div>
          <el-empty v-else description="暂无薪资记录" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="info-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>近期培训</span>
              <el-button type="text" @click="goToTraining">
                查看详情<el-icon class="el-icon--right">
                  <ArrowRight />
                </el-icon>
              </el-button>
            </div>
          </template>
          <el-table :data="latestTrainings" style="width: 100%" v-if="latestTrainings.length > 0">
            <el-table-column prop="title" label="培训主题" />
            <el-table-column label="状态" width="100" align="center">
              <template #default="scope">
                <el-tag :type="getTrainingStatusType(scope.row)">
                  {{ getTrainingStatus(scope.row) }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
          <el-empty v-else description="暂无培训记录" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷通道 -->
    <el-card class="quick-access-card">
      <template #header>
        <div class="card-header">
          <span>快捷通道</span>
        </div>
      </template>
      <div class="quick-access-container">
        <div class="quick-access-item" @click="goToProfile">
          <el-icon>
            <User />
          </el-icon>
          <span>个人信息</span>
        </div>
        <div class="quick-access-item" @click="goToAttendance">
          <el-icon>
            <Clock />
          </el-icon>
          <span>考勤记录</span>
        </div>
        <div class="quick-access-item" @click="goToLeave">
          <el-icon>
            <Calendar />
          </el-icon>
          <span>请假申请</span>
        </div>
        <div class="quick-access-item" @click="goToSalary">
          <el-icon>
            <Money />
          </el-icon>
          <span>薪资信息</span>
        </div>
        <div class="quick-access-item" @click="goToTraining">
          <el-icon>
            <Reading />
          </el-icon>
          <span>培训记录</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import {
  clockInSvc,
  getPersonalAttendanceSvc,
} from "@/service/modules/attendance/attendance";
import { getPersonalLeaveListSvc } from "@/service/modules/leave/leave";
import { getPersonalSalaryListSvc } from "@/service/modules/salary/salary";
import type { ISalaryResp } from "@/service/modules/salary/types";
import { getTrainingListSvc } from "@/service/modules/training/training";
import type { ITrainingResp } from "@/service/modules/training/types";
import type { IUserInfoResp } from "@/service/modules/user/types";
import { getUserAvatarSvc } from "@/service/modules/user/user";
import { useUserStore } from "@/store/main/user";
import { localCache } from "@/utils/cache/cache";
import { Account_USER } from "@/utils/cache/keys";
import {
  ArrowRight,
  Calendar,
  CircleCheck,
  Clock,
  Money,
  Reading,
  Timer,
  User,
} from "@element-plus/icons-vue";
import dayjs from "dayjs";
import { ElMessage } from "element-plus";
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const userStore = useUserStore();
const userIdNum = computed(() => {
  return userStore.userInfo?.id || 0;
});

// 用户信息
const userInfo = ref<IUserInfoResp>({} as IUserInfoResp);
const avatarUrl = ref("");

// 考勤数据
const hasClockIn = ref(false);
const hasClockOut = ref(false);
const clockInTime = ref("");
const clockOutTime = ref("");

// 考勤统计数据
const attendanceStats = reactive({
  normalCount: 0,
  lateCount: 0,
  earlyCount: 0,
  absentCount: 0,
});

// 请假统计数据
const leaveStats = reactive({
  pendingCount: 0,
  approvedCount: 0,
  rejectedCount: 0,
  totalDays: 0,
});

// 最新薪资信息
const latestSalary = ref<ISalaryResp | null>(null);

// 最近培训信息
const latestTrainings = ref<ITrainingResp[]>([]);

// 时间显示
const currentTime = ref("");
let timer: number;

// 更新时间
const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

// 获取角色名称
const getRoleName = (role: number) => {
  const roleMap: Record<number, string> = {
    1: "管理员",
    0: "普通员工",
  };
  return roleMap[role] || "未知角色";
};

// 格式化时间
const formatTime = (timeString: string) => {
  if (!timeString) return "--";
  return dayjs(timeString).format("HH:mm:ss");
};

// 加载用户信息
const loadUserInfo = () => {
  const employeeInfo = ref(localCache.getCache(Account_USER) || {});
  if (employeeInfo.value) {
    userInfo.value = employeeInfo.value;
    loadAvatar();
  }
};

// 加载头像
const loadAvatar = async () => {
  try {
    if (userInfo.value?.avatar) {
      const blob = await getUserAvatarSvc(userInfo.value.avatar);
      avatarUrl.value = URL.createObjectURL(blob);
    }
  } catch (error) {
    console.error("头像加载失败:", error);
    avatarUrl.value = "";
  }
};

// 加载考勤状态
const loadAttendanceStatus = async () => {
  try {
    const today = dayjs().format("YYYY-MM-DD");
    const res = await getPersonalAttendanceSvc({
      userId: userIdNum.value,
      startDate: today,
    });

    if (res.code === 200) {
      const records = res.data || [];
      hasClockIn.value = records.some((r) => r.type === "上班");
      hasClockOut.value = records.some((r) => r.type === "下班");

      const clockInRecord = records.find((r) => r.type === "上班");
      const clockOutRecord = records.find((r) => r.type === "下班");
      clockInTime.value = clockInRecord?.createTime || "";
      clockOutTime.value = clockOutRecord?.createTime || "";
    }
  } catch (error) {
    console.error("获取考勤状态失败:", error);
  }
};

// 计算考勤统计
const calculateAttendanceStats = async () => {
  try {
    // 获取当月考勤数据
    const startDate = dayjs().startOf("month").format("YYYY-MM-DD");
    const endDate = dayjs().format("YYYY-MM-DD");

    const res = await getPersonalAttendanceSvc({
      userId: userIdNum.value,
      pageSize: 100,
    });

    if (res.code === 200) {
      const records = res.data || [];
      attendanceStats.normalCount = records.filter((r) => r.status === "正常").length;
      attendanceStats.lateCount = records.filter((r) => r.status === "迟到").length;
      attendanceStats.earlyCount = records.filter((r) => r.status === "早退").length;
      attendanceStats.absentCount = records.filter((r) => r.status === "缺勤").length;
    }
  } catch (error) {
    console.error("计算考勤统计失败:", error);
  }
};

// 计算请假统计
const calculateLeaveStats = async () => {
  try {
    const res = await getPersonalLeaveListSvc({
      userId: userIdNum.value,
      pageSize: 100,
    });

    if (res.code === 200) {
      const records = res.data || [];
      leaveStats.pendingCount = records.filter((r) => r.status === 0).length;
      leaveStats.approvedCount = records.filter((r) => r.status === 1).length;
      leaveStats.rejectedCount = records.filter((r) => r.status === 2).length;

      // 计算总请假天数（已通过的）
      let totalDays = 0;
      records
        .filter((r) => r.status === 1)
        .forEach((leave) => {
          const start = dayjs(leave.startTime);
          const end = dayjs(leave.endTime);
          totalDays += end.diff(start, "day") + 1;
        });
      leaveStats.totalDays = totalDays;
    }
  } catch (error) {
    console.error("计算请假统计失败:", error);
  }
};

// 获取最新薪资信息
const fetchLatestSalary = async () => {
  try {
    const res = await getPersonalSalaryListSvc({
      userId: userIdNum.value,
      pageNum: 1,
      pageSize: 1,
    });

    if (res.code === 200 && res.data && res.data.length > 0) {
      latestSalary.value = res.data[0];
    }
  } catch (error) {
    console.error("获取薪资信息失败:", error);
  }
};

// 获取最近培训
const fetchLatestTrainings = async () => {
  try {
    const res = await getTrainingListSvc({
      pageNum: 1,
      pageSize: 3,
    });

    if (res.code === 200) {
      latestTrainings.value = res.data || [];
    }
  } catch (error) {
    console.error("获取培训信息失败:", error);
  }
};

// 打卡操作
const clockIn = async () => {
  try {
    const res = await clockInSvc({ type: "上班" });
    if (res.code === 200) {
      ElMessage.success("上班打卡成功");
      await loadAttendanceStatus();
    }
  } catch (error) {
    ElMessage.error("打卡失败");
  }
};

const clockOut = async () => {
  try {
    const res = await clockInSvc({ type: "下班" });
    if (res.code === 200) {
      ElMessage.success("下班打卡成功");
      await loadAttendanceStatus();
    }
  } catch (error) {
    ElMessage.error("打卡失败");
  }
};

// 获取培训状态
const getTrainingStatus = (training: ITrainingResp) => {
  const now = dayjs();
  const start = dayjs(training.startTime);
  const end = dayjs(training.endTime);

  if (now.isBefore(start)) return "未开始";
  if (now.isAfter(end)) return "已结束";
  return "进行中";
};

const getTrainingStatusType = (training: ITrainingResp) => {
  const status = getTrainingStatus(training);
  const typeMap: Record<string, string> = {
    未开始: "info",
    进行中: "success",
    已结束: "",
  };
  return typeMap[status] || "";
};

// 页面导航
const goToProfile = () => router.push("/employee/UserProfile");
const goToAttendance = () => router.push("/employee/AttendanceList");
const goToLeave = () => router.push("/employee/LeaveList");
const goToSalary = () => router.push("/employee/SalaryList");
const goToTraining = () => router.push("/employee/TrainingList");

// 初始化
onMounted(() => {
  updateTime();
  timer = window.setInterval(updateTime, 1000);

  loadUserInfo();
  loadAttendanceStatus();
  calculateAttendanceStats();
  calculateLeaveStats();
  fetchLatestSalary();
  fetchLatestTrainings();
});

// 清理
onUnmounted(() => {
  clearInterval(timer);
  if (avatarUrl.value && avatarUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(avatarUrl.value);
  }
});
</script>

<style scoped>
.employee-dashboard {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-card {
  margin-bottom: 20px;
  background: linear-gradient(135deg, #67c23a 0%, #409eff 100%);
  color: white;
}

.welcome-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
}

.welcome-info h2 {
  margin: 0;
  font-size: 24px;
  color: white;
  font-weight: 600;
}

.welcome-info .time {
  margin: 10px 0;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
}

.welcome-info .department {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.attendance-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.clock-container {
  font-size: 18px;
  font-weight: bold;
  color: #409eff;
}

.punch-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
}

.status-container {
  display: flex;
  gap: 30px;
}

.status-box {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-icon {
  font-size: 24px;
  color: #909399;
}

.status-icon.success {
  color: #67c23a;
}

.status-info {
  display: flex;
  flex-direction: column;
}

.status-label {
  font-size: 14px;
  color: #606266;
}

.status-time {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.button-container {
  display: flex;
  gap: 15px;
}

.button-icon {
  margin-right: 5px;
}

.data-overview {
  margin-bottom: 20px;
}

.info-card {
  height: 100%;
  margin-bottom: 20px;
}

.stat-container {
  display: flex;
  justify-content: space-around;
  text-align: center;
  padding: 15px 0;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-top: 5px;
}

.quick-access-card {
  margin-bottom: 20px;
}

.quick-access-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 20px;
  padding: 10px 0;
}

.quick-access-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 15px;
  border-radius: 10px;
  transition: background-color 0.3s;
}

.quick-access-item:hover {
  background-color: #f0f9ff;
}

.quick-access-item .el-icon {
  font-size: 24px;
  color: #409eff;
}

@media (max-width: 768px) {
  .punch-container {
    flex-direction: column;
  }

  .welcome-content {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }

  .status-container {
    flex-wrap: wrap;
    justify-content: center;
  }

  .button-container {
    justify-content: center;
  }
}
</style>
