import { NextResponse } from 'next/server';
import { AIProviderFactory } from '@/lib/ai/factory';

export const dynamic = 'force-dynamic';

export async function GET() {
  const providers = AIProviderFactory.getAllProviderInfo();
  const activeProvider = AIProviderFactory.getProvider();

  return NextResponse.json({
    status: 'ok',
    app: 'DesignFlow AI',
    version: '0.1.0',
    activeProvider: {
      id: activeProvider.id,
      name: activeProvider.name,
      info: activeProvider.getModelInfo(),
    },
    availableProviders: providers,
    timestamp: new Date().toISOString(),
  });
}
