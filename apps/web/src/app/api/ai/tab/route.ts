import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
// import { createPerplexity } from '@ai-sdk/perplexity';
import { generateText } from 'ai';

import { getActiveSession } from '@/actions/utils';

export async function POST(req: NextRequest) {
  const session = await getActiveSession();

  if (!session || !session.user) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  const { model = 'gpt-4o-mini', prompt, system } = await req.json();

  //   const apiKey = process.env.PERPLEXITY_API_KEY;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing OpenAI API key.' }, { status: 401 });
  }

  const openai = createOpenAI({ apiKey });
  //   const perplexity = createPerplexity({ apiKey });

  try {
    const result = await generateText({
      abortSignal: req.signal,
      maxTokens: 50,
      model: openai(model),
      prompt: prompt,
      system,
      temperature: 0.7,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(null, { status: 408 });
    }

    return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 });
  }
}
