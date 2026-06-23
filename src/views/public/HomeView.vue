<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { moods } from '../../store.js'

const router = useRouter()
const selectedMood = ref('')

function start() {
  if (!selectedMood.value) return
  router.push({ path: '/songs', query: { mood: selectedMood.value } })
}
</script>

<template>
  <div class="public-page">
    <header class="public-nav">
      <RouterLink to="/" class="public-brand">
        <span class="brand-dot">♪</span>
        <span>MoodMusic</span>
      </RouterLink>

      <nav class="public-links">
        <a href="#idee">Idee</a>
        <a href="#ablauf">Ablauf</a>
        <a href="#kontakt">Kontakt</a>
        <RouterLink to="/impressum">Impressum</RouterLink>
        <RouterLink to="/datenschutz">Datenschutz</RouterLink>
      </nav>

      <div class="public-actions">
        <RouterLink to="/login" class="ghost-pill">Login</RouterLink>
        <RouterLink to="/register" class="primary-pill">Registrieren</RouterLink>
      </div>
    </header>

    <main class="public-hero">
      <section>
        <h1 class="hero-title">Musik für<br>deinen<br><span>Moment.</span></h1>
        <p class="hero-text">
          Reflektiere kurz, wie du dich fühlst oder was gerade ansteht. MoodMusic zeigt dir passende Songs und Playlists.
        </p>

        <div class="mood-box">
          <span class="label">Wie ist dein Moment?</span>
          <div class="mood-grid">
            <button
              v-for="mood in moods"
              :key="mood"
              type="button"
              class="mood-chip"
              :class="{ active: selectedMood === mood }"
              @click="selectedMood = mood"
            >
              {{ mood }}
            </button>
          </div>

          <button type="button" class="primary-pill" :disabled="!selectedMood" @click="start">
            Reinhören →
          </button>
        </div>
      </section>

      <aside class="hero-card-preview">
        <span class="label">Preview</span>
        <h2>Dein Sound</h2>
        <div class="preview-list">
          <div class="preview-row">
            <div class="cover-sm">♪</div>
            <div><strong>Calm Study Chill Hop</strong><p>FASSounds</p></div>
            <span>Fokus</span>
          </div>
          <div class="preview-row">
            <div class="cover-sm">♪</div>
            <div><strong>Electro Swing Party</strong><p>Alex Morgan</p></div>
            <span>Glücklich</span>
          </div>
          <div class="preview-row">
            <div class="cover-sm">♪</div>
            <div><strong>Energy Thunder</strong><p>Knox Gym</p></div>
            <span>Workout</span>
          </div>
        </div>
      </aside>
    </main>

    <section class="public-section" id="idee">
      <div class="section-head">
        <span class="label">MoodMusic</span>
        <h2>Erst Stimmung. Dann Musik.</h2>
        <p>MoodMusic reduziert die Suche auf das, was wirklich zählt: deine aktuelle Stimmung oder Aktivität.</p>
      </div>

      <div class="info-grid">
        <article class="info-card"><h3>Songs nach Stimmung</h3><p>Jeder Song ist einer Stimmung oder Aktivität zugeordnet.</p></article>
        <article class="info-card"><h3>Playlists von Usern</h3><p>Erstelle eigene Playlists, like andere und starte Songs direkt.</p></article>
        <article class="info-card"><h3>Hörverlauf</h3><p>Deine Mood-Historie zeigt, welche Musik du an welchen Tagen gehört hast.</p></article>
      </div>
    </section>

    <section class="public-section" id="ablauf">
      <div class="section-head">
        <span class="label">Ablauf</span>
        <h2>In drei Schritten zum passenden Sound.</h2>
      </div>

      <div class="step-grid">
        <article class="step-card"><div class="step-no">01</div><h3>Stimmung wählen</h3><p>Fokus, Entspannen, Glücklich, Traurig, Workout oder Wütend.</p></article>
        <article class="step-card"><div class="step-no">02</div><h3>Songs starten</h3><p>Die App zeigt dir passende Songs für deinen Moment.</p></article>
        <article class="step-card"><div class="step-no">03</div><h3>Playlists nutzen</h3><p>Speichere deine eigenen Playlists oder like andere.</p></article>
        <article class="step-card"><div class="step-no">04</div><h3>MiniPlayer</h3><p>Die Musik bleibt beim Navigieren steuerbar.</p></article>
      </div>
    </section>

    <section class="public-section" id="kontakt">
      <div class="section-head">
        <span class="label">Kontakt</span>
        <h2>Fragen zu MoodMusic?</h2>
      </div>

      <form class="glass-box contact-card form-grid" action="mailto:rogerschlude12345@gmail.com" method="post" enctype="text/plain">
        <div class="form-row"><label>Name</label><input name="name" placeholder="Dein Name"></div>
        <div class="form-row"><label>E-Mail</label><input name="email" type="email" placeholder="deine@mail.de"></div>
        <div class="form-row"><label>Nachricht</label><textarea name="message" placeholder="Deine Nachricht"></textarea></div>
        <button type="submit" class="primary-pill">Nachricht senden →</button>
      </form>
    </section>

    <footer class="public-footer">MoodMusic — Musik passend zu deinem Moment.</footer>
  </div>
</template>
