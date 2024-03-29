import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/register',
      name: 'register',
      component: () => import("@/views/RegisterView.vue")
    },
    {
      path: '/login',
      name: 'login',
      component: () => import("@/views/LoginView.vue")
    },
    {
      path: '/main',
      name: 'main',
      component: () => import("@/views/MainView.vue"),
      children: [
        {
          path: "account",
          component: () => import("@/views/AccountView.vue")
        },
        {
          path: "deposit",
          component: () => import("@/views/DepositView.vue")
        },
        {
          path: "withdraw",
          component: () => import("@/views/WithdrawView.vue")
        },
        {
          path: "trade",
          component: () => import("@/views/TradeView.vue")
        },
        {
          path: "positions",
          component: () => import("@/views/PositionsView.vue")
        },
      ]
    },
    
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ]
})

export default router
