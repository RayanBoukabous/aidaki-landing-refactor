import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { mkdir, writeFile } from 'fs/promises';

// Storage directory configuration
const STORAGE_DIR = process.env.STORAGE_DIR || path.join(process.cwd(), 'storage');
const VIDEOS_DIR = path.join(STORAGE_DIR, 'videos');

// Ensure storage directories exist
async function ensureDirectoryExists(dirPath) {
  try {
    await mkdir(dirPath, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

/**
 * Handles POST requests to upload video files
 * @route POST /api/storage/upload/video
 */
export async function POST(request) {
  try {
    // Ensure required directories exist
    await ensureDirectoryExists(VIDEOS_DIR);
    
    // Process the FormData
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided. Please include a file in your request.' },
        { status: 400 }
      );
    }

    // Check if file is a video
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only MP4, WebM, and OGG videos are allowed.' },
        { status: 400 }
      );
    }

    // Get file data
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = path.join(VIDEOS_DIR, fileName);
    
    // Save the file
    await writeFile(filePath, buffer);

    // Generate and save video thumbnail (optional feature)
    // This would require additional packages like ffmpeg

    // Return success response with file details
    return NextResponse.json(
      { 
        id: fileName,
        name: file.name,
        size: buffer.length,
        type: file.type,
        url: `/api/storage/stream/${fileName}`
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error uploading video:', error);
    return NextResponse.json(
      { error: 'Failed to upload video. Please try again.' },
      { status: 500 }
    );
  }
}
