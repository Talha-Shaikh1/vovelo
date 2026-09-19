import { NextResponse } from 'next/server';
import { getCategoryRequests, submitCategoryRequest } from '@/lib/data-service';

export async function GET() {
  const requests = await getCategoryRequests();
  return NextResponse.json(requests);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, suggestedParentId, tenantId, tenantName } = body;

    if (!name || !description || !tenantId) {
      return NextResponse.json(
        { error: 'Name, description and tenantId are required' },
        { status: 400 }
      );
    }

    const newRequest = await submitCategoryRequest({
      name,
      description,
      suggestedParentId,
      tenantId,
      tenantName: tenantName || 'European Artisan',
    });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to submit request';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
