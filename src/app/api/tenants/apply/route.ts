import { NextResponse } from 'next/server';
import { submitMerchantApplication } from '@/lib/data-service';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, country, city, story, website, contactPerson, ecoBadges } = body;

    if (!name || !email || !country || !city || !story || !contactPerson) {
      return NextResponse.json(
        { error: 'Please provide all required maker application details.' },
        { status: 400 }
      );
    }

    const result = await submitMerchantApplication({
      name,
      email,
      country,
      city,
      story,
      website,
      contactPerson,
      ecoBadges,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Application submission failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
