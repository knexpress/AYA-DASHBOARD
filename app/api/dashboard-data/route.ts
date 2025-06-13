import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import type {
  InquiryItem,
  LoggedQuestionItem,
  TrainingDataItem,
  ChartDataPoint,
  FallbackItem,
  ConversationLogsItem,
} from "../../../types";
import { getCoversationLogs } from "../../actions/conversationLogsAction";
// Removed date-fns imports

// Define paths to your JSON data files
const inquiriesFilePath = path.join(
  process.cwd(),
  "src",
  "data",
  "all_inquiries.json"
);
const loggedQuestionsFilePath = path.join(
  process.cwd(),
  "src",
  "data",
  "logged_questions.json"
);
const gradedResponsesFilePath = path.join(
  process.cwd(),
  "src",
  "data",
  "graded_responses.json"
);
const unansweredQuestionsFilePath = path.join(
  process.cwd(),
  "src",
  "data",
  "unanswered_questions.json"
); // Path for unanswered questions
const fallbackLogFilePath = path.join(
  process.cwd(),
  // "src",
  "data",
  "fallback_log.json"
); // Assuming you have a fallback log file
const conversationLogFilePath = path.join(
  process.cwd(),
  // "src",
  "data",
  "conversation_logs.jsonl"
);

/*
  Reads standard Json file
*/
async function readJsonFile<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    if (fileContent.trim() === "") {
      return defaultValue;
    }
    return JSON.parse(fileContent) as T;
  } catch (error: any) {
    if (error.code === "ENOENT") {
      console.warn(`Warning: ${filePath} not found. Returning default value.`);
      return defaultValue;
    } else if (error instanceof SyntaxError) {
      console.warn(
        `Warning: ${filePath} was not valid JSON. Returning default value. Error: ${error.message}`
      );
      return defaultValue;
    }
    console.error(`Error reading ${filePath}:`, error);
    throw error; // Re-throw to be caught by the main error handler
  }
}

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

// Helper function to get the start of the week for a given date
function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 for Sunday, 6 for Saturday
  const diff = d.getDate() - day; // Adjust date to get the start of the week (Sunday)
  d.setDate(diff);
  d.setHours(0, 0, 0, 0); // Set time to the beginning of the day
  return d;
}

// Helper function to format a date as "MMM dd"
function formatMonthDay(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  return date.toLocaleDateString(undefined, options);
}

export async function GET() {
  try {
    // Read data from JSON files
    const allInquiries = await readJsonFile<InquiryItem[]>(
      inquiriesFilePath,
      []
    );
    const loggedQuestions = await readJsonFile<LoggedQuestionItem[]>(
      loggedQuestionsFilePath,
      []
    );
    const gradedResponses = await readJsonFile<TrainingDataItem[]>(
      gradedResponsesFilePath,
      []
    );
    const unansweredQuestions = await readJsonFile<FallbackItem[]>(
      unansweredQuestionsFilePath,
      []
    ); // Read unanswered questions
    // Assuming you have a fallback log file, read it as well for unanswered questions if they are logged there
    const fallbackLog = await readJsonFile<FallbackItem[]>(
      fallbackLogFilePath,
      []
    );
    // Assuming you have a conversation log file, read it
    const conversationLog = await readJsonlFile<ConversationLogsItem[]>(
      conversationLogFilePath,
      []
    );

    // Analyze and aggregate data

    // Dashboard Stats
    const totalInquiries = allInquiries.length;
    const faqsTracked = loggedQuestions.length;
    const unansweredQuestionsCount = unansweredQuestions.length;
    const responsesGradedCount = gradedResponses.filter(
      (item) => item.grade !== null && item.grade !== undefined
    ).length;
    const conversationLogCount = conversationLog.length;

    // Inquiry Trend Data (e.g., weekly trends)
    const inquiryTrendData: ChartDataPoint[] = [];

    if (allInquiries.length > 0) {
      // Sort inquiries by timestamp
      const sortedInquiries = [...allInquiries].sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      );

      const inquiryCountsByWeek: { [key: string]: number } = {};
      const seenWeekStarts: { [key: string]: Date } = {}; // To keep track of unique week start dates

      sortedInquiries.forEach((inquiry) => {
        const inquiryDate = new Date(inquiry.timestamp);
        const weekStart = getStartOfWeek(inquiryDate);
        const weekKey = weekStart.toISOString().split("T")[0]; // Use ISO date string as key (e.g., "YYYY-MM-DD")
        inquiryCountsByWeek[weekKey] = (inquiryCountsByWeek[weekKey] || 0) + 1;
        seenWeekStarts[weekKey] = weekStart;
      });

      // Get all unique week start dates and sort them
      const sortedWeekStarts = Object.values(seenWeekStarts).sort(
        (a, b) => a.getTime() - b.getTime()
      );

      // Populate the chart data
      sortedWeekStarts.forEach((weekStart) => {
        const weekKey = weekStart.toISOString().split("T")[0];
        const chartLabel = formatMonthDay(weekStart); // Format for display
        inquiryTrendData.push({
          name: chartLabel,
          value: inquiryCountsByWeek[weekKey] || 0,
        });
      });
    }

    // Return the analyzed data
    return NextResponse.json({
      stats: {
        totalInquiries,
        faqsTracked,
        unansweredQuestions: unansweredQuestionsCount,
        responsesGraded: responsesGradedCount,
        totalConversations: conversationLogCount,
      },
      inquiryTrendData,
    });
  } catch (error) {
    console.error("API Error /api/dashboard-data:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch dashboard data",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
