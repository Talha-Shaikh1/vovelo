import { ImageResponse } from 'next/og';

export const alt = 'Vovelo — Haute Couture Luxury Archive';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#0d1511',
          backgroundImage: 'radial-gradient(circle at 50% 30%, #173b28 0%, #0d1511 75%)',
          padding: '60px 80px',
          fontFamily: 'sans-serif',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '24px',
            border: '1px solid rgba(52, 211, 153, 0.25)',
            borderRadius: '24px',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 24px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(52, 211, 153, 0.4)',
            color: '#34d399',
            fontSize: '15px',
            fontWeight: 700,
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}
        >
          <span>*</span>
          <span>1:1 Master Quality Archive</span>
          <span>*</span>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '16px',
            maxWidth: '960px',
          }}
        >
          <div
            style={{
              fontSize: '76px',
              fontWeight: 900,
              letterSpacing: '-2px',
              color: '#ffffff',
              lineHeight: 1,
              textTransform: 'uppercase',
            }}
          >
            VOVELO
          </div>
          <div
            style={{
              fontSize: '26px',
              fontWeight: 400,
              color: '#d1fae5',
              lineHeight: 1.4,
              maxWidth: '820px',
            }}
          >
            Curated Designer Handbags, Swiss Timepieces, Handcrafted Footwear & Archive Collections
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px',
            width: '100%',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', color: '#a7f3d0', fontWeight: 600 }}>
            <span>[+]</span> 1:1 Material Match
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', color: '#a7f3d0', fontWeight: 600 }}>
            <span>[+]</span> 7-Day Inspection Guarantee
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', color: '#a7f3d0', fontWeight: 600 }}>
            <span>[+]</span> Discreet Express Delivery
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
