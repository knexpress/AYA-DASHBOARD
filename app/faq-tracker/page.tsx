"use client"; // Convert to Client Component

import React, { useEffect, useState } from "react"; // Import hooks
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
import { Loader2 } from "lucide-react"; // Import loader
import type { LoggedQuestionItem } from "../../types"; // Keep your type definition
// Removed format import as backend data doesn't have lastAsked in this format
// import { format } from 'date-fns';
// Removed local action import
// import { getLoggedQuestions } from '../../app/actions/loggedQuestionsActions';

// Define the type for the data structure returned by your backend
// It's an object where keys are strings and values are either numbers or objects with count and sessions
interface BackendFAQData {
  [key: string]: number | { count: number; sessions: string[] };
}

// Define the structure we'll use for displaying in the table
interface FAQDisplayItem {
  id: string; // Using the question as a unique id for the key prop
  question: string;
  frequency: number;
  // lastAsked is not available in the backend data structure you provided,
  // so we'll omit it or find another way to get it if needed from a different endpoint.
  // lastAsked: string;
}

export default function FAQsPage() {
  const [faqData, setFaqData] = useState<FAQDisplayItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // **Define your ngrok backend base URL**
  const BACKEND_BASE_URL =
    "https://fbbe-2001-8f8-1539-4bbc-d4a9-b7e6-97e0-d542.ngrok-free.app"; // **VERIFY THIS URL**

  const fetchFaqData = async () => {
    try {
      setLoading(true);
      // **Make a POST request to your dashboard's API route for FAQ data**
      const response = await fetch("/api/data/faqs", {
        method: "POST", // Use POST method
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          backendUrl: BACKEND_BASE_URL, // Send backend URL
          endpoint: "/logs/faq_counts", // Backend endpoint for FAQ counts
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error fetching FAQ data: ${response.status} - ${
            errorData.message || response.statusText
          }`
        );
      }

      // The response from your dashboard's API route is the JSON object from your backend
      const backendResponse: BackendFAQData = await response.json();

      // Process the backend data into an array suitable for the table
      const processedFaqData: FAQDisplayItem[] = Object.keys(
        backendResponse
      ).map((question) => {
        const value = backendResponse[question];
        let frequency: number;

        if (typeof value === "number") {
          frequency = value;
        } else if (typeof value === "object" && value !== null && "count" in value) {
          frequency = value.count;
        } else {
           frequency = 0; // Default to 0 if the structure is unexpected
        }

        return {
          id: question, // Use the question as the id
          question: question,
          frequency: frequency,
          // lastAsked is not available in this data
        };
      });

      // Sort the processed data by frequency in descending order
      processedFaqData.sort((a, b) => b.frequency - a.frequency);

      setFaqData(processedFaqData); // Set the state with the processed array
    } catch (err: any) {
      console.error("Failed to fetch FAQ data:", err);
      setError(`Failed to load FAQ data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqData(); // Fetch data when the component mounts
  }, []); // Empty dependency array means this effect runs only once on mount

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading FAQs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-destructive">
        Error: {error}
      </div>
    );
  }

  // Check if faqData is null or an empty array
  if (!faqData || faqData.length === 0) {
    return (
      <div className="space-y-6">
         <PageHeader title="Frequently Asked Questions (FAQs)" description="List of commonly asked questions by users, sorted by frequency." />
         <Card>
           <CardHeader>
             <CardTitle className="font-headline">Logged FAQs</CardTitle>
             <CardDescription>User questions logged and tracked for frequency.</CardDescription>
           </CardHeader>
           <CardContent>
              <div className="flex items-center justify-center h-24">
                 No FAQs logged yet.
              </div>
           </CardContent>
         </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Frequently Asked Questions (FAQs)"
        description="List of commonly asked questions by users, sorted by frequency."
      />
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Logged FAQs</CardTitle>
          <CardDescription>
            User questions logged and tracked for frequency.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60%]">Question</TableHead>
                  <TableHead className="text-center">Frequency</TableHead>
                  {/* Removed Last Asked header as it's not in the data */}
                  {/* <TableHead className="text-right">Last Asked</TableHead> */}
                </TableRow>
              </TableHeader>
              <TableBody>
                {faqData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      {item.question}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.frequency}
                    </TableCell>
                    {/* Removed Last Asked cell */}
                    {/* <TableCell className="text-right">{format(new Date(item.lastAsked), 'MMM d, yyyy HH:mm')}</TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
