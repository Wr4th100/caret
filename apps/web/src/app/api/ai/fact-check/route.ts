import { NextRequest, NextResponse } from 'next/server';
import { createPerplexity } from '@ai-sdk/perplexity';
import { generateText } from 'ai';

import { getActiveSession } from '@/actions/utils';

export async function POST(req: NextRequest) {
  const session = await getActiveSession();
  if (!session || !session.user) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }

  const { text } = await req.json();

  const apiKey = process.env.PERPLEXITY_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Missing Perplexity API key.' }, { status: 401 });
  }

  const perplexity = createPerplexity({ apiKey });

  const system = `You are a fact-checking AI. Your task is to evaluate the truthfulness of statements and respond with "true", "false", or "uncertain". Make sure the first word of your response is the verdict, followed by a brief explanation if necessar, no more that one line.`;
  const prompt = `Fact check this statement: "${text}" and respond with true, false, or uncertain.`;

  try {
    const result = await generateText({
      abortSignal: req.signal,
      maxTokens: 50,
      model: perplexity('sonar'),
      prompt,
      system,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(null, { status: 408 });
    }

    return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 });
  }
}
