# Mökin tulospalvelu — Tekninen dokumentaatio

Monipelinen tulospalvelusovellus, joka tukee kolmea peliä: **Noppapeli**, **Mökkipeli** ja **Ristiseiska**. Rakennettu React + TypeScript -teknologialla ja suunniteltu asennettavaksi PWA-sovelluksena mobiililaitteille.

---

## Arkkitehtuurikatsaus

```
react-app/
├── index.html               # HTML-kuori, PWA-metatiedot
├── public/
│   └── manifest.json        # PWA-manifest
├── src/
│   ├── main.tsx              # React-sovelluksen juurikomponentti
│   ├── App.tsx               # Reititys ja näyttöjen valinta
│   ├── index.css             # Globaali CSS-suunnittelujärjestelmä
│   ├── models/               # Tietomallit (puhdasta logiikkaa, ei UI:ta)
│   │   ├── game.ts           # Pelin tila ja pelityypit
│   │   ├── player.ts         # Noppapelin pelaajamalli + pisteet
│   │   ├── scorecard.ts      # Tuloskortin kategoriat ja pisteytyslogiikka
│   │   ├── mokkipeli-player.ts   # Mökkipelin pelaajamalli
│   │   └── ristiseiska-player.ts # Ristiseiskan pelaajamalli
│   ├── components/           # Uudelleenkäytettävät UI-komponentit
│   │   ├── RetroHeader.tsx       # Sovelluksen otsikkokomponentti
│   │   ├── ScorecardTable.tsx    # Noppapelin tuloskorttitaulukko
│   │   ├── ScoreCell.tsx         # Yksittäinen pistesolu
│   │   ├── PlayerColumn.tsx      # Pelaajan sarake (ei käytössä nykyisessä versiossa)
│   │   ├── ScoreInputDialog.tsx  # Pisteiden syöttödialogi
│   │   └── CardCalculatorDialog.tsx # Ristiseiskan korttilaskuri
│   ├── screens/              # Sovellusnäkymät
│   │   ├── HomeScreen.tsx        # Päävalikko
│   │   ├── NewGameScreen.tsx     # Uuden pelin luonti
│   │   ├── GameScreen.tsx        # Noppapelin pelinäkymä
│   │   ├── MokkipeliGameScreen.tsx   # Mökkipelin pelinäkymä
│   │   ├── RistiseiskaGameScreen.tsx # Ristiseiskan pelinäkymä
│   │   ├── HistoryScreen.tsx     # Pelihistoria
│   │   └── SettingsScreen.tsx    # Asetukset
│   └── hooks/                # React-koukut
│       ├── useRouter.ts          # Hash-pohjainen reititys
│       ├── useStorage.ts         # LocalStorage-hallinta
│       └── useSound.ts          # Äänitehosteet
```

---

## Teknologiat

| Teknologia | Versio | Käyttö |
|---|---|---|
| React | 19.x | UI-kirjasto |
| TypeScript | 5.x | Tyyppiturvallisuus |
| Vite | 8.x | Kehityspalvelin ja tuotantorakennus |
| CSS (vanilla) | — | Tyylit ilman ulkoisia kirjastoja |
| Google Fonts | — | Caveat & Patrick Hand -fontit |

### Ei ulkoisia ajonaikaisia riippuvuuksia
Sovellus ei käytä ulkoisia UI-kirjastoja, tila-hallintakirjastoja eikä reitityskirjastoja. Kaikki on toteutettu natiiveilla web-API:lla.

---

## Tietomallit

### Game (`models/game.ts`)
```typescript
interface Game {
  id: string;
  gameType: 'noppapeli' | 'mokkipeli' | 'ristiseiska';
  players: Player[];
  state: 'inProgress' | 'completed';
  createdAt: string;  // ISO 8601
  updatedAt: string;
  extraData: Record<string, unknown>;  // Pelityyppikohtainen data
}
```

### Player (`models/player.ts`)
Noppapelin pelaaja. Sisältää tuloskortin (`scores`-objekti) jossa avain on kategorian id ja arvo pistemäärä tai `null`.

**Laskentafunktiot:**
- `upperTotal(player)` — Yläosan summa (ykköset–kutoset)
- `upperBonus(player)` — Bonus (50p jos yläosa ≥ 63)
- `lowerTotal(player)` — Alaosan summa
- `grandTotal(player)` — Kokonaispisteet

### Scorecard (`models/scorecard.ts`)
15 kategoriaa jaettuna kahteen osaan:

**Yläosa:** Ykköset, Kakkoset, Kolmoset, Neloset, Vitoset, Kutoset
**Alaosa:** Pari, Kaksi paria, Kolme samaa, Neljä samaa, Pieni suora, Iso suora, Täyskäsi, Sattuma, Noppapeli

### MokkipeliPlayer (`models/mokkipeli-player.ts`)
```typescript
interface MokkipeliPlayer {
  name: string;
  throws: number[];      // Historia kaikista heitoista
  isEliminated: boolean;
}
```
- Heittää kerrallaan 0–12 pistettä
- Tavoite: täsmälleen 50 pistettä
- Valinnainen sääntö: ylityksestä nollaus 25 pisteeseen
- Valinnainen sääntö: 3 peräkkäistä nollaa → pudotus
- `undoThrow()` — Peru edellinen heitto

### RistiseiskaPlayer (`models/ristiseiska-player.ts`)
```typescript
interface RistiseiskaPlayer {
  name: string;
  roundScores: number[];  // Kierroskohtaiset rangaistuspisteet
  panttiCount: number;
}
```
- Korttipeli jossa seurataan rangaistuspisteitä
- Pantti (+25) sisältyy kierroksen pisteisiin
- Peli päättyy kun pelaaja saavuttaa pisterajan (oletus: 200)

---

## Tiedon tallennus

Kaikki data tallennetaan selaimen **LocalStorage**-muistiin:

| Avain | Sisältö |
|---|---|
| `dice_game_current` | Käynnissä oleva peli (JSON) |
| `dice_game_history` | Valmistuneet pelit (JSON-taulukko) |
| `dice_game_presets` | Pelaajien nimet esiasetusten pikalataukseen |
| `dice_game_sound` | Ääniasetus (true/false) |

---

## Reititys

Sovellus käyttää hash-pohjaista reititystä (`useRouter.ts`):

| Polku | Näkymä |
|---|---|
| `#/` tai `#/home` | Päävalikko |
| `#/new-game` | Uuden pelin luonti |
| `#/game` | Aktiivinen peli (pelityyppi ratkaisee näkymän) |
| `#/history` | Pelihistoria |
| `#/settings` | Asetukset |

---

## CSS-suunnittelujärjestelmä

### Värit (90-luvun teema)
- **Tausta:** `#FFF8F0` (kerma/paperi)
- **Pääväri:** `#00897B` (teal)
- **Koralli:** `#FF6F61`
- **Violetti:** `#7E57C2`
- **Kulta:** `#FFB300`
- **Virhe:** `#E53935`

### Fontit
- **Otsikot:** `Caveat` (käsinkirjoitus)
- **Leipäteksti:** `Patrick Hand` (käsinkirjoitus)

### Visuaalinen tyyli
- Viivoitettu vihkotausta (`repeating-linear-gradient`)
- Katkoviivareunukset (sketch-tyyli)
- Lyijykynävarjot (`2px 2px 0 #D4C9B8`)
- Paperimaiset kortit ja painikkeet

---

## Kehitys

### Vaatimukset
- Node.js 18+
- npm 9+

### Asennus ja käynnistys
```bash
cd react-app
npm install
npm run dev
```

### Tuotantorakennus
```bash
npm run build
```
Tulostiedostot luodaan `dist/`-kansioon.

### Tyyppitarkistus
```bash
npx tsc --noEmit
```

---

## PWA-tuki

Sovellus on asennettava Progressive Web App:
- `manifest.json` määrittelee sovelluksen nimen ja kuvakkeet
- `meta`-tagit tukevat iOS-asennusta
- Offline-tuki vaatii service workerin (ei vielä toteutettu)

---

## Pelien kulku

### Noppapeli
1. Pelaajat luodaan → tuloskortti alustetaan
2. Pelaaja napauttaa kategoriaa → syöttödialogi avautuu
3. Pisteet tallennetaan → bonus lasketaan automaattisesti
4. Kun kaikki kategoriat täytetty → peli valmis, voittaja näytetään

### Mökkipeli
1. Pelaajat vuorottelevat heittoja (0–12 pistettä)
2. Pisteet kertyvät kohti 50:tä
3. Ylitys → nollaus 25:een (valinnainen)
4. 3 peräkkäistä nollaa → pudotus (valinnainen)
5. Ensimmäinen 50:een → voittaja
6. Peru-nappi mahdollistaa virheiden korjauksen

### Ristiseiska
1. Kierrokset lisätään pelaaja kerrallaan
2. Korttilaskuri laskee rangaistuspisteet automaattisesti
3. Pantti (+25) sisältyy kierroksen pisteisiin (max 1 per kierros)
4. Pisterajan saavuttanut pelaaja → peli päättyy
5. Vähiten pisteitä saanut voittaa
