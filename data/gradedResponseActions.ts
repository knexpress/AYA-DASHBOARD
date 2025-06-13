
'use server';

import fs from 'fs/promises';
import path from 'path';
import type { TrainingDataItem } from '../types';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'graded_responses.json');
const dataDir = path.dirname(dataFilePath);

async function ensureDataFileExists(): Promise<TrainingDataItem[]> {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent) as TrainingDataItem[];
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, create it with an empty array
      await fs.writeFile(dataFilePath, JSON.stringify([], null, 2), 'utf-8');
      return [];
    } else if (error instanceof SyntaxError) {
      // File content is not valid JSON, overwrite with empty array (or handle error differently)
      console.warn('graded_responses.json was not valid JSON. Initializing with empty array.');
      await fs.writeFile(dataFilePath, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    console.error('Error reading or creating graded_responses.json:', error);
    throw new Error('Could not initialize graded responses data.');
  }
}

export async function saveGradedResponse(itemToSave: TrainingDataItem): Promise<void> {
  try {
    let gradedResponses = await ensureDataFileExists();

    const existingItemIndex = gradedResponses.findIndex(item => item.id === itemToSave.id);

    if (existingItemIndex > -1) {
      // Update existing item
      gradedResponses[existingItemIndex] = itemToSave;
    } else {
      // Append new item
      gradedResponses.push(itemToSave);
    }

    await fs.writeFile(dataFilePath, JSON.stringify(gradedResponses, null, 2), 'utf-8');
    console.log('Graded response saved:', itemToSave.id);
  } catch (error) {
    console.error('Failed to save graded response:', error);
    // Optionally, re-throw or handle as per application's error strategy
    throw new Error('Failed to save graded response.');
  }
}

export async function getGradedResponses(): Promise<TrainingDataItem[]> {
  try {
    const gradedResponses = await ensureDataFileExists();
    return gradedResponses;
  } catch (error) {
    console.error('Failed to get graded responses:', error);
    return [];
  }
}
