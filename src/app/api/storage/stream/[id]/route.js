import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { stat, access } from 'fs/promises';

// Storage directory configuration
const STORAGE_DIR = process.env.STORAGE_DIR || path.join(process.cwd(), 'storage');
const VIDEOS_DIR = path.join(STORAGE_DIR, 'videos');

/**
 * Handles GET requests to stream video content
 * @route GET /api/storage/stream/{id}
 */
export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // Prevent directory traversal attack
    const sanitizedId = path.basename(id);
    const videoPath = path.join(VIDEOS_DIR, sanitizedId);
    
    // Check if file exists
    try {
      await access(videoPath);
    } catch (error) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }
    
    // Get file stats for headers
    const stats = await stat(videoPath);
    const fileSize = stats.size;
    
    // Parse range header from request
    const range = request.headers.get('range');
    
    if (range) {
      // Handle range request for video streaming
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;
      
      // Create read stream for the requested range
      const fileStream = fs.createReadStream(videoPath, { start, end });
      
      // Set appropriate headers for range response
      const headers = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': 'video/mp4', // We could detect this dynamically
      };
      
      return new NextResponse(fileStream, {
        status: 206,
        headers,
      });
    } else {
      // Serve the whole file if no range is requested
      const fileStream = fs.createReadStream(videoPath);
      
      const headers = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4', // We could detect this dynamically
        'Accept-Ranges': 'bytes',
      };
      
      return new NextResponse(fileStream, {
        status: 200,
        headers,
      });
    }
  } catch (error) {
    console.error('Error streaming video:', error);
    return NextResponse.json(
      { error: 'Failed to stream video' },
      { status: 500 }
    );
  }
}
