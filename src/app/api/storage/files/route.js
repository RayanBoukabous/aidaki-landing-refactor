import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { readdir, stat } from 'fs/promises';

// Storage directory configuration
const STORAGE_DIR = process.env.STORAGE_DIR || path.join(process.cwd(), 'storage');
const IMAGES_DIR = path.join(STORAGE_DIR, 'images');
const VIDEOS_DIR = path.join(STORAGE_DIR, 'videos');

/**
 * Helper function to get file details
 */
async function getFileDetails(filePath, baseDir, fileType) {
  const stats = await stat(filePath);
  const filename = path.basename(filePath);
  
  return {
    id: filename,
    name: filename,
    size: stats.size,
    type: fileType,
    createdAt: stats.birthtime,
    updatedAt: stats.mtime,
    url: fileType.startsWith('video') 
      ? `/api/storage/stream/${filename}` 
      : `/api/storage/${filename}/${filename}`
  };
}

/**
 * Handles GET requests to list all files
 * @route GET /api/storage/files
 */
export async function GET(request) {
  try {
    // Ensure storage directories exist
    if (!fs.existsSync(IMAGES_DIR)) {
      fs.mkdirSync(IMAGES_DIR, { recursive: true });
    }
    if (!fs.existsSync(VIDEOS_DIR)) {
      fs.mkdirSync(VIDEOS_DIR, { recursive: true });
    }
    
    // Read files from both directories
    const imageFiles = fs.existsSync(IMAGES_DIR) 
      ? await readdir(IMAGES_DIR) 
      : [];
      
    const videoFiles = fs.existsSync(VIDEOS_DIR) 
      ? await readdir(VIDEOS_DIR) 
      : [];
    
    // Process images
    const imageDetails = await Promise.all(
      imageFiles.map(async (filename) => {
        const filePath = path.join(IMAGES_DIR, filename);
        // Determine image type based on extension
        const ext = path.extname(filename).toLowerCase();
        let type = 'image/jpeg'; // Default
        if (ext === '.png') type = 'image/png';
        else if (ext === '.gif') type = 'image/gif';
        else if (ext === '.webp') type = 'image/webp';
        
        return await getFileDetails(filePath, IMAGES_DIR, type);
      })
    );
    
    // Process videos
    const videoDetails = await Promise.all(
      videoFiles.map(async (filename) => {
        const filePath = path.join(VIDEOS_DIR, filename);
        // Determine video type based on extension
        const ext = path.extname(filename).toLowerCase();
        let type = 'video/mp4'; // Default
        if (ext === '.webm') type = 'video/webm';
        else if (ext === '.ogg') type = 'video/ogg';
        
        return await getFileDetails(filePath, VIDEOS_DIR, type);
      })
    );
    
    // Combine and sort by creation date (most recent first)
    const allFiles = [...imageDetails, ...videoDetails]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return NextResponse.json({ files: allFiles }, { status: 200 });
    
  } catch (error) {
    console.error('Error listing files:', error);
    return NextResponse.json(
      { error: 'Failed to list files' },
      { status: 500 }
    );
  }
}
