
'use server';

import fs from 'fs/promises';
import path from 'path';
import type { LoggedQuestionItem } from '../../types';
import { placeholderLoggedQuestions } from '../../constants/placeholders';

const dataFilePath = path.join(process.cwd(), 'data', 'logged_questions.json');
const dataDir = path.dirname(dataFilePath);

async function ensureDataFileExists(): Promise<LoggedQuestionItem[]> {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    // Handle cases where file might be empty string causing JSON.parse to fail
    if (fileContent.trim() === '') {
      // If file is truly empty (not even '[]'), initialize with placeholders
      console.warn(`${dataFilePath} was empty. Initializing with placeholder data.`);
      await fs.writeFile(dataFilePath, JSON.stringify(placeholderLoggedQuestions, null, 2), 'utf-8');
      return placeholderLoggedQuestions;
    }
    const jsonData = JSON.parse(fileContent) as LoggedQuestionItem[];
    // If file contained valid JSON (e.g. '[]' or actual data)
    if (Array.isArray(jsonData) && jsonData.length === 0 && placeholderLoggedQuestions.length > 0) {
      // If it's an empty array '[]' and placeholders exist, populate it.
      // This ensures that if a user manually clears the file to [], it gets repopulated with defaults.
      // If this behavior is not desired (i.e., '[]' should be respected as empty), this block can be removed.
      console.warn(`${dataFilePath} contained an empty array []. Initializing with placeholder data.`);
      await fs.writeFile(dataFilePath, JSON.stringify(placeholderLoggedQuestions, null, 2), 'utf-8');
      return placeholderLoggedQuestions;
    }
    return jsonData;
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.warn(`${dataFilePath} not found. Creating with placeholder data.`);
      await fs.writeFile(dataFilePath, JSON.stringify(placeholderLoggedQuestions, null, 2), 'utf-8');
      return placeholderLoggedQuestions;
    } else if (error instanceof SyntaxError) {
      console.warn(`Warning: ${dataFilePath} was not valid JSON. Initializing with placeholder data. Error: ${error.message}`);
      await fs.writeFile(dataFilePath, JSON.stringify(placeholderLoggedQuestions, null, 2), 'utf-8');
      return placeholderLoggedQuestions;
    }
    console.error(`Error reading or creating ${dataFilePath}:`, error);
    throw new Error('Could not initialize logged questions data.');
  }
}

export async function saveLoggedQuestion(itemToSave: LoggedQuestionItem): Promise<void> {
  // This function is not currently used by any API POST, but is here for completeness
  console.log('Attempting to save logged question. File path:', dataFilePath);
  try {
    let loggedQuestions = await ensureDataFileExists();
    const existingItemIndex = loggedQuestions.findIndex(item => item.id === itemToSave.id);

    if (existingItemIndex > -1) {
      loggedQuestions[existingItemIndex] = itemToSave;
    } else {
      loggedQuestions.push(itemToSave);
    }
    loggedQuestions.sort((a, b) => b.frequency - a.frequency);
    await fs.writeFile(dataFilePath, JSON.stringify(loggedQuestions, null, 2), 'utf-8');
    console.log('Logged question saved successfully:', itemToSave.id);
  } catch (error) {
    console.error('Failed to save logged question:', error);
    throw new Error('Failed to save logged question.');
  }
}

export async function getLoggedQuestions(): Promise<LoggedQuestionItem[]> {
  try {
    const loggedQuestions = await ensureDataFileExists();
    return loggedQuestions.sort((a, b) => b.frequency - a.frequency);
  } catch (error) {
    console.error('Failed to get logged questions:', error);
    // If placeholders are desired on error, return them, otherwise empty array.
    // Consider if placeholderLoggedQuestions should be returned here if ensureDataFileExists fails critically.
    // For now, returning [] on critical failure of get.
    return [];
  }
}