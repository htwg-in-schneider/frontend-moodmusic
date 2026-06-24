# MoodMusic Frontend Deployment

Dieses Frontend ist für GitHub Pages vorbereitet.

## Wichtig

Die Backend-URL ist bereits auf Render gesetzt:

```text
https://backend-moodmusic.onrender.com
```

Die GitHub-Pages-Base ist in `vite.config.js` gesetzt auf:

```js
base: '/frontend-moodmusic/'
```

Wenn dein GitHub-Repo anders heißt, musst du diesen Wert anpassen:

```js
base: '/DEIN-REPO-NAME/'
```

## Deployment

1. Ordner auf GitHub pushen.
2. In GitHub öffnen: `Settings > Pages`.
3. Bei `Source` auswählen: `GitHub Actions`.
4. Danach bei `Actions` warten, bis der Workflow grün ist.

Die fertige URL sieht ungefähr so aus:

```text
https://DEIN-GITHUB-NAME.github.io/frontend-moodmusic/
```
