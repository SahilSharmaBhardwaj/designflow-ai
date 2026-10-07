import { NextRequest, NextResponse } from 'next/server';
import { AIProviderFactory } from '@/lib/ai/factory';
import { GenerationRequest } from '@/lib/ai/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GenerationRequest & { providerId?: string };

    if (!body.requirements || !body.requirements.title || !body.requirements.problemStatement) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title and problemStatement are mandatory.' },
        { status: 400 }
      );
    }

    const provider = AIProviderFactory.getProvider(body.providerId);
    const result = await provider.generate(body);

    return NextResponse.json(result);
  } catch (error) {
    const err = error as Error;
    console.error('[API /api/generate] Error during UX artifact synthesis:', err.message);

    return NextResponse.json(
      {
        success: false,
        error: err.message || 'Internal server error during UX artifact generation.',
      },
      { status: 500 }
    );
  }
}
