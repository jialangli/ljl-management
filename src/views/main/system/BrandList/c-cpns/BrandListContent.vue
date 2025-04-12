<template>
  <div class="content">
    <div class="header">
      <h3 class="title">品牌列表</h3>
    </div>
    <div class="table">
      <el-table :data="usersList" border style="width: 100%">
        <el-table-column align="center" type="selection" width="60px"></el-table-column>
        <el-table-column align="center" type="index" label="商品ID" width="60px" fixed></el-table-column>
        <el-table-column align="center" label="商品名称" prop="productName" width="150px"></el-table-column>
        <el-table-column align="center" label="分类" prop="category" width="150px"></el-table-column>
        <el-table-column align="center" label="商品描述" prop="skuInfo" width="150px"></el-table-column>
        <el-table-column align="center" label="品牌" prop="brandName" width="100px"></el-table-column>
        <el-table-column align="center" label="价格￥" prop="price" width="100px"></el-table-column>
        <el-table-column align="center" label="库存" prop="stock" width="100px"></el-table-column>
        <el-table-column align="center" label="状态" prop="status" width="100px" fixed>
          <template #default="scope">
            <span>{{ scope.row.status ? '启用' : '禁用' }}</span>
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column align="center" label="操作" width="250px">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              plain
              @click="handleEditBtnClick(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              :type="scope.row.status ? 'danger' : 'success'"
              plain
              @click="toggleStatus(scope.row)"
            >
              {{ scope.row.status ? '停用' : '启用' }}
            </el-button>
            <el-button
              v-if="isDelete"
              size="small"
              icon="Delete"
              type="danger"
              text
              @click="handleDeleteBtnClick(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 30]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="usersTotalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import useSystemStore from '@/store/main/system/system'
import usePermissions from '@/hooks/usePermissions'

// 定义事件
const emit = defineEmits(['newClick', 'editClick'])

// 用户的权限判断
const isCreate = usePermissions('users:create')
const isDelete = usePermissions('users:delete')
const isUpdate = usePermissions('users:update')
const isQuery = usePermissions('users:query')

// 发起请求，获取用户列表数据
const systemStore = useSystemStore()
const currentPage = ref(1)
const pageSize = ref(10)

// 模拟商品数据
const mockProducts = [
  { id: 1, productName: "无线蓝牙耳机", category: "电子产品", skuInfo: "高保真音质，适用于手机和电脑", brandName: "音响大师", price: 299.00, stock: 150, status: true },
  { id: 2, productName: "智能手表", category: "穿戴设备", skuInfo: "心率监测，运动追踪，长效电池", brandName: "智联科技", price: 899.00, stock: 75, status: true },
  { id: 3, productName: "4K高清电视", category: "家电", skuInfo: "超高清画质，支持HDR", brandName: "视界科技", price: 4999.00, stock: 30, status: true },
  { id: 4, productName: "便携式充电宝", category: "配件", skuInfo: "10000mAh，轻巧便携", brandName: "移动电源", price: 99.00, stock: 200, status: true },
  { id: 5, productName: "高性能游戏鼠标", category: "外设", skuInfo: "可调节DPI，RGB灯效", brandName: "电竞王者", price: 249.00, stock: 120, status: true },
  { id: 6, productName: "家用咖啡机", category: "厨房电器", skuInfo: "一键式操作，快速出咖啡", brandName: "咖啡之家", price: 799.00, stock: 50, status: true },
  { id: 7, productName: "旅行背包", category: "户外用品", skuInfo: "防水设计，适合短途旅行", brandName: "探险者", price: 199.00, stock: 100, status: true },
  { id: 8, productName: "蓝牙音响", category: "音响设备", skuInfo: "重低音，长续航", brandName: "音乐之声", price: 399.00, stock: 80, status: true },
  { id: 9, productName: "智能家居摄像头", category: "智能家居", skuInfo: "1080P高清，移动侦测", brandName: "家居卫士", price: 499.00, stock: 60, status: true },
  { id: 10, productName: "运动鞋", category: "服装", skuInfo: "舒适透气，适合跑步", brandName: "运动先锋", price: 599.00, stock: 140, status: true },
];

// 使用模拟数据
const usersList = ref(mockProducts)
const usersTotalCount = ref(mockProducts.length)

// 页码相关的逻辑
function handleSizeChange() {
  fetchUserListData()
}

function handleCurrentChange() {
  fetchUserListData()
}

// 发送网络请求获取用户列表数据
function fetchUserListData(formData: any = {}) {
  if (!isQuery) return

  // 获取 offset/size
  const size = pageSize.value
  const offset = (currentPage.value - 1) * size
  const pageInfo = { size, offset }

  // 发起网络请求
  const queryInfo = { ...pageInfo, ...formData }
  // 这里可以调用后端接口获取数据
  // systemStore.postUsersListAction(queryInfo)
}

// 删除/新建/编辑的操作
function handleDeleteBtnClick(id: number) {
  // systemStore.deleteUserByIdAction(id)
}

function handleNewUserClick() {
  emit('newClick')
}

function handleEditBtnClick(itemData: any) {
  emit('editClick', itemData)
}

// 切换状态
function toggleStatus(row: any) {
  const newStatus = !row.status
  // systemStore.updateUserStatusAction(row.id, newStatus)
}

defineExpose({ fetchUserListData })
</script>

<style lang="less" scoped>
.content {
  margin-top: 20px;
  padding: 20px;
  background-color: #fff;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 10px;

  .title {
    font-size: 22px;
  }
}

.table {
  :deep(.el-table__cell) {
    padding: 12px 0;
  }
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>
