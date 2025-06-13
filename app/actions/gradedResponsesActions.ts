
'use server';

import fs from 'fs/promises';
import path from 'path';
import type { TrainingDataItem } from '../../types';

const dataFilePath = path.join(process.cwd(), 'data', 'graded_responses.json');
const dataDir = path.dirname(dataFilePath);

async function ensureDataFileExists(): Promise<TrainingDataItem[]> {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    // Handle cases where file might be empty string causing JSON.parse to fail
    if (fileContent.trim() === '') {
      return [];
    }
    return JSON.parse(fileContent) as TrainingDataItem[];
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
    throw new Error('Could not initialize graded responses data.');
  }
}

export async function saveGradedResponse(itemToSave: TrainingDataItem): Promise<void> {
  console.log('Attempting to save graded response. File path:', dataFilePath);
  try {
    let gradedResponses = await ensureDataFileExists();

    const existingItemIndex = gradedResponses.findIndex(item => item.id === itemToSave.id);

    if (existingItemIndex > -1) {
      gradedResponses[existingItemIndex] = itemToSave;
    } else {
      gradedResponses.push(itemToSave);
    }
    // Items are typically sorted by timestamp in the UI or when fetched if needed
    await fs.writeFile(dataFilePath, JSON.stringify(gradedResponses, null, 2), 'utf-8');
    console.log('Graded response saved successfully:', itemToSave.id);
  } catch (error) {
    console.error('Failed to save graded response:', error);
    throw new Error('Failed to save graded response.');
  }
}

export async function getGradedResponses(): Promise<TrainingDataItem[]> {
  try {
    const gradedResponses = await ensureDataFileExists();
    // Sort by timestamp descending to show newest first, common for logs/editable lists
    return gradedResponses.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (error) {
    console.error('Failed to get graded responses:', error);
    return [];
  }
}