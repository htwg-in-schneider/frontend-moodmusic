import { createRouter, createWebHistory } from 'vue-router'

import SongList from '../views/SongList.vue'
import SongCreate from '../views/SongCreate.vue'
import SongEdit from '../views/SongEdit.vue'

import PlaylistList from '../views/PlaylistList.vue'
import PlaylistCreate from '../views/PlaylistCreate.vue'
import PlaylistEdit from '../views/PlaylistEdit.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'songs',
      component: SongList
    },
    {
      path: '/songs/create',
      name: 'song-create',
      component: SongCreate
    },
    {
      path: '/songs/:id/edit',
      name: 'song-edit',
      component: SongEdit
    },
    {
      path: '/playlists',
      name: 'playlists',
      component: PlaylistList
    },
    {
      path: '/playlists/create',
      name: 'playlist-create',
      component: PlaylistCreate
    },
    {
      path: '/playlists/:id/edit',
      name: 'playlist-edit',
      component: PlaylistEdit
    }
  ]
})

export default router