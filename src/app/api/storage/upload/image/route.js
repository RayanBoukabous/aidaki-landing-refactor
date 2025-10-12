import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { mkdir, writeFile } from 'fs/promises';

// Storage directory configuration
const STORAGE_DIR = process.env.STORAGE_DIR || path.join(process.cwd(), 'storage');
const IMAGES_DIR = path.join(STORAGE_DIR, 'images');

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
 * Handles POST requests to upload image files
 * @route POST /api/storage/upload/image
 */
export async function POST(request) {
  try {
    // Ensure required directories exist
    await ensureDirectoryExists(IMAGES_DIR);
    
    // Process the FormData
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided. Please include a file in your request.' },
        { status: 400 }
      );
    }

    // Check if file is an image
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF and WebP images are allowed.' },
        { status: 400 }
      );
    }

    // Get file data
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = path.join(IMAGES_DIR, fileName);
    
    // Save the file
    await writeFile(filePath, buffer);

    // Return success response with file details
    return NextResponse.json(
      { 
        id: fileName,
        name: file.name,
        size: buffer.length,
        type: file.type,
        url: `/api/storage/${fileName}/${file.name}`
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { error: 'Failed to upload image. Please try again.' },
      { status: 500 }
    );
  }
}
