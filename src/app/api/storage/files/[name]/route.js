import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { unlink, access } from 'fs/promises';

// Storage directory configuration
const STORAGE_DIR = process.env.STORAGE_DIR || path.join(process.cwd(), 'storage');
const IMAGES_DIR = path.join(STORAGE_DIR, 'images');
const VIDEOS_DIR = path.join(STORAGE_DIR, 'videos');

/**
 * Handles DELETE requests to remove a file by name
 * @route DELETE /api/storage/files/{name}
 */
export async function DELETE(request, { params }) {
  try {
    const { name } = params;
    
    if (!name) {
      return NextResponse.json(
        { error: 'File name is required' },
        { status: 400 }
      );
    }

    // Prevent directory traversal attack
    const sanitizedName = path.basename(name);
    
    // Determine file type from extension and choose appropriate directory
    const fileExtension = sanitizedName.split('.').pop().toLowerCase();
    const isVideo = ['mp4', 'webm', 'ogg'].includes(fileExtension);
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension);
    
    let filePath;
    if (isVideo) {
      filePath = path.join(VIDEOS_DIR, sanitizedName);
    } else if (isImage) {
      filePath = path.join(IMAGES_DIR, sanitizedName);
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
    
    // Delete the file
    await unlink(filePath);
    
    return NextResponse.json(
      { message: 'File deleted successfully' },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}
