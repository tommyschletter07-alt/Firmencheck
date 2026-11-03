FIRMENCHECK – ÖFFENTLICHE PILOT-VERSION

DIESE VERSION:
- speichert Bewertungen mit Netlify Blobs
- veröffentlicht neue Bewertungen direkt
- zeigt sie auf /bewertungen.html
- markiert neue Bewertungen als "Ungeprüfte Bewertung"
- nutzt ausschließlich Netlify für Hosting + Functions + Datenspeicherung
- QR-Seite: /qr.html

WICHTIG: Diese Version braucht Netlify Functions.
Darum NICHT nur den public-Ordner per Drag & Drop hochladen.

EMPFOHLENER WEG:
1. Entpacke diesen Projektordner.
2. Lade den gesamten Ordner in ein GitHub-Repository.
3. In Netlify: "Add new project" -> "Import an existing project" -> GitHub.
4. Repository auswählen.
5. Netlify erkennt netlify.toml. Publish directory ist "public".
6. Deploy starten.
7. Danach Testbewertung über /bewerten.html absenden.
8. Unter /bewertungen.html prüfen, ob sie öffentlich erscheint.
9. /qr.html öffnen und QR-Code speichern.

VOR DEM TEILEN:
- impressum.html ausfüllen
- datenschutz.html ausfüllen
- Testbewertung machen
- keine echten privaten Personennamen in Bewertungen zulassen

TECHNIK:
- API GET/POST: /api/reviews
- Store: firmencheck-reviews
- Region: eu-central-1
