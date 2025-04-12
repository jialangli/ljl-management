<template>
  <div>
    <div class="content">
      <div class="header">
        <div class="title">商品列表</div>
        <el-button type="primary" @click="handleNewUserClick">新增商品</el-button>
      </div>

      <el-table :data="usersList" class="table">
        <el-table-column prop="firstCategory" label="一级类目" />
        <el-table-column prop="secondCategory" label="二级类目" />
        <el-table-column prop="thirdCategory" label="三级类目" />

        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button size="small" type="primary" plain @click="handleBrandClick(row)">品牌</el-button>
            <el-button size="small" type="warning" plain @click="handleEditBtnClick(row)">编辑</el-button>
            <el-button size="small" type="info" plain @click="handleAttributeGroupClick(row)">属性组</el-button>
            <el-button size="small" type="danger" plain @click="handleDeleteBtnClick(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="usersTotalCount"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      usersList: [
        {
          id: 1,
          firstCategory: '食品',
          secondCategory: '饮料',
          thirdCategory: '碳酸饮料',
        },
        {
          id: 2,
          firstCategory: '食品',
          secondCategory: '零食',
          thirdCategory: '薯片',
        },
        {
          id: 3,
          firstCategory: '家居',
          secondCategory: '家具',
          thirdCategory: '沙发',
        },
        {
          id: 4,
          firstCategory: '家居',
          secondCategory: '家电',
          thirdCategory: '冰箱',
        },
        {
          id: 5,
          firstCategory: '服饰',
          secondCategory: '男装',
          thirdCategory: 'T恤',
        },
        {
          id: 6,
          firstCategory: '服饰',
          secondCategory: '女装',
          thirdCategory: '连衣裙',
        },
      ],
      currentPage: 1,
      pageSize: 10,
      usersTotalCount: 6, // 这里设置为用户列表的总数
    };
  },
  methods: {
    handleNewUserClick() {
      // 处理新增品牌的逻辑
    },
    handleBrandClick(row) {
      // 处理品牌按钮的逻辑
      console.log('品牌', row);
    },
    handleEditBtnClick(row) {
      // 处理编辑的逻辑
      console.log('编辑', row);
    },
    handleAttributeGroupClick(row) {
      // 处理属性组按钮的逻辑
      console.log('属性组', row);
    },
    handleDeleteBtnClick(id) {
      // 处理删除的逻辑
      console.log('删除', id);
    },
    handleCurrentChange(page) {
      // 处理当前页变化的逻辑
      console.log('当前页:', page);
    },
    handleSizeChange(size) {
      // 处理页面大小变化的逻辑
      console.log('页面大小:', size);
    },
  },
};
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
