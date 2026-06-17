<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { moods } from '../../store.js'

const router = useRouter()
const selectedMood = ref('Fokus')

function start() {
  router.push({ path: '/recommendations', query: { mood: selectedMood.value } })
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
          Wähle deine Stimmung oder Tätigkeit. MoodMusic zeigt dir passende Songs und Playlists — dezent, schnell und wie eine kleine Musik-App.
        </p>

        <div class="mood-box">
          <span class="label">Welche Tätigkeit steht an?</span>
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

          <button type="button" class="primary-pill" @click="start">
            Musik finden →
          </button>
        </div>
      </section>

      <aside class="hero-card-preview">
        <span class="label">Preview</span>
        <h2>Deine Empfehlungen</h2>
        <div class="preview-list">
          <div class="preview-row">
            <div class="cover-sm">♪</div>
            <div>
              <strong>Night Focus</strong>
              <p>MoodMusic Lab</p>
            </div>
            <span>3:12</span>
          </div>
          <div class="preview-row">
            <div class="cover-sm">♪</div>
            <div>
              <strong>Deep Work</strong>
              <p>LoCity</p>
            </div>
            <span>2:58</span>
          </div>
          <div class="preview-row">
            <div class="cover-sm">♪</div>
            <div>
              <strong>Afterglow</strong>
              <p>Moonstate</p>
            </div>
            <span>3:28</span>
          </div>
        </div>
      </aside>
    </main>

    <section class="public-section" id="idee">
      <div class="section-head">
        <span class="label">MoodMusic</span>
        <h2>Musik nicht suchen. Stimmung auswählen.</h2>
        <p>
          MoodMusic verbindet Songs, Playlists, Likes und Stimmungen. So findet der Nutzer schneller passende Musik für Lernen, Training, Fokus oder Entspannung.
        </p>
      </div>

      <div class="info-grid">
        <article class="info-card">
          <h3>Songs nach Stimmung</h3>
          <p>Jeder Song hat Genre, BPM und Emotion. Daraus entstehen passende Empfehlungen.</p>
        </article>
        <article class="info-card">
          <h3>Playlists von Usern</h3>
          <p>User können Playlists erstellen. Je mehr Likes, desto weiter oben stehen sie.</p>
        </article>
        <article class="info-card">
          <h3>Player & MiniPlayer</h3>
          <p>Songs laufen weiter, auch wenn du zwischen Seiten wechselst.</p>
        </article>
      </div>
    </section>

    <section class="public-section" id="ablauf">
      <div class="section-head">
        <span class="label">Ablauf</span>
        <h2>Vom Gefühl zur Playlist.</h2>
      </div>

      <div class="step-grid">
        <article class="step-card"><div class="step-no">01</div><h3>Stimmung wählen</h3><p>Der User wählt eine Tätigkeit oder Stimmung.</p></article>
        <article class="step-card"><div class="step-no">02</div><h3>Songs erhalten</h3><p>Passende Songs werden oben angezeigt.</p></article>
        <article class="step-card"><div class="step-no">03</div><h3>Playlist starten</h3><p>Beliebte Playlists erscheinen darunter.</p></article>
        <article class="step-card"><div class="step-no">04</div><h3>MiniPlayer</h3><p>Die Musik bleibt unten sichtbar und steuerbar.</p></article>
      </div>
    </section>

    <section class="public-section" id="kontakt">
      <div class="section-head">
        <span class="label">Kontakt</span>
        <h2>Fragen zu MoodMusic?</h2>
      </div>

      <form class="glass-box contact-card form-grid" action="mailto:deine-mail@example.com" method="post" enctype="text/plain">
        <div class="form-row"><label>Name</label><input name="name" placeholder="Dein Name"></div>
        <div class="form-row"><label>E-Mail</label><input name="email" type="email" placeholder="deine@mail.de"></div>
        <div class="form-row"><label>Nachricht</label><textarea name="message" placeholder="Deine Nachricht"></textarea></div>
        <button type="submit" class="primary-pill">Nachricht senden →</button>
      </form>
    </section>

    <footer class="public-footer">
      MoodMusic — Musik passend zu deiner Stimmung.
    </footer>
  </div>
</template>
