# HMH-Eventtechnik — Platzhalter-Website

Dies ist eine einfache, mobile-first statische Website als Startpunkt für HMH-Eventtechnik.

Inhalt:
- `index.html` — Hauptseite (Platzhalter)
- `styles.css` — Basis-Styles
- `script.js` — kleines JS (Navigation + Laden von `data/material.json`)
- `data/material.json` — Beispiel-Daten für den Material-Bereich
- `pages/impressum.html`, `pages/datenschutz.html` — rechtliche Seiten
- `assets/` — hier Bilder & Logo ablegen (Platzhalter)

Lokales Testen:
1. Einfach `index.html` im Browser öffnen (lokale Pfade funktionieren).
2. Für einen lokalen Server (empfohlen):

```bash
# im Verzeichnis /home/benediktjansen/hmh-site
python3 -m http.server 8000
# Öffne http://localhost:8000 in Deinem Browser
```

Hinweise:
- Ersetze die Dateien in `assets/` durch deine echten Fotos und das Logo.
- Die Kontaktformulare sind Platzhalter; Backend/ Formularverarbeitung kann auf Wunsch ergänzt werden.
