import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from '@/pages/HomePage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
]

const router = createRouter({
  // GitHub Pages 是静态托管，不支持 HTML5 History 模式
  // 使用 hash 模式避免子路径部署、刷新、直接访问时 404
  history: createWebHashHistory(),
  routes,
})

export default router
