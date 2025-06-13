import fs from 'fs/promises';
import path from 'path';
// Import the new types
import { UnansweredQuestionsDataSchema, type UnansweredQuestionsData } from '../../../types';

// The data file path is still needed for saving data
const dataFilePath = path.join(process.cwd(), 'data', 'unanswered_questions.json');
const dataDir = path.dirname(dataFilePath);

// Function to ensure the data file exists and read its content
// This function is now primarily used for saving data.
async function ensureDataFileExists(): Promise<UnansweredQuestionsData> {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    if (fileContent.trim() === '') {
      return {};
    }
    const parsedData = JSON.parse(fileContent);
    const validationResult = UnansweredQuestionsDataSchema.safeParse(parsedData);

    if (!validationResult.success) {
        console.warn(`Warning: ${dataFilePath} was not valid JSON based on schema. Initializing with empty object. Errors:`, validationResult.error.flatten());
        await fs.writeFile(dataFilePath, JSON.stringify({}, null, 2), 'utf-8');
        return {};
    }

    const normalizedData: UnansweredQuestionsData = {};
    for (const [key, value] of Object.entries(validationResult.data)) {
      normalizedData[key] = {
        count: value.count ?? 0,
        sessions: value.sessions ?? [],
      };
    }
    return normalizedData;

  } catch (error: any) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(dataFilePath, JSON.stringify({}, null, 2), 'utf-8');
      return {};
    } else if (error instanceof SyntaxError) {
      console.warn(`Warning: ${dataFilePath} was not valid JSON. Initializing with empty object. Error: ${error.message}`);
      await fs.writeFile(dataFilePath, JSON.stringify({}, null, 2), 'utf-8');
      return {};
    }
    console.error(`Error reading or creating ${dataFilePath}:`, error);
    throw new Error('Could not initialize unanswered questions data.');
  }
}

// Function to save an unanswered question
export async function saveUnansweredQuestion(question: string, sessionId: string): Promise<void> {
  console.log('Attempting to save unanswered question. File path:', dataFilePath);
  try {
    let unansweredQuestions = await ensureDataFileExists();

    if (unansweredQuestions[question]) {
      unansweredQuestions[question].count++;
      if (!unansweredQuestions[question].sessions.includes(sessionId)) {
        unansweredQuestions[question].sessions.push(sessionId);
      }
    } else {
      unansweredQuestions[question] = {
        count: 1,
        sessions: [sessionId],
      };
    }

    await fs.writeFile(dataFilePath, JSON.stringify(unansweredQuestions, null, 2), 'utf-8');
    console.log('Unanswered question saved successfully:', question);
  } catch (error) {
    console.error('Failed to save unanswered question:', error);
    throw new Error('Failed to save unanswered question.');
  }
}

// Function to get all unanswered questions from the API endpoint
export async function getUnansweredQuestions(): Promise<UnansweredQuestionsData> {
  console.log('Attempting to get unanswered questions from API endpoint.');
  try {
    // Use the full ngrok URL to fetch data from the backend
    const apiUrl = 'https://fbbe-2001-8f8-1539-4bbc-d4a9-b7e6-97e0-d542.ngrok-free.app/logs/unanswered';
    const response = await fetch(apiUrl);

    if (!response.ok) {
      console.error(`Error fetching data from API: ${response.status} ${response.statusText}`);
      return {}; // Return empty object in case of API error
    }

    const data = await response.json();

    // Validate the fetched data with the schema
    const validationResult = UnansweredQuestionsDataSchema.safeParse(data);
     if (!validationResult.success) {
        console.warn(`Warning: Data from API did not match schema. Errors:`, validationResult.error.flatten());
        return {}; // Return empty object if data is invalid
    }

    // Normalize the data to ensure required properties
    const normalizedData: UnansweredQuestionsData = {};
    for (const [key, value] of Object.entries(validationResult.data)) {
      normalizedData[key] = {
        count: value.count ?? 0,
        sessions: value.sessions ?? [],
      };
    }

    return normalizedData;
  } catch (error) {
    console.error('Failed to get unanswered questions from API:', error);
    return {}; // Return an empty object in case of network or other errors
  }
}