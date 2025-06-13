
'use server';

import fs from 'fs/promises';
import path from 'path';
import type { InquiryItem } from '../../types';

const dataFilePath = path.join(process.cwd(),'src', 'data', 'all_inquiries.json');
const dataDir = path.dirname(dataFilePath);

async function ensureDataFileExists(): Promise<InquiryItem[]> {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    // Handle cases where file might be empty string causing JSON.parse to fail
    if (fileContent.trim() === '') {
      return [];
    }
    return JSON.parse(fileContent) as InquiryItem[];
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(dataFilePath, JSON.stringify([], null, 2), 'utf-8');
      return [];
    } else if (error instanceof SyntaxError) {
      console.warn(`Warning: ${dataFilePath} was not valid JSON. Initializing with empty array. Error: ${error.message}`);
      await fs.writeFile(dataFilePath, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    console.error(`Error reading or creating ${dataFilePath}:`, error);
    throw new Error('Could not initialize inquiries data.');
  }
}

export async function saveInquiry(itemToSave: InquiryItem): Promise<void> {
  console.log('Attempting to save inquiry. File path:', dataFilePath);
  try {
    let inquiries = await ensureDataFileExists();
    inquiries.push(itemToSave);
    // Sort by timestamp descending before saving
    inquiries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    await fs.writeFile(dataFilePath, JSON.stringify(inquiries, null, 2), 'utf-8');
    console.log('Inquiry saved successfully:', itemToSave.id);
  } catch (error) {
    console.error('Failed to save inquiry:', error);
    throw new Error('Failed to save inquiry.');
  }
}

export async function getAllInquiries(): Promise<InquiryItem[]> {
  try {
    const inquiries = await ensureDataFileExists();
    return inquiries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error('Failed to get inquiries:', error);
    return [];
  }
}