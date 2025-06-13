import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import type { ConversationLogsItem } from "../../../types";
import { any } from "zod";

// Define the local file path for conversation logs
const conversationLogFilePath = path.join(
  process.cwd(),
  "data",
  "conversation_logs.jsonl"
);

/*
  Reads JsonL file
*/
async function readJsonlFile<T>(
  filePath: string,
  defaultValue: T[]
): Promise<T[]> {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    if (fileContent.trim() === "") {
      return defaultValue;
    }

    return fileContent
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as T);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      console.warn(`Warning: ${filePath} not found. Returning default value.`);
      return defaultValue;
    } else if (error instanceof SyntaxError) {
      console.warn(
        `Warning: ${filePath} was not valid JSON lines. Returning default value. Error: ${error.message}`
      );
      return defaultValue;
    }
    console.error(`Error reading ${filePath}:`, error);
    throw error;
  }
}

// Keep the GET method as is, reading from the local file
export async function GET() {
  try {
    // This GET method reads from the local file.
    const conversationLog = await readJsonlFile<ConversationLogsItem[]>(
      conversationLogFilePath,
      []
    );

    // Return the conversation data
    return NextResponse.json({
      conversationLog,
    });
  } catch (error) {
    console.error("API Error /api/conversations:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch conversations data",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

// New POST function to fetch data from backend and return it for dashboard display
export async function POST(request: Request) {
  try {
    const { backendUrl, endpoint } = await request.json();

    if (!backendUrl || !endpoint) {
      return NextResponse.json(
        { message: "Missing backendUrl or endpoint in request body" },
        { status: 400 }
      );
    }

    const urlToFetch = `${backendUrl}${endpoint}`;

    // Fetch data from the specified backend endpoint
    const response = await fetch(urlToFetch);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Backend error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    // Parse the JSON response from the backend
    const backendData = await response.json();

    // Return the data received from the backend.
    // The frontend dashboard component will receive this data and display it.
    return NextResponse.json(backendData);
  } catch (error) {
    console.error("API Error in POST /api/conversations:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch data from backend",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
