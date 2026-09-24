import { NextResponse } from 'next/server';
import { mergeProductsIntoVariants } from '@/lib/data-service';
import { requireAuth } from '@/lib/auth-guard';

export async function POST(request: Request) {
  try {
    const auth = await requireAuth(['SUPER_ADMIN', 'ADMIN']);
    if (auth.errorResponse) return auth.errorResponse;

    const body = await request.json();
    const {
      masterProductId,
      mergedProductIds,
      optionName = 'Color',
      variantCustomNames = {},
      preserveRedirects = true,
    } = body;

    if (!masterProductId || !mergedProductIds || !Array.isArray(mergedProductIds) || mergedProductIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Master product and at least one item to merge are required' },
        { status: 400 }
      );
    }

    const result = await mergeProductsIntoVariants({
      masterProductId,
      mergedProductIds,
      optionName,
      variantCustomNames,
      preserveRedirects,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      masterProduct: result.masterProduct,
      message: `Successfully merged ${mergedProductIds.length} items into ${result.masterProduct?.title} as ${optionName} variants with 301 redirects preserved.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to merge variants' },
      { status: 500 }
    );
  }
}
