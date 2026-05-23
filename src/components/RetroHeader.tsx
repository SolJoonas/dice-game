/** Retro header — hand-drawn notebook title with 90s flair. */

export function RetroHeader({ subtitle, scale = 1 }: { subtitle?: string; scale?: number }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 36 * scale }}>🎲🎲🎲</div>
      <div style={{ height: 8 }} />
      <div style={{
        display: 'inline-block',
        padding: '4px 20px',
        borderBottom: '3px dashed var(--border)',
      }}>
        <h1 style={{
          fontFamily: 'var(--font-title)',
          fontSize: 38 * scale,
          fontWeight: 700,
          color: 'var(--accent)',
          textShadow: '2px 2px 0px var(--border)',
          margin: 0,
          letterSpacing: 1,
        }}>
          Mökin tulospalvelu
        </h1>
      </div>
      {subtitle && (
        <>
          <div style={{ height: 6 }} />
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 16,
            color: 'var(--text-secondary)',
            letterSpacing: 3,
            margin: 0,
            fontStyle: 'italic',
          }}>
            {subtitle}
          </p>
        </>
      )}
    </div>
  );
}
