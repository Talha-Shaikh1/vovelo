import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 110,
          background: 'linear-gradient(135deg, #0F5132 0%, #061F13 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontWeight: 900,
          borderRadius: 40,
          border: '4px solid rgba(212, 175, 55, 0.6)',
          fontFamily: 'serif',
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.4)',
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
