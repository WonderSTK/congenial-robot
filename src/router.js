import { createRouter, createWebHistory } from "vue-router"
import LayoutView from "@/Layout.vue"

const hasRight = (planNeeded) => {
  const authStore = useAuthStore()
  if (!authStore.myPlan || authStore.myPlan.plan_id < planNeeded || new Date(authStore.myPlan.ending_at) < new Date()) return { path: '/upgrades' }
  return true
}

const routes = [
  {
		path: '/',
		component: LayoutView,
		children: [
      {
        path: 'home',
        component: () => import('@/views/Home.vue'),
        alias: ''
      },
      {
        path: 'today',
        component: () => import('@/views/TodayPage.vue')
      },
      {
        path: 'rss',
        component: () => import('@/views/MyRSS.vue')
      },
      {
        path: 'bookmark',
        component: () => import('@/views/MyBookmarks.vue')
      },
      {
        path: 'weekly-planner',
        component: () => import('@/views/WeeklyPlanner.vue'),
        beforeEnter: () => {
          return hasRight(2)
        },
      },
      {
        path: 'read-later',
        component: () => import('@/views/ReadLater.vue')
      },
      {
        path: 'notifications',
        component: () => import('@/views/Notifications.vue')
      },
      {
        path: 'settings',
        component: () => import('@/views/Settings/Settings.vue')
      },
      {
        path: 'profile',
        children: [
          {
            path: ':id', component: () => import('@/views/Profile.vue'),
            children: [
              {
                name: 'ProfileTab',
                path: ':tab', component: () => import('@/views/Profile.vue'),
              },
            ]
          },
        ]
      },
      {
        path: 'post/:postId',
        name: 'post',
        component: () => import('@/views/Post.vue')
      },
      {
        path: '/:catchAll(.*)',
        component: () => import('@/views/404.vue')
      },
    ]
  },
  {
    path: '/account',
    children: [
      {
        path: 'login',
        component: () => import('@/views/Login.vue')
      },
      {
        path: 'register',
        component: () => import('@/views/Register.vue')
      },
    ]
  },
  {
		path: '/',
		component: LayoutView,
    props: { rightSideBar: false },
		children: [
      {
        path: 'upgrades',
        component: () => import('@/views/Upgrades.vue'),
      },
      {
        path: 'inbox',
        component: () => import('@/views/Inbox.vue')
      },
    ]
  },
  {
		path: '/',
		component: LayoutView,
    props: { showTrends: false },
		children: [
      {
        path: 'explore',
        name: 'explore',
        component: () => import('@/views/Explore.vue'),
      },
    ]
  }
]

const router = createRouter({
	routes,
  history: createWebHistory(),
})

import { useAuthStore } from "@/stores/authStore"
import { supabase } from "./utils/supabase"

router.beforeEach(async (to) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/', '/account/login', '/account/register']
  const authRequired = !publicPages.includes(to.path)
  const authStore = useAuthStore()

  const localUser = await supabase.auth.getSession()
  // Disconnect user
  if (authRequired && localUser.data.session == null) {
    authStore.user = null
    return '/account/login'
  }
  // Store user session
  if (!authStore.user && localUser.data.session) {
    if (to.path === '/account/login' && to.href.includes('type=signup') && to.href.includes('access_token')) {
      await authStore.createProfile(localUser.data.session.user)
    }
    await authStore.setUser(localUser.data.session, null, to.href.includes('type=recovery'))
  }

  if (authStore.user && !authRequired && to.path !== publicPages[0]) return '/'

  if (authStore.user && to.href && to.href.includes('access_token') && to.href.includes('type=recovery')) {
    return '/settings#change-password'
  }
})

export default router
