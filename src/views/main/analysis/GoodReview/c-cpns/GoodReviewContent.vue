<template>
  <div class="content">
    <div class="header">
      <h3 class="title">商品列表</h3>
    </div>
    <div class="table">
      <el-table :data="orderList" border style="width: 100%">
        <el-table-column align="center" type="selection" width="60px" />
        <el-table-column
          align="center"
          type="index"
          label="商品ID"
          width="100px"
          prop="id"
        />
        <el-table-column
          align="center"
          label="商品名称"
          prop="name"
          width="150px"
        />
        <el-table-column
          align="center"
          label="商品描述"
          prop="description"
          width="320px"
        />
        <el-table-column
          align="center"
          label="分类"
          prop="category"
          width="150px"
        />
        <el-table-column
          align="center"
          label="品牌"
          prop="brand"
          width="150px"
        />
        <el-table-column
          align="center"
          label="价格￥"
          prop="price"
          width="150px"
        />
        <el-table-column
          align="center"
          label="库存"
          prop="stock"
          width="150px"
        />
        <el-table-column
          align="center"
          label="状态"
          prop="status"
          width="150px"
        >
        </el-table-column>

        <el-table-column align="center" label="操作" width="250px">
          <template #default="scope">
            <el-button size="small" type="info"  @click="handleView(scope.row)">
              查看
            </el-button>
            <el-button
              size="small"
              type="primary"
              plain
              @click="handleReview(scope.row)"
            >
              审核
            </el-button>
            <el-button
              size="small"
              type="warning"
              plain
              @click="toggleStatus(scope.row)"
            >
              下架
            </el-button>
            <el-button
              size="small"
              type="danger"
              plain
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
        :total="orderTotalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import usePermissions from '@/hooks/usePermissions'

// 定义事件
const emit = defineEmits(['newClick', 'editClick'])

// 用户的权限判断
const isCreate = usePermissions('products:create')
const isDelete = usePermissions('products:delete')
const isUpdate = usePermissions('products:update')
const isQuery = usePermissions('products:query')

// 模拟商品数据
const mockProducts = [
  {
    id: 1,
    name: '无线蓝牙耳机',
    description: '高品质无线蓝牙耳机，音质出众',
    category: '电子产品',
    brand: '音响大师',
    price: 299.0,
    stock: 50,
    status: '已上架',
  },
  {
    id: 2,
    name: '智能手表',
    description: '多功能智能手表，健康监测',
    category: '电子产品',
    brand: '智联科技',
    price: 899.0,
    stock: 30,
    status: '待审核',
  },
  {
    id: 3,
    name: '4K高清电视',
    description: '超高清画质，家庭影院首选',
    category: '家电',
    brand: '视界科技',
    price: 4999.0,
    stock: 10,
    status: '已驳回',
  },
  {
    id: 4,
    name: '便携式充电宝',
    description: '轻便高效，随时随地充电',
    category: '配件',
    brand: '移动电源',
    price: 99.0,
    stock: 100,
    status: '已上架',
  },
  {
    id: 5,
    name: '高性能游戏鼠标',
    description: '精准操作，游戏必备',
    category: '配件',
    brand: '电竞王者',
    price: 249.0,
    stock: 75,
    status: '待审核',
  },
  {
    id: 6,
    name: '家用咖啡机',
    description: '自制咖啡，享受生活',
    category: '家电',
    brand: '咖啡之家',
    price: 799.0,
    stock: 20,
    status: '已上架',
  },
  {
    id: 7,
    name: '旅行背包',
    description: '大容量，适合各种场合',
    category: '户外',
    brand: '探险者',
    price: 199.0,
    stock: 50,
    status: '已驳回',
  },
  {
    id: 8,
    name: '蓝牙音响',
    description: '高保真音质，便携式设计',
    category: '电子产品',
    brand: '音乐之声',
    price: 399.0,
    stock: 40,
    status: '待审核',
  },
  {
    id: 9,
    name: '智能家居摄像头',
    description: '家庭安全监控，实时监控',
    category: '家居',
    brand: '家居卫士',
    price: 499.0,
    stock: 60,
    status: '已上架',
  },
  {
    id: 10,
    name: '运动鞋',
    description: '舒适透气，适合各种运动',
    category: '服饰',
    brand: '运动先锋',
    price: 599.0,
    stock: 25,
    status: '已驳回',
  },
]

// 使用模拟数据
const orderList = ref(mockProducts)
const orderTotalCount = ref(mockProducts.length)

// 页码相关的逻辑
const currentPage = ref(1)
const pageSize = ref(10)

// 删除/新建/编辑的操作
function handleDeleteBtnClick(id: number) {
  // 实现删除操作
  orderList.value = orderList.value.filter(product => product.id !== id)
  orderTotalCount.value = orderList.value.length // 更新总数
}

function handleNewUserClick() {
  emit('newClick')
}

function handleEditBtnClick(itemData: any) {
  emit('editClick', itemData)
}

// 切换状态
function toggleStatus(row: any) {
  const newStatus = row.status === '已上架' ? '已驳回' : '已上架'
  row.status = newStatus
}
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
  width: 100%; /* 确保表格容器宽度为100% */
  overflow-x: auto; /* 允许横向滚动 */
}

.table :deep(.el-table__cell) {
  padding: 12px 0;
}

.el-button {
  margin-left: 0;
  padding: 5px 8px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>
