# Mökin Tulospalvelu — Scoreboard App 🎲

[Suomeksi](#suomeksi) | [In English](#in-english)

---

## Suomeksi

**Mökin Tulospalvelu** on retrohenkinen (90-luvun tyylinen) monipelin tulospalvelusovellus, joka on suunniteltu erityisesti mökkipeleihin ja perinteisiin seurapeleihin. Sovellus on optimoitu mobiililaitteille ja se voidaan asentaa **PWA-sovelluksena** offline-käyttöä varten.

### Tuetut pelit
1. **Noppapeli** (Yatzy-tyylinen) — Täydellinen 15 kategorian tuloskortti ylä- ja alaosioineen, automaattisella bonuksen laskennalla (rajana 63 pistettä).
2. **Mökkipeli** — Peli, jossa heitetään tikkaa tai heittopulikoita tavoitellen täsmälleen 50 pistettä. Ylityksestä palaa 25 pisteeseen ja 3 peräkkäistä nollaa voi johtaa tippumiseen (säädettävissä asetuksista).
3. **Ristiseiska** — Perinteinen korttipeli rangaistuspisteiden seurannalla, panttimekaniikalla ja automaattisella korttilaskurilla.

### Pääominaisuudet
- 🎨 **90-luvun retrotyyli**: Käsinkirjoitetut fontit (*Caveat* ja *Patrick Hand*), ruutupaperitausta, luonnosmaiset reunat ja lyijykynävarjot.
- 💾 **Paikallinen tallennus**: Pelit tallentuvat automaattisesti selaimesi `LocalStorageen`, joten pelisi ei katoa vaikka suljet selaimen tai verkkoyhteys katkeaa.
- 🔊 **Äänitehosteet**: Hauskat retroäänet tuomaan fiilistä peli-iltoihin.
- 📱 **PWA-tuki**: Voit lisätä sovelluksen suoraan puhelimesi kotinäytölle pikakuvakkeeksi.

---

## In English

**Mökin Tulospalvelu** (Cottage Scoreboard) is a retro-themed (90s aesthetic) multi-game score-tracking web application designed for cabin games and traditional tabletop games. Built with React and TypeScript, it is optimized for mobile screens and installable as a **Progressive Web App (PWA)**.

### Supported Games
1. **Noppapeli** (Yatzy-like) — Comprehensive 15-category scorecard with automatic bonus calculation (+50 points when upper score is 63 or higher).
2. **Mökkipeli** (Cottage Game) — A lawn throwing game where the objective is to hit exactly 50 points. Exceeding 50 resets the score to 25. Getting 3 consecutive zeros can result in elimination (configurable).
3. **Ristiseiska** (Sevens Card Game) — Finnish card game scoring that tracks penalty points and custom penalty multipliers, featuring an interactive hand value calculator.

### Key Features
- 🎨 **90s Retro Aesthetic**: Notebook paper backgrounds, sketched borders, pencil-style shadows, and casual handwriting fonts (*Caveat* & *Patrick Hand*).
- 💾 **Offline-first Local Storage**: Keeps game state, history, and player presets saved directly in your browser's local cache.
- 🔊 **Sound Effects**: Playful retro sounds for interactions, which can be toggled in settings.
- 📱 **PWA Support**: Easily add the app to your mobile home screen.

---

## 🛠️ Kehitys & Asennus / Development & Setup

### Vaatimukset / Requirements
- **Node.js** (v18+)
- **npm** (v9+)

### Asennus / Installation
Asenna riippuvuudet ajamalla seuraava komento projektihakemistossa:
```bash
npm install
```

### Käynnistys kehitystilassa / Start Development Server
Käynnistä paikallinen Vite-kehityspalvelin:
```bash
npm run dev
```
Avaa selaimeen osoite `http://localhost:5173` (tai komentorivin ilmoittama portti).

### Tuotantoversio / Production Build
Rakenna optimoitu tuotantoversio `dist/`-kansioon:
```bash
npm run build
```

### Tyyppitarkistus / Type Checking
Voit suorittaa TypeScript-tyyppitarkistuksen:
```bash
npx tsc --noEmit
```

---

## 📂 Sovelluksen rakenne / Project Structure
```
react-app/
├── public/                 # PWA-kuvakkeet ja manifest.json
├── src/
│   ├── components/         # Uudelleenkäytettävät käyttöliittymäkomponentit
│   ├── hooks/              # Reititys-, tallennus- ja äänikoukut
│   ├── models/             # Pelilogiikka ja tietomallit (Noppapeli, Mökkipeli, Ristiseiska)
│   ├── screens/            # Pelin eri näkymät (Koti, Uusi peli, Tuloskortit, Asetukset jne.)
│   ├── App.tsx             # Sovelluksen reititin
│   └── index.css           # 90-luvun retrotyylin teemat ja globaalit tyylit
└── DOCUMENTATION.md        # Kattavampi tekninen dokumentaatio (suomeksi)
```

Tarkempia arkkitehtuuri- ja tietomallitietoja löydät tiedostosta [DOCUMENTATION.md](file:///c:/Users/Bromhum%20Highmantle/Desktop/Dice%20game/react-app/DOCUMENTATION.md).

