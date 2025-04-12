<template>
  <div class="content">
    <div class="header">
      <h3 class="title">订单列表</h3>
    </div>
    <div class="table">
      <el-table :data="orderList" border style="width: 100%">
        <el-table-column align="center" type="selection" width="60px"></el-table-column>
        <el-table-column align="center" type="index" label="订单编号" width="150px"></el-table-column>
        <el-table-column align="center" label="商品名称" prop="name" width="150px"></el-table-column>
        <el-table-column align="center" label="商品描述" prop="skuId" width="150px"></el-table-column>
        <el-table-column align="center" label="店铺名称" prop="shopName" width="150px"></el-table-column>
        <el-table-column align="center" label="数量" prop="quantity" width="150px"></el-table-column>
        <el-table-column align="center" label="价格￥" prop="price" width="100px"></el-table-column>
        <el-table-column align="center" label="下单时间" prop="orderTime" width="150px"></el-table-column>
        <el-table-column align="center" label="收件人" prop="recipient" width="150px"></el-table-column>
        <el-table-column align="center" label="状态" prop="status" width="150px">
          <template #default="scope">
            <span>{{ scope.row.status }}</span>
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column align="center" label="操作" width="200px">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              plain
              @click="handleEditBtnClick(scope.row)"
              icon="edit"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              icon="delete"
              @click="handleDeleteBtnClick(scope.row.orderNumber)"
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
        :total="orderTotalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义事件
const emit = defineEmits(['editClick', 'deleteClick'])

// 模拟订单数据
const mockOrders = [
  { id: 1, name: "无线蓝牙耳机", skuId: "SKU001", shopName: "音响大师", quantity: 1, price: 299.00, orderTime: "2023-10-01 10:00", recipient: "张三", status: "已发货" },
  { id: 2, name: "智能手表", skuId: "SKU002", shopName: "智联科技", quantity: 2, price: 899.00, orderTime: "2023-10-02 11:00", recipient: "李四", status: "待发货" },
  { id: 3, name: "4K高清电视", skuId: "SKU003", shopName: "视界科技", quantity: 1, price: 4999.00, orderTime: "2023-10-03 12:00", recipient: "王五", status: "已完成" },
  { id: 4, name: "便携式充电宝", skuId: "SKU004", shopName: "移动电源", quantity: 3, price: 99.00, orderTime: "2023-10-04 13:00", recipient: "赵六", status: "已发货" },
  { id: 5, name: "高性能游戏鼠标", skuId: "SKU005", shopName: "电竞王者", quantity: 1, price: 249.00, orderTime: "2023-10-05 14:00", recipient: "钱七", status: "待发货" },
  { id: 6, name: "家用咖啡机", skuId: "SKU006", shopName: "咖啡之家", quantity: 1, price: 799.00, orderTime: "2023-10-06 15:00", recipient: "孙八", status: "已完成" },
  { id: 7, name: "旅行背包", skuId: "SKU007", shopName: "探险者", quantity: 2, price: 199.00, orderTime: "2023-10-07 16:00", recipient: "周九", status: "已发货" },
  { id: 8, name: "蓝牙音响", skuId: "SKU008", shopName: "音乐之声", quantity: 1, price: 399.00, orderTime: "2023-10-08 17:00", recipient: "吴十", status: "待发货" },
  { id: 9, name: "智能家居摄像头", skuId: "SKU009", shopName: "家居卫士", quantity: 1, price: 499.00, orderTime: "2023-10-09 18:00", recipient: "郑十一", status: "已完成" },
  { id: 10, name: "运动鞋", skuId: "SKU010", shopName: "运动先锋", quantity: 1, price: 599.00, orderTime: "2023-10-10 19:00", recipient: "冯十二", status: "待发货" },
];

// 使用模拟数据
const orderList = ref(mockOrders)
const orderTotalCount = ref(mockOrders.length)

// 页码相关的逻辑
const currentPage = ref(1)
const pageSize = ref(10)

function handleSizeChange() {
  fetchOrderListData()
}

function handleCurrentChange() {
  fetchOrderListData()
}

// 发送网络请求获取订单列表数据
function fetchOrderListData(formData: any = {}) {
  // 这里可以调用后端接口获取数据
}

// 删除/编辑的操作
function handleDeleteBtnClick(orderNumber: string) {
  emit('deleteClick', orderNumber)
}

function handleEditBtnClick(order: any) {
  emit('editClick', order)
}

defineExpose({ fetchOrderListData })
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
