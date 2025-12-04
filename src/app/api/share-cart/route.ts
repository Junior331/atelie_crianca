import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { items, formData } = await request.json();

    // Encode cart data to base64 for URL sharing
    const cartData = {
      items,
      formData,
      timestamp: Date.now(),
    };

    const encoded = Buffer.from(JSON.stringify(cartData)).toString('base64url');

    return NextResponse.json({
      success: true,
      shareId: encoded
    });
  } catch (error) {
    console.error('Error sharing cart:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate share link'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const shareId = searchParams.get('id');

    if (!shareId) {
      return NextResponse.json({
        success: false,
        error: 'Share ID is required'
      }, { status: 400 });
    }

    // Decode base64url to get cart data
    const decoded = Buffer.from(shareId, 'base64url').toString('utf-8');
    const cartData = JSON.parse(decoded);

    return NextResponse.json({
      success: true,
      cartData
    });
  } catch (error) {
    console.error('Error loading shared cart:', error);
    return NextResponse.json({
      success: false,
      error: 'Invalid share link'
    }, { status: 400 });
  }
}
