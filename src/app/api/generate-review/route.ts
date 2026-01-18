import { NextRequest, NextResponse } from 'next/server';
import { geminiService } from '@/lib/services/gemini.service';
import { ReviewGenerationRequest } from '@/lib/types/user';

export async function POST(request: NextRequest) {
  try {
    const body: ReviewGenerationRequest = await request.json();

    // Validate request
    if (!body.employeeName || !body.companyName || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate review using Gemini
    const review = await geminiService.generateReview(body);

    return NextResponse.json({ review });
  } catch (error) {
    console.error('Error in generate-review API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate review' },
      { status: 500 }
    );
  }
}
