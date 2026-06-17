import { createRouter, createWebHistory } from 'vue-router'
import { appStore } from '../store.js'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/public/HomeView.vue'), meta: { public: true } },
  { path: '/login', name: 'login', component: () => import('../views/public/LoginView.vue'), meta: { public: true } },
  { path: '/register', name: 'register', component: () => import('../views/public/RegisterView.vue'), meta: { public: true } },
  { path: '/forgot-password', name: 'forgot-password', component: () => import('../views/public/ForgotPasswordView.vue'), meta: { public: true } },
  { path: '/impressum', name: 'impressum', component: () => import('../views/public/ImpressumView.vue'), meta: { public: true } },
  { path: '/datenschutz', name: 'datenschutz', component: () => import('../views/public/DatenschutzView.vue'), meta: { public: true } },

  { path: '/dashboard', name: 'dashboard', component: () => import('../views/user/DashboardView.vue'), meta: { requiresAuth: true } },
  { path: '/mood-check', name: 'mood-check', component: () => import('../views/user/MoodCheckView.vue'), meta: { requiresAuth: true } },
  { path: '/recommendations', name: 'recommendations', component: () => import('../views/user/RecommendationsView.vue'), meta: { requiresAuth: true } },
  { path: '/profile', name: 'profile', component: () => import('../views/user/ProfileView.vue'), meta: { requiresAuth: true } },

  { path: '/songs', name: 'songs', component: () => import('../views/SongList.vue'), meta: { requiresAuth: true } },
  { path: '/songs/create', name: 'song-create', component: () => import('../views/SongCreate.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/songs/:id/edit', name: 'song-edit', component: () => import('../views/SongEdit.vue'), meta: { requiresAuth: true, requiresAdmin: true } },

  { path: '/playlists', name: 'playlists', component: () => import('../views/PlaylistList.vue'), meta: { requiresAuth: true } },
  { path: '/playlists/create', name: 'playlist-create', component: () => import('../views/PlaylistCreate.vue'), meta: { requiresAuth: true } },
  { path: '/playlists/:id/edit', name: 'playlist-edit', component: () => import('../views/PlaylistEdit.vue'), meta: { requiresAuth: true } },

  { path: '/admin', name: 'admin', component: () => import('../views/admin/AdminDashboardView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/playlists', name: 'admin-playlists', component: () => import('../views/admin/AdminPlaylistsView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/users', name: 'admin-users', component: () => import('../views/admin/AdminUsersView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },

  { path: '/:pathMatch(.*)*', redirect: '/' }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !appStore.isAuthenticated) {
    return { path: '/login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresAdmin && !appStore.isAdmin) {
    return { path: '/dashboard' }
  }

  if ((to.path === '/login' || to.path === '/register') && appStore.isAuthenticated) {
    return { path: '/dashboard' }
  }
})

export default router
