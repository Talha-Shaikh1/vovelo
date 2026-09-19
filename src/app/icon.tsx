import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: 'linear-gradient(135deg, #0F5132 0%, #072617 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontWeight: 900,
          borderRadius: 8,
          border: '1px solid rgba(212, 175, 55, 0.4)',
          fontFamily: 'serif',
          letterSpacing: '-1px',
        }}
      >
        V
      </div>
    ),
    {
      ...size,
    }
  );
}
