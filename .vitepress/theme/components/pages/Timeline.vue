<template>
  <div class="timeline-page">
    <h1>时间线</h1>
    <div v-for="year in Object.keys(timelineData).reverse()" :key="year" class="year-group">
      <h2>{{ year }}</h2>
      <ul>
        <li v-for="href in (timelineData[year]).sort((a, b) => b.split('/')[3] - a.split('/')[3])" :key="href">
          <a :href="href">{{ mdData[href].post.title }}</a>
          <span class="post-date">- {{ new Date(mdData[href].post.create).toLocaleDateString() }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useDataStore } from '@/store/index'
const dataStore = useDataStore()
const { timelineData, mdData } = storeToRefs(dataStore)

</script>

<style scoped>
.timeline-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 40px;
  color: var(--vp-c-text-1);
}

.year-group {
  margin-bottom: 30px;
}

.year-group h2 {
  font-size: 1.8em;
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 10px;
  margin-bottom: 20px;
  color: var(--vp-c-brand-1);
}

.year-group ul {
  list-style: none;
  padding: 0;
}

.year-group li {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.year-group li a {
  font-size: 1.1em;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.2s ease;
}

.year-group li a:hover {
  color: var(--vp-c-brand-1);
}

.post-date {
  margin-left: 10px;
  color: var(--vp-c-text-2);
  font-size: 0.9em;
}
</style>