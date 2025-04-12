<template>
  <el-cascader
    v-model="selectedCategory"
    :options="options"
    placeholder="请选择类目"
    @change="handleCategoryChange"
    style="margin-bottom: 20px; width: 300px;"
    filterable
    clearable
  />
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const selectedCategory = ref([]);

    const handleCategoryChange = (value) => {
      console.log('选择的类目:', value);
    };

    const options = [
      {
        value: '食品',
        label: '食品',
        children: [
          {
            value: '糕点点心',
            label: '糕点点心',
            children: [
              { value: '西式糕点', label: '西式糕点' },
              { value: '中式糕点', label: '中式糕点' },
            ],
          },
          {
            value: '膨化食品',
            label: '膨化食品',
            children: [
              { value: '薯片', label: '薯片' },
              { value: '锅巴', label: '锅巴' },
              { value: '其他膨化食品', label: '其他膨化食品' },
              { value: '干脆面', label: '干脆面' },
              { value: '薯条', label: '薯条' },
              { value: '虾条', label: '虾条' },
              { value: '爆米花', label: '爆米花' },
            ],
          },
          {
            value: '坚果炒货',
            label: '坚果炒货',
            children: [
              { value: '花生', label: '花生' },
              { value: '每日坚果', label: '每日坚果' },
              { value: '瓜子', label: '瓜子' },
              { value: '蚕豆', label: '蚕豆' },
              { value: '南瓜子', label: '南瓜子' },
              { value: '核桃', label: '核桃' },
              { value: '青豆', label: '青豆' },
              { value: '坚果礼盒', label: '坚果礼盒' },
            ],
          },
          {
            value: '面点烘焙',
            label: '面点烘焙',
            children: [
              { value: '面点', label: '面点' },
              { value: '水饺', label: '水饺' },
              { value: '馄饨', label: '馄饨' },
              { value: '汤圆', label: '汤圆' },
              { value: '披萨', label: '披萨' },
              { value: '蛋挞', label: '蛋挞' },
            ],
          },
          {
            value: '熟食腊味',
            label: '熟食腊味',
            children: [
              { value: '其他熟食', label: '其他熟食' },
            ],
          },
          {
            value: '蜜饯果干',
            label: '蜜饯果干',
            children: [
              { value: '山楂', label: '山楂' },
            ],
          },
          {
            value: '海味零食',
            label: '海味零食',
            children: [
              { value: '海苔', label: '海苔' },
            ],
          },
          {
            value: '饼干',
            label: '饼干',
            children: [
              { value: '夹心饼干', label: '夹心饼干' },
            ],
          },
        ],
      },
    ];

    return {
      selectedCategory,
      handleCategoryChange,
      options,
    };
  },
};
</script>

<style scoped>
.el-cascader {
  font-size: 16px; /* 字体大小 */
  border: 1px solid #dcdfe6; /* 边框颜色 */
  border-radius: 4px; /* 边框圆角 */
  padding: 10px; /* 内边距 */
  width: 300px; /* 宽度 */
  transition: border-color 0.3s; /* 边框颜色过渡效果 */
}

.el-cascader:hover {
  border-color: #409eff; /* 鼠标悬停时的边框颜色 */
}

.el-cascader:focus {
  border-color: #409eff; /* 聚焦时的边框颜色 */
  box-shadow: 0 0 5px rgba(64, 158, 255, 0.5); /* 聚焦时的阴影效果 */
}

.el-cascader__input {
  height: 40px; /* 输入框高度 */
  line-height: 40px; /* 行高 */
}

.el-cascader__tags {
  display: flex; /* 让标签在一行内显示 */
  flex-wrap: wrap; /* 标签换行 */
}

.el-cascader__tag {
  margin-right: 5px; /* 标签间距 */
  margin-bottom: 5px; /* 标签底部间距 */
  padding: 2px 8px; /* 标签内边距 */
  background-color: #f2f2f2; /* 标签背景颜色 */
  border-radius: 12px; /* 标签圆角 */
  font-size: 14px; /* 标签字体大小 */
}
</style>

