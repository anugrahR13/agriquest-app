import { NextRequest, NextResponse } from 'next/server';
import { analyzePlantHealth } from '../../../../server/utils/aiAnalysis';
import { authenticateToken } from '../shared/auth';

// Analyze crop image
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticateToken(request);
    
    if ('error' in authResult && authResult.error) {
      return NextResponse.json({ error: authResult.error.message }, { status: authResult.error.status });
    }

    const user = authResult.user;
    const body = await request.json();
    const { imageUrl } = body;
    
    // Validate input
    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }
    
    // Analyze the image using AI
    const analysisResult = await analyzePlantHealth(imageUrl);
    
    // Return the analysis result
    return NextResponse.json({ 
      message: 'Crop analysis completed successfully',
      analysis: analysisResult
    });
  } catch (error) {
    console.error('Error analyzing crop image:', error);
    return NextResponse.json({ error: 'Failed to analyze crop image' }, { status: 500 });
  }
}