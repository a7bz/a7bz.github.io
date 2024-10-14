<template>
  <div class="container">
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <div class="sidebar-item">
        <div class="sidebar-header">
          <i class="iconfont icon-home" />
          <span class="sidebar-title">归档</span>
        </div>
      </div>
      <div class="sidebar-item">
        <div class="sidebar-header">
          <i class="iconfont icon-home" />
          <span class="sidebar-title">2023</span>
        </div>
      </div>
    </div>

    <!-- 右侧内容区 -->
    <div class="content">
      <div class="card" v-for="(item, index) in cards" :key="index">
        <!-- <img :src="item.image" class="card-image" /> -->
        <div class="card-text">
          <p>{{ item.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cards: [
        { title: "NodeJS接口，会议控制" },
        { title: "文章摘要，相关推荐生成AI" },
        { title: "Canvas 2D 进阶" },
        { title: "Butterfly魔改" },
      ],
    }
  },
};
</script>

<style scoped>
.container {
  display: flex;
  width: 100%;
  background-size: cover;
}

.sidebar {
  border-radius: 16px;
  width: 20%;
  background: linear-gradient(180deg, #36C2F3, #3A92FF);
  padding: 20px;
  margin: 20px 0;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sidebar-item {
  width: 100%;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.sidebar-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  transition: background-color 0.3s ease;
}

.sidebar-header:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.sidebar-title {
  font-size: 18px;
  color: white;
}

.iconfont {
  font-size: 24px;
  color: rgba(255, 255, 255, 0.7);
}

.content {
  width: 80%;
  display: flex;
  justify-content: space-around;
  padding: 20px;
}

.card {
  width: 23%;
  background: var(--main-card-background) !important;
  border-radius: 16px !important;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.2);
}

.card-image {
  width: 100%;
  height: 150px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  object-fit: cover;
}

.card-text {
  padding: 10px;
  font-size: 18px;
  text-align: center;
}
</style>
