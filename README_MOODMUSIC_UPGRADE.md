# MoodMusic Frontend Upgrade

Starten im Frontend-Ordner:

```powershell
npm install
npm run dev
```

Falls das Backend nicht auf localhost:8080 läuft, `.env` anlegen:

```text
VITE_API_URL=http://localhost:8080
```

Neue Funktionen:

- Playlist-Ersteller wird automatisch gespeichert.
- Playlist-Cover optional.
- Profilbild optional.
- Playlist-Erstellung zeigt nur Songs aus dem gewählten Genre.
- Playlist-Detailseite zeigt Songs und kann sie direkt abspielen.
- Likes werden im Backend gespeichert.
- Tabs: Alle / Selbst erstellt / Gelikt.
- Mood-Historie zeigt pro Tag gehörte Stimmung/Musiksorte.
- Dashboard startet ohne vorausgewählte Stimmung.
- Empfehlungen zeigen Empty State, wenn es keine Treffer gibt.
- Profil enthält Passwort ändern.
