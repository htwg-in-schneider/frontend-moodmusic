<template>
  <main class="app-page">
    <p class="page-kicker">Admin</p>
    <h1 class="page-heading">Admin-Bereich</h1>
    <p class="page-lead">Stammdaten verwalten, Nutzer ansehen und Vorgänge nachvollziehen.</p>

    <section class="admin-grid">
      <RouterLink to="/songs" class="admin-tile">
        <h3>Songs verwalten</h3>
        <p>Songs suchen, erstellen, bearbeiten und löschen.</p>
      </RouterLink>
      <RouterLink to="/admin/playlists" class="admin-tile">
        <h3>Playlists verwalten</h3>
        <p>Playlists prüfen, sortieren und löschen.</p>
      </RouterLink>
      <RouterLink to="/admin/users" class="admin-tile">
        <h3>Nutzer verwalten</h3>
        <p>Userdaten anzeigen und bearbeiten.</p>
      </RouterLink>
    </section>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>
