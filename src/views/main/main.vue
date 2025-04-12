<template>
  <div class="main">
    <el-container class="main-content">
      <el-aside :width="isFold ? '60px' : '210px'">
        <main-menu />
      </el-aside>
      <el-container>
        <el-header height="50px">
          <main-header @fold-change="handleFoldChange" />
        </el-header>
        <el-main>
          <router-view /> <!-- 这里是路由视图 -->
          <div class="tech-stack">
            <h2>Tiktok电商平台技术栈</h2>
            <h3>后端技术：</h3>
            <ul>
              <li>Golang</li>
              <li>Hertz</li>
              <li>Kitex</li>
              <li>RocketMQ</li>
              <li>Elasticsearch</li>
              <li>Docker</li>
              <li>Redis</li>
              <li>MySQL</li>
              <li>Etcd</li>
              <li>Prometheus</li>
            </ul>
            <h3>前端技术：</h3>
            <ul>
              <li>CSS</li>
              <li>HTML</li>
              <li>JavaScript</li>
              <li>Pinia</li>
              <li>ElementPlus</li>
            </ul>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MainMenu from '@/components/main-menu/main-menu.vue';
import MainHeader from '@/components/main-header/main-header.vue';

const isFold = ref(false);
function handleFoldChange(flag: boolean) {
  isFold.value = flag; // 更新折叠状态
}
</script>

<style lang="less" scoped>
.main {
  height: 100%;
}

.main-content {
  height: 100%;

  .el-aside {
    overflow-x: hidden;
    overflow-y: auto;
    line-height: 200px;
    text-align: left;
    cursor: pointer;
    background-color: #001529;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */

    transition: width 1s ease; /* 优化过渡时间 */

    &::-webkit-scrollbar {
      display: none; /* 隐藏滚动条 */
    }
  }

  .el-main {
    background-color: #f0f2f5;
    padding: 20px; /* 添加内边距 */

    .tech-stack {
      margin-top: 20px;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      h2 {
        margin-bottom: 10px;
      }

      h3 {
        margin-top: 15px;
      }

      ul {
        list-style-type: none;
        padding: 0;

        li {
          margin: 5px 0;
        }
      }
    }
  }
}
</style>

