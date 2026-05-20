<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <!-- Navigation -->
    <nav class="navbar">
      <span class="logo">MoodMusic</span>
      <div class="nav-links">
        <RouterLink to="/">Songs</RouterLink>
        <RouterLink to="/playlists">Playlists</RouterLink>
      </div>
    </nav>

    <!-- Hier werden die einzelnen Seiten angezeigt -->
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style>
/* Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: #0A0212;
  color: #FFFFFF;
  font-family: Arial, sans-serif;
}

.navbar {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 24px;
  font-weight: 700;
}

.nav-links a {
  color: #C084FC;
  text-decoration: none;
  font-size: 14px;
}

.content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 24px;
}
.nav-links {
  display: flex;
  gap: 20px;
}
</style>