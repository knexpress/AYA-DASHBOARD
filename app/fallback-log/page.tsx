// src/app/fallback-log/page.tsx
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { PageHeader } from "../../components/shared/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
// Import the new data type
import { type UnansweredQuestionsData } from "../../types";
// Assuming getUnansweredQuestions now fetches data in the new format
import { getUnansweredQuestions } from "../actions/unansweredQuestionsActions";

// Define the type for the items to be displayed in the table
interface DisplayItem {
  question: string;
  count: number;
  sessions: string; // Display sessions as a comma-separated string
}

export default async function UnansweredQuestionsLogPage() {
  // Fetch data in the new format
  const unansweredQuestionsData: UnansweredQuestionsData = await getUnansweredQuestions();

  // Transform the data for display in the table
  const displayItems: DisplayItem[] = Object.entries(unansweredQuestionsData).map(([question, data]) => ({
    question,
    count: data.count,
    sessions: data.sessions.join(", "), // Join session IDs for display
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="Unanswered Questions Log" description="Log of questions that the AI could not answer." />
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Unanswered User Questions</CardTitle>
          <CardDescription>Detailed log of user messages that the AI could not answer, with counts and session IDs.</CardDescription>
        </CardHeader> {/* Move CardContent outside CardHeader */}
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Question</TableHead>
                  <TableHead className="w-[10%]">Count</TableHead>
                  <TableHead>Sessions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayItems.map((item, index) => (
                  <TableRow key={index}> {/* Using index as key if no unique ID is available in the new data */}
                    <TableCell className="font-medium">{item.question}</TableCell>
                    <TableCell>{item.count}</TableCell>
                    <TableCell>{item.sessions}</TableCell>
                  </TableRow>
                ))}
                {displayItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center h-24">No unanswered questions logged yet.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
