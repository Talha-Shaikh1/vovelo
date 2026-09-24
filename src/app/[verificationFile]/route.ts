import { NextRequest } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ verificationFile: string }> }
) {
  const { verificationFile } = await params;

  // Handles any Google Search Console HTML verification file request (e.g. /google12345678abcdef.html)
  if (
    verificationFile &&
    /^google[a-zA-Z0-9_-]+\.html$/i.test(verificationFile)
  ) {
    return new Response(`google-site-verification: ${verificationFile}`, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  }

  return new Response('Not Found', { status: 404 });
}
