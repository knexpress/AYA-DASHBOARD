"use server";

import fs from "fs/promises";
import path from "path";
import type { ConversationLogsItem } from "../../types";

const dataFilePath = path.join(
  process.cwd(),
  "src",
  "data",
  "conversation_logs.jsonl"
);
const dataDir = path.dirname(dataFilePath);

async function ensureDataFileExists(): Promise<ConversationLogsItem[]> {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    const fileContent = await fs.readFile(dataFilePath, "utf-8");
    if (fileContent.trim() === "") {
      return [];
    }
    // return JSON.parse(fileContent) as ConversationLogsItem[];
    return fileContent
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as ConversationLogsItem);
  } catch (error: any) {
    if (error.code === "ENOENT") {
      await fs.writeFile(dataFilePath, JSON.stringify([], null, 2), "utf-8");
      return [];
    } else if (error instanceof SyntaxError) {
      console.warn(
        `Warning: ${dataFilePath} was not valid JSON. Initializing with empty array. Error: ${error.message}`
      );
      await fs.writeFile(dataFilePath, JSON.stringify([], null, 2), "utf-8");
      return [];
    }
    console.error(`Error reading or creating ${dataFilePath}:`, error);
    throw new Error("Could not initialize inquiries data.");
  }
}

export async function saveConversationLogs(
  itemToSave: ConversationLogsItem
): Promise<void> {
  // TODO
}

export async function getCoversationLogs(): Promise<ConversationLogsItem[]> {
  try {
    const conversationLogs = await ensureDataFileExists();

    return conversationLogs;
  } catch (error) {
    console.log("Failed to get conversation logs:", error);

    return [];
  }
}
