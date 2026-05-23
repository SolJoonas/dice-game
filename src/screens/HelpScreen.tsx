/** Ohje — game rules and app instructions. */

import { useState } from 'react';
import { useRouter } from '../hooks/useRouter';

type HelpTab = 'app' | 'noppapeli' | 'mokkipeli' | 'ristiseiska';

export function HelpScreen() {
  const { navigate } = useRouter();
  const [activeTab, setActiveTab] = useState<HelpTab>('app');

  const tabs: { id: HelpTab; label: string; icon: string }[] = [
    { id: 'app', label: 'Sovellus', icon: '📱' },
    { id: 'noppapeli', label: 'Noppapeli', icon: '🎲' },
    { id: 'mokkipeli', label: 'Mökkipeli', icon: '🎯' },
    { id: 'ristiseiska', label: 'Ristiseiska', icon: '♣️' },
  ];

  return (
    <div className="screen">
      <div className="app-bar">
        <button className="app-bar-back" onClick={() => navigate('home')}>←</button>
        <span className="app-bar-title">Ohje</span>
        <div style={{ width: 40 }} />
      </div>

      {/* Tab bar */}
      <div style={{
        display: 'flex',
        gap: 4,
        padding: '8px 12px',
        overflowX: 'auto',
        borderBottom: '1px dashed var(--border)',
      }}>
        {tabs.map(tab => {
          const sel = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                minWidth: 70,
                padding: '6px 8px',
                borderRadius: 6,
                border: `2px ${sel ? 'solid' : 'dashed'} ${sel ? 'var(--accent)' : 'var(--border)'}`,
                background: sel ? 'rgba(0,137,123,0.08)' : 'transparent',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              <div style={{ fontSize: 16 }}>{tab.icon}</div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: 11,
                fontWeight: sel ? 700 : 400,
                color: sel ? 'var(--accent)' : 'var(--text-secondary)',
                marginTop: 2,
              }}>{tab.label}</div>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="screen-body" style={{ overflow: 'auto', padding: '16px 20px', paddingBottom: 32 }}>
        {activeTab === 'app' && <AppHelp />}
        {activeTab === 'noppapeli' && <NoppapeliHelp />}
        {activeTab === 'mokkipeli' && <MokkipeliHelp />}
        {activeTab === 'ristiseiska' && <RistiseiskaHelp />}
      </div>
    </div>
  );
}

/* ── Shared styles ─────────────────────────────────── */

const sectionStyle: React.CSSProperties = {
  marginBottom: 20,
};

const headingStyle: React.CSSProperties = {
  fontSize: 20,
  fontFamily: 'var(--font-title)',
  fontWeight: 700,
  color: 'var(--accent)',
  marginBottom: 8,
};

const subheadingStyle: React.CSSProperties = {
  fontSize: 16,
  fontFamily: 'var(--font-title)',
  fontWeight: 700,
  color: 'var(--violet)',
  marginBottom: 6,
  marginTop: 12,
};

const textStyle: React.CSSProperties = {
  fontSize: 14,
  color: 'var(--text-primary)',
  lineHeight: 1.6,
  marginBottom: 6,
};

const listStyle: React.CSSProperties = {
  fontSize: 14,
  color: 'var(--text-primary)',
  lineHeight: 1.8,
  paddingLeft: 20,
  marginBottom: 8,
};

const tipStyle: React.CSSProperties = {
  fontSize: 13,
  color: 'var(--accent)',
  fontStyle: 'italic',
  padding: '8px 12px',
  background: 'rgba(0,137,123,0.06)',
  borderRadius: 6,
  border: '1px dashed var(--accent)',
  marginBottom: 12,
};

/* ── App Help ────────────────────────────────────────── */

function AppHelp() {
  return (
    <>
      <div style={sectionStyle}>
        <h2 style={headingStyle}>📱 Kuinka sovellus toimii</h2>
        <p style={textStyle}>
          Mökin tulospalvelu on tuloskortti-sovellus kolmelle suosittulle pelille. Kaikki pisteet
          tallentuvat automaattisesti laitteesi muistiin — voit sulkea selaimen ja jatkaa myöhemmin.
        </p>
      </div>

      <div style={sectionStyle}>
        <h3 style={subheadingStyle}>🎮 Pelin aloitus</h3>
        <ol style={listStyle}>
          <li>Paina <strong>Uusi peli</strong> kotinäytöllä</li>
          <li>Valitse pelityyppi (Noppapeli, Mökkipeli tai Ristiseiska)</li>
          <li>Lisää pelaajien nimet</li>
          <li>Paina <strong>Aloita peli</strong></li>
        </ol>
      </div>

      <div style={sectionStyle}>
        <h3 style={subheadingStyle}>💾 Tallennus</h3>
        <p style={textStyle}>
          Peli tallentuu automaattisesti jokaisen muutoksen jälkeen. Voit turvallisesti sulkea
          selaimen ja jatkaa peliä myöhemmin <strong>Jatka</strong>-napista.
        </p>
      </div>

      <div style={sectionStyle}>
        <h3 style={subheadingStyle}>📜 Historia</h3>
        <p style={textStyle}>
          Valmistuneet pelit tallennetaan historiaan. Voit tarkistaa aiemmat tulokset
          <strong> Historia</strong>-napista kotinäytöllä.
        </p>
      </div>

      <div style={sectionStyle}>
        <h3 style={subheadingStyle}>🏆 Tilanne</h3>
        <p style={textStyle}>
          Pelin aikana voit tarkistaa tilanteen painamalla 🏆-nappia yläpalkista.
        </p>
      </div>

      <div style={tipStyle}>
        💡 Vinkki: Voit asentaa sovelluksen kotinäytöllesi selaimen valikosta — se toimii kuin
        natiivi sovellus!
      </div>
    </>
  );
}

/* ── Noppapeli Help ──────────────────────────────────── */

function NoppapeliHelp() {
  return (
    <>
      <div style={sectionStyle}>
        <h2 style={headingStyle}>🎲 Noppapeli (Yatzy)</h2>
        <p style={textStyle}>
          Klassinen noppapeli viidellä nopalla. Pelaajat heittävät vuorollaan noppia ja yrittävät
          saada mahdollisimman hyvät yhdistelmät tuloskortin kategorioihin.
        </p>
      </div>

      <div style={sectionStyle}>
        <h3 style={subheadingStyle}>📋 Tuloskortin yläosa</h3>
        <p style={textStyle}>Laske yhteen kaikki tietyn silmäluvun nopat:</p>
        <ul style={listStyle}>
          <li><strong>Ykköset</strong> — kaikkien ykkösten summa (max 5)</li>
          <li><strong>Kakkoset</strong> — kaikkien kakkosten summa (max 10)</li>
          <li><strong>Kolmoset</strong> — kaikkien kolmosten summa (max 15)</li>
          <li><strong>Neloset</strong> — kaikkien nelosten summa (max 20)</li>
          <li><strong>Vitoset</strong> — kaikkien vitosten summa (max 25)</li>
          <li><strong>Kutoset</strong> — kaikkien kutosten summa (max 30)</li>
        </ul>
        <div style={tipStyle}>
          🎯 Bonus: Jos yläosan summa on vähintään 63, saat 50 pisteen bonuksen!
        </div>
      </div>

      <div style={sectionStyle}>
        <h3 style={subheadingStyle}>📋 Tuloskortin alaosa</h3>
        <ul style={listStyle}>
          <li><strong>Pari</strong> — kaksi samaa noppaa, parin summa (max 12)</li>
          <li><strong>Kaksi paria</strong> — kaksi eri paria, parien summa (max 22)</li>
          <li><strong>Kolme samaa</strong> — kolme samaa noppaa, niiden summa (max 18)</li>
          <li><strong>Neljä samaa</strong> — neljä samaa noppaa, niiden summa (max 24)</li>
          <li><strong>Pieni suora</strong> — 1-2-3-4-5, aina 15 pistettä</li>
          <li><strong>Iso suora</strong> — 2-3-4-5-6, aina 20 pistettä</li>
          <li><strong>Täyskäsi</strong> — kolme samaa + pari, kaikkien summa (max 28)</li>
          <li><strong>Sattuma</strong> — kaikkien noppien summa, mikä tahansa yhdistelmä (max 30)</li>
          <li><strong>Noppapeli</strong> — kaikki viisi samaa, aina 50 pistettä!</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h3 style={subheadingStyle}>🕹️ Miten pelaat sovelluksessa</h3>
        <ol style={listStyle}>
          <li>Pyyhkäise vasemmalle/oikealle vaihtaaksesi pelaajaa</li>
          <li>Napauta kategoriaa tuloskortin ruudusta</li>
          <li>Syötä pisteet tai valitse pikapainike</li>
          <li>Kun kaikki kategoriat on täytetty, peli päättyy automaattisesti</li>
        </ol>
      </div>

      <div style={tipStyle}>
        💡 Vinkki: Voit muokata jo syöttämiäsi pisteitä napauttamalla kategoriaa uudelleen!
      </div>
    </>
  );
}

/* ── Mökkipeli Help ──────────────────────────────────── */

function MokkipeliHelp() {
  return (
    <>
      <div style={sectionStyle}>
        <h2 style={headingStyle}>🎯 Mökkipeli</h2>
        <p style={textStyle}>
          Mökkipeli on numeropalikoilla heitettävä peli, jossa tavoitteena on saada täsmälleen
          50 pistettä. Pelaajat heittävät vuorotellen ja pisteytys on 0–12 per heitto.
        </p>
      </div>

      <div style={sectionStyle}>
        <h3 style={subheadingStyle}>📏 Säännöt</h3>
        <ul style={listStyle}>
          <li>Jokainen heitto antaa 0–12 pistettä</li>
          <li>Pisteet kertyvät kohti 50:tä</li>
          <li>Ensimmäinen pelaaja, joka saavuttaa täsmälleen 50 pistettä, voittaa!</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h3 style={subheadingStyle}>⚙️ Valinnaiset säännöt</h3>
        <ul style={listStyle}>
          <li><strong>↩️ Nollaus ylityksestä</strong> — Jos pisteet ylittävät 50, ne palautuvat 25 pisteeseen</li>
          <li><strong>💀 Pudotus 3 hutista</strong> — Jos pelaaja heittää 3 peräkkäistä nollaa, hän putoaa pelistä</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h3 style={subheadingStyle}>🕹️ Miten pelaat sovelluksessa</h3>
        <ol style={listStyle}>
          <li>Napauta pelaajan korttia lisätäksesi heiton</li>
          <li>Valitse heiton pistemäärä (0–12)</li>
          <li>Napauta aiempaa heittoa (chippiä) muokataksesi tai poistaaksesi sen</li>
        </ol>
      </div>

      <div style={tipStyle}>
        💡 Vinkki: Valinnaiset säännöt voi asettaa pelin alussa uusi peli -näkymässä!
      </div>
    </>
  );
}

/* ── Ristiseiska Help ────────────────────────────────── */

function RistiseiskaHelp() {
  return (
    <>
      <div style={sectionStyle}>
        <h2 style={headingStyle}>♣️ Ristiseiska</h2>
        <p style={textStyle}>
          Ristiseiska on korttipeli, jossa pelaajat yrittävät päästä eroon korteistaan. Käteen
          jäävät kortit tuottavat rangaistuspisteitä. Vähiten rangaistuspisteitä saanut voittaa!
        </p>
      </div>

      <div style={sectionStyle}>
        <h3 style={subheadingStyle}>📏 Pisteytys</h3>
        <ul style={listStyle}>
          <li>Kuvakortit (J, Q, K) = 10 pistettä / kpl</li>
          <li>Ässät (A) = 15 pistettä / kpl</li>
          <li>Numerokortit = kortin numero</li>
          <li>Pantti = +25 lisäpistettä</li>
        </ul>
      </div>

      <div style={sectionStyle}>
        <h3 style={subheadingStyle}>🏁 Pelin päättyminen</h3>
        <p style={textStyle}>
          Peli päättyy kun jonkun pelaajan kokonaispisteet saavuttavat pisterajan (oletus: 200 pistettä).
          Vähiten rangaistuspisteitä kerännyt pelaaja voittaa!
        </p>
      </div>

      <div style={sectionStyle}>
        <h3 style={subheadingStyle}>🕹️ Miten pelaat sovelluksessa</h3>
        <ol style={listStyle}>
          <li>Napauta pelaajan korttia lisätäksesi kierroksen pisteet</li>
          <li>Käytä korttilaskuria laskemaan rangaistuspisteet automaattisesti</li>
          <li>Napauta aiempia kierroksia muokataksesi tai poistaaksesi niitä</li>
          <li>Pisterajan voi muuttaa pelin aikana yläpalkin asetuksista</li>
        </ol>
      </div>

      <div style={tipStyle}>
        💡 Vinkki: Korttilaskurilla voit valita käteen jääneet kortit yksitellen — sovellus laskee
        pisteet puolestasi!
      </div>
    </>
  );
}
