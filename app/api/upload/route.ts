import { NextRequest, NextResponse } from 'next/server';
import { uploadToBlobStorage } from '@/lib/azure/blob';
import { trackEvent } from '@/lib/azure/telemetry';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File | null;
      if (!file) {
        return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      const uploadResult = await uploadToBlobStorage(
        buffer,
        file.name || 'uploaded_image.png',
        file.type || 'image/png'
      );

      trackEvent('ImageUploadedBlob', { filename: file.name, size: file.size, isMock: uploadResult.isMock });
      return NextResponse.json({ success: true, url: uploadResult.url, isMock: uploadResult.isMock });
    } else {
      const body = await req.json();
      const { image, filename } = body;
      
      if (!image) {
        return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
      }

      const uploadResult = await uploadToBlobStorage(
        image,
        filename || 'image.png',
        'image/png'
      );

      trackEvent('Base64UploadedBlob', { filename, isMock: uploadResult.isMock });
      return NextResponse.json({ success: true, url: uploadResult.url, isMock: uploadResult.isMock });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
