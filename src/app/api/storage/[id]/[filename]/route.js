import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { stat, access } from 'fs/promises';

// Storage directory configuration
const STORAGE_DIR = process.env.STORAGE_DIR || path.join(process.cwd(), 'storage');
const IMAGES_DIR = path.join(STORAGE_DIR, 'images');
const VIDEOS_DIR = path.join(STORAGE_DIR, 'videos');

/**
 * Handles GET requests to retrieve file content by ID and filename
 * @route GET /api/storage/{id}/{filename}
 */
export async function GET(request, { params }) {
  try {
    const { id, filename } = params;
    
    if (!id || !filename) {
      return NextResponse.json(
        { error: 'File ID and filename are required' },
        { status: 400 }
      );
    }

    // Prevent directory traversal attack
    const sanitizedId = path.basename(id);
    
    // Determine file type from extension and choose appropriate directory
    const fileExtension = sanitizedId.split('.').pop().toLowerCase();
    const isVideo = ['mp4', 'webm', 'ogg'].includes(fileExtension);
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension);
    
    let filePath;
    if (isVideo) {
      filePath = path.join(VIDEOS_DIR, sanitizedId);
    } else if (isImage) {
      filePath = path.join(IMAGES_DIR, sanitizedId);
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 }
      );
    }
    
    // Check if file exists
    try {
      await access(filePath);
    } catch (error) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
    
    // Get file stats
    const stats = await stat(filePath);
    
    // Set appropriate content type based on file extension
    let contentType = 'application/octet-stream';
    if (isVideo) {
      switch (fileExtension) {
        case 'mp4': contentType = 'video/mp4'; break;
        case 'webm': contentType = 'video/webm'; break;
        case 'ogg': contentType = 'video/ogg'; break;
      }
    } else if (isImage) {
      switch (fileExtension) {
        case 'jpg': case 'jpeg': contentType = 'image/jpeg'; break;
        case 'png': contentType = 'image/png'; break;
        case 'gif': contentType = 'image/gif'; break;
        case 'webp': contentType = 'image/webp'; break;
      }
    }
    
    // Create file stream
    const fileStream = fs.createReadStream(filePath);
    
    // Set response headers
    const headers = {
      'Content-Length': stats.size,
      'Content-Type': contentType,
      'Content-Disposition': `inline; filename="${encodeURIComponent(filename)}"`,
    };
    
    // Return the file as response
    return new NextResponse(fileStream, {
      status: 200,
      headers,
    });
    
  } catch (error) {
    console.error('Error serving file:', error);
    return NextResponse.json(
      { error: 'Failed to serve file' },
      { status: 500 }
    );
  }
}
