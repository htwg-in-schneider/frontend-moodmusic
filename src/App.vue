<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <div class="stars"></div>
    <div class="glow glow-one"></div>
    <div class="glow glow-two"></div>

    <nav class="navbar">
      <RouterLink to="/" class="logo">MoodMusic</RouterLink>

      <div class="nav-links">
        <RouterLink to="/">Songs</RouterLink>
        <RouterLink to="/playlists">Playlists</RouterLink>
      </div>
    </nav>

    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Sora:wght@500;600;700;800&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  min-height: 100%;
  background: #05000d;
}

body {
  min-height: 100vh;
  background:
    radial-gradient(circle at 18% 10%, rgba(147, 51, 234, 0.32), transparent 30%),
    radial-gradient(circle at 88% 35%, rgba(236, 72, 153, 0.22), transparent 28%),
    linear-gradient(180deg, #080012 0%, #05000d 55%, #020006 100%);
  color: #ffffff;
  font-family: 'DM Sans', Arial, sans-serif;
  overflow-x: hidden;
}

button,
input,
select {
  font-family: inherit;
}

.app {
  position: relative;
  min-height: 100vh;
  isolation: isolate;
}

.stars {
  position: fixed;
  inset: 0;
  z-index: -3;
  pointer-events: none;
  background-image:
    radial-gradient(circle, rgba(255, 255, 255, 0.8) 1px, transparent 1.4px),
    radial-gradient(circle, rgba(192, 132, 252, 0.5) 1px, transparent 1.5px);
  background-size: 120px 120px, 190px 190px;
  background-position: 0 0, 60px 70px;
  opacity: 0.35;
}

.glow {
  position: fixed;
  z-index: -2;
  width: 430px;
  height: 430px;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.5;
  pointer-events: none;
}

.glow-one {
  top: 80px;
  left: -120px;
  background: rgba(147, 51, 234, 0.5);
}

.glow-two {
  right: -140px;
  bottom: 80px;
  background: rgba(236, 72, 153, 0.35);
}

/* Layout */
.navbar {
  max-width: 1180px;
  margin: 24px auto 0;
  padding: 16px 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(20, 10, 40, 0.58);
  border: 1px solid rgba(192, 132, 252, 0.22);
  border-radius: 24px;
  backdrop-filter: blur(18px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
}

.logo {
  font-family: 'Sora', sans-serif;
  font-size: 24px;
  font-weight: 800;
  color: #ffffff;
  text-decoration: none;
  letter-spacing: -0.04em;
}

.nav-links {
  display: flex;
  gap: 12px;
}

.nav-links a {
  color: #d8b4fe;
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  padding: 10px 16px;
  border-radius: 999px;
  transition: 0.2s ease;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #ffffff;
  background: rgba(147, 51, 234, 0.28);
  box-shadow: 0 0 24px rgba(147, 51, 234, 0.25);
}

.content {
  max-width: 1180px;
  margin: 28px auto 0;
  padding: 28px;
  min-height: calc(100vh - 140px);
  background: rgba(12, 5, 26, 0.64);
  border: 1px solid rgba(192, 132, 252, 0.18);
  border-radius: 28px;
  backdrop-filter: blur(20px);
  box-shadow: 0 26px 80px rgba(0, 0, 0, 0.45);
}

/* Typography */
h1,
h2,
h3 {
  font-family: 'Sora', sans-serif;
  letter-spacing: -0.04em;
}

h1 {
  font-size: 32px;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #ffffff 0%, #c084fc 45%, #f0abfc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

h2 {
  color: #ffffff;
}

/* Header rows */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
}

.btn-create,
.btn-save {
  background: linear-gradient(135deg, #9333ea, #c026d3);
  color: white;
  border: none;
  padding: 11px 24px;
  border-radius: 999px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 12px 30px rgba(147, 51, 234, 0.28);
}

.btn-create:hover,
.btn-save:hover {
  transform: translateY(-1px);
  box-shadow: 0 16px 40px rgba(147, 51, 234, 0.4);
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Filter */
.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  padding: 16px;
  background: rgba(20, 10, 40, 0.62);
  border: 1px solid rgba(192, 132, 252, 0.16);
  border-radius: 18px;
}

.search-input,
.filter-select,
.form-group input,
.form-group select {
  padding: 12px 16px;
  background: rgba(8, 2, 20, 0.88);
  border: 1px solid rgba(192, 132, 252, 0.28);
  border-radius: 12px;
  color: #ffffff;
  font-size: 14px;
  outline: none;
}

.search-input {
  flex: 2;
  min-width: 240px;
}

.filter-select {
  flex: 1;
  min-width: 170px;
}

.search-input:focus,
.filter-select:focus,
.form-group input:focus,
.form-group select:focus {
  border-color: #c084fc;
  box-shadow: 0 0 0 3px rgba(147, 51, 234, 0.16);
}

.search-input::placeholder,
.form-group input::placeholder {
  color: #8b7aa8;
}

select option {
  background: #140a28;
  color: #ffffff;
}

.btn-reset {
  padding: 12px 18px;
  background: rgba(244, 114, 182, 0.08);
  border: 1px solid rgba(244, 114, 182, 0.34);
  border-radius: 12px;
  color: #f9a8d4;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.result-count,
.no-results,
.info-message {
  color: #a9a0b8;
  font-size: 14px;
  margin-bottom: 16px;
}

.error-message {
  color: #f472b6;
  font-size: 14px;
  margin-bottom: 16px;
}

/* Table */
.song-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
  border-radius: 18px;
  background: rgba(20, 10, 40, 0.62);
  border: 1px solid rgba(192, 132, 252, 0.16);
}

.song-table th {
  text-align: left;
  padding: 14px 16px;
  color: #d8b4fe;
  font-size: 13px;
  font-weight: 800;
  background: rgba(147, 51, 234, 0.14);
  border-bottom: 1px solid rgba(192, 132, 252, 0.16);
}

.song-table td {
  padding: 14px 16px;
  color: #ffffff;
  font-size: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.song-table tr:hover td {
  background: rgba(147, 51, 234, 0.08);
}

.actions,
.card-actions,
.form-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn-edit {
  color: #d8b4fe;
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;
  padding: 7px 12px;
  border: 1px solid rgba(147, 51, 234, 0.35);
  border-radius: 10px;
  background: rgba(147, 51, 234, 0.08);
}

.btn-delete {
  color: #f9a8d4;
  background: rgba(236, 72, 153, 0.07);
  border: 1px solid rgba(236, 72, 153, 0.35);
  border-radius: 10px;
  padding: 7px 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.04);
  color: #d1d5db;
  border: 1px solid rgba(255, 255, 255, 0.16);
  padding: 12px 28px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

/* Forms */
.song-form,
.playlist-form {
  max-width: 560px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 13px;
  color: #c084fc;
  margin-bottom: 8px;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.form-group input,
.form-group select {
  width: 100%;
}

.file-upload {
  position: relative;
}

.file-upload input[type="file"] {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.file-label {
  display: block;
  width: 100%;
  padding: 12px 16px;
  background: rgba(8, 2, 20, 0.88);
  border: 1px dashed rgba(192, 132, 252, 0.36);
  border-radius: 12px;
  color: #a9a0b8;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
}

/* Playlist cards */
.playlist-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: 20px;
}

.playlist-card {
  background: rgba(20, 10, 40, 0.66);
  border: 1px solid rgba(192, 132, 252, 0.18);
  border-radius: 22px;
  padding: 22px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.28);
}

.card-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

.card-header h2 {
  font-size: 19px;
}

.badge {
  font-size: 12px;
  font-weight: 800;
  padding: 5px 12px;
  border-radius: 999px;
  background: rgba(147, 51, 234, 0.18);
  color: #d8b4fe;
  border: 1px solid rgba(192, 132, 252, 0.18);
}

.song-count {
  font-size: 13px;
  color: #a9a0b8;
  margin-bottom: 12px;
}

.song-preview {
  list-style: none;
  margin-bottom: 18px;
  padding: 0;
}

.song-preview li {
  font-size: 13px;
  color: #ffffff;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

/* Song Picker */
.song-picker {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.song-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  background: rgba(20, 10, 40, 0.66);
  border: 1px solid rgba(192, 132, 252, 0.16);
  border-radius: 14px;
  cursor: pointer;
}

.song-option:hover {
  border-color: rgba(192, 132, 252, 0.42);
}

.song-option.selected {
  border-color: #9333ea;
  background: rgba(147, 51, 234, 0.16);
}

.song-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.song-titel {
  font-size: 14px;
  color: #ffffff;
  font-weight: 700;
}

.song-kuenstler {
  font-size: 12px;
  color: #a9a0b8;
}

.check {
  font-size: 18px;
  color: #c084fc;
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: rgba(147, 51, 234, 0.12);
}

.song-option.selected .check {
  background: #9333ea;
  color: white;
}

/* Mobile */
@media (max-width: 768px) {
  .navbar {
    margin: 14px 14px 0;
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .nav-links {
    width: 100%;
  }

  .nav-links a {
    flex: 1;
    text-align: center;
  }

  .content {
    margin: 16px 14px 0;
    padding: 18px;
    border-radius: 22px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn-create {
    width: 100%;
    text-align: center;
  }

  .filter-bar {
    flex-direction: column;
  }

  .search-input,
  .filter-select,
  .btn-reset {
    width: 100%;
    min-width: 100%;
  }

  .song-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  .actions,
  .card-actions,
  .form-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-edit,
  .btn-delete,
  .btn-save,
  .btn-cancel {
    width: 100%;
    text-align: center;
  }

  .playlist-cards {
    grid-template-columns: 1fr;
  }
}
</style>