// src/types/index.ts
// Removed: import { DashboardData } from '../app/DashboardClientContent';
import { timeStamp } from "console";
import React, { useState } from "react"; // This import seems unnecessary in a types file
import * as z from "zod";

export interface FAQItem {
  id: string;
  question: string;
  frequency: number;
  lastAsked: string; // ISO date string
}

export interface UnansweredQuestionsData {
  [question: string]: {
    count: number;
    sessions: string[];
  };
}

// Zod schema for the new unanswered questions data structure
export const UnansweredQuestionsDataSchema = z.record(
  z.string(), // The question as the key
  z.object({
    count: z.number(),
    sessions: z.array(z.string()),
  })
);

export interface LoggedQuestionItem {
  id: string;
  question: string;
  frequency: number;
  lastAsked: string; // ISO date string
}

// For chart data on dashboard
export interface ChartDataPoint {
  name: string;
  value: number;
}

// This FAQItem interface seems duplicated, you might want to clean this up
// export interface FAQItem {
//   id: string;
//   question: string;
//   frequency: number;
//   lastAsked: string;
// }

// This LoggedQuestionItem interface seems duplicated, you might want to clean this up
// export interface LoggedQuestionItem {
//   id: string;
//   question: string;
//   frequency: number;
//   lastAsked: string; // ISO date string
// }

// Zod schema for FallbackItem
export const FallbackItemSchema = z.object({
  id: z.string(),
  userMessage: z.string(),
  fallbackResponse: z.string(),
  timestamp: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Timestamp must be a valid ISO date string",
  }),
  reason: z.string().optional(), // Made reason optional based on common usage
});
export type FallbackItem = z.infer<typeof FallbackItemSchema>;

// Zod schema for TrainingDataItem
export const TrainingDataItemSchema = z.object({
  id: z.string(),
  userMessage: z.string(),
  ayaResponse: z.string(),
  grade: z.number().nullable(),
  adminRemarks: z.string().nullable(),
  correctedResponse: z.string().nullable(),
  timestamp: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Timestamp must be a valid ISO date string",
  }),
});
export type TrainingDataItem = z.infer<typeof TrainingDataItemSchema>;

// Zod schema for InquiryItem
export const InquiryItemSchema = z.object({
  id: z.string(),
  userMessage: z.string(),
  // Add ayaResponse field
  ayaResponse: z.string().optional(), // Assuming ayaResponse might not always be present initially
  timestamp: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Timestamp must be a valid ISO date string",
  }),
  // Add any other fields you want to track for raw inquiries, e.g., source, sessionId
});
export type InquiryItem = z.infer<typeof InquiryItemSchema>;

// Coversation logs schema
export const ConversationLogsSchema = z.object({
  session_id: z.string(),
  timestamp: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Timestamp must be a valid ISO date string",
  }),
  user_input: z.string(),
  intent: z.string(),
  response: z.string(),
  tool_used: z.string().nullable(),
});
export type ConversationLogsItem = z.infer<typeof ConversationLogsSchema>;

// For chart data on dashboard
// This ChartDataPoint interface seems duplicated, you might want to clean this up
// export interface ChartDataPoint {
//   name: string;
//   value: number;
// }

// Define DashboardData interface here
export interface DashboardData {
  stats: {
    totalInquiries: number;
    faqsTracked: number;
    unansweredQuestions: number;
    responsesGraded: number;
    totalConversations: number;
  };
  inquiryTrendData: ChartDataPoint[];
}

// Removed: export { DashboardData };
