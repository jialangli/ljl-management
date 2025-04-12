<template>
  <div class="chart-container">
    <div class="chart" id="barChart"></div>
    <div class="chart" id="pieChart"></div>
    <div class="chart" id="lineChart"></div>
    <div class="chart" id="dynamicBarChart"></div> <!-- 第四个动态柱状图 -->
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import * as echarts from 'echarts';

// 柱状图选项
const barChartOption = {
  legend: {},
  tooltip: {},
  dataset: {
    source: [
      ['product', '2012', '2013', '2014', '2015'],
      ['Matcha Latte', 41.1, 30.4, 65.1, 53.3],
      ['Milk Tea', 86.5, 92.1, 85.7, 83.1],
      ['Cheese Cocoa', 24.1, 67.2, 79.5, 86.4]
    ]
  },
  xAxis: [
    { type: 'category', gridIndex: 0 },
    { type: 'category', gridIndex: 1 }
  ],
  yAxis: [{ gridIndex: 0 }, { gridIndex: 1 }],
  grid: [{ bottom: '55%' }, { top: '55%' }],
  series: [
    { type: 'bar', seriesLayoutBy: 'row', xAxisIndex: 0, yAxisIndex: 0 },
    { type: 'bar', seriesLayoutBy: 'row', xAxisIndex: 0, yAxisIndex: 0 },
    { type: 'bar', seriesLayoutBy: 'row', xAxisIndex: 0, yAxisIndex: 0 },
    { type: 'bar', seriesLayoutBy: 'column', xAxisIndex: 1, yAxisIndex: 1 },
    { type: 'bar', seriesLayoutBy: 'column', xAxisIndex: 1, yAxisIndex: 1 },
    { type: 'bar', seriesLayoutBy: 'column', xAxisIndex: 1, yAxisIndex: 1 },
    { type: 'bar', seriesLayoutBy: 'column', xAxisIndex: 1, yAxisIndex: 1 }
  ]
};

// 饼图选项
const pieChartOption = {
  series: [
    {
      type: 'pie',
      data: [
        { value: 100, name: 'A' },
        { value: 200, name: 'B' },
        { value: 300, name: 'C' },
        { value: 400, name: 'D' },
        { value: 500, name: 'E' }
      ],
      roseType: 'area'
    }
  ]
};

// 折线图选项
const lineChartOption = {
  xAxis: {
    data: ['A', 'B', 'C', 'D', 'E']
  },
  yAxis: {},
  series: [
    {
      data: [10, 22, 28, 23, 19],
      type: 'line',
      label: {
        show: true,
        position: 'bottom',
        textStyle: {
          fontSize: 20
        }
      }
    }
  ]
};

// 动态柱状图选项
const dynamicBarChartOption = {
  xAxis: {
    max: 'dataMax'
  },
  yAxis: {
    type: 'category',
    data: ['A', 'B', 'C', 'D', 'E'],
    inverse: true,
    max: 2 // 只显示最大的 3 个柱子
  },
  series: [
    {
      realtimeSort: true,
      name: 'X',
      type: 'bar',
      data: Array.from({ length: 5 }, () => Math.round(Math.random() * 200)), // 随机数据
      label: {
        show: true,
        position: 'right',
        valueAnimation: true
      }
    }
  ],
  legend: {
    show: true
  },
  animationDuration: 3000,
  animationDurationUpdate: 3000,
  animationEasing: 'linear',
  animationEasingUpdate: 'linear'
};

// 初始化图表
const initCharts = () => {
  // 初始化柱状图
  const barChart = echarts.init(document.getElementById('barChart') as HTMLElement);
  barChart.setOption(barChartOption);

  // 初始化饼图
  const pieChart = echarts.init(document.getElementById('pieChart') as HTMLElement);
  pieChart.setOption(pieChartOption);

  // 初始化折线图
  const lineChart = echarts.init(document.getElementById('lineChart') as HTMLElement);
  lineChart.setOption(lineChartOption);

  // 初始化动态柱状图
  const dynamicBarChart = echarts.init(document.getElementById('dynamicBarChart') as HTMLElement);
  dynamicBarChart.setOption(dynamicBarChartOption);

  // 更新动态柱状图数据
  const updateDynamicBarChart = () => {
    const data = dynamicBarChartOption.series[0].data;
    for (let i = 0; i < data.length; ++i) {
      data[i] += Math.round(Math.random() * 200); // 随机更新数据
    }
    dynamicBarChart.setOption(dynamicBarChartOption);
  };

  setInterval(updateDynamicBarChart, 3000); // 每 3 秒更新一次数据
};

onMounted(() => {
  initCharts();
});
</script>

<style scoped>
.chart-container {
  display: flex;
  flex-wrap: wrap; /* 允许换行 */
  justify-content: space-between; /* 在行之间均匀分布 */
  gap: 20px; /* 图表之间的间距 */
}

.chart {
  flex: 0 0 48%; /* 每个图表占据48%的宽度，留出空间用于间距 */
  height: 400px; /* 图表的高度 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  border-radius: 8px; /* 圆角效果 */
  overflow: hidden; /* 确保内容不会溢出 */
}
</style>


