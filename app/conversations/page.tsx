"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "../../components/shared/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"; // Assuming you have these UI components

// Updated interface to match your backend's JSON structure
interface ConversationItem {
  session_id: string;
  timestamp: string;
  message: string; // User input
  classified_intent: string; // Intent
  final_response: string | null; // AI's response (can be null)
  tool_triggered: string | null; // Tool used (can be null)
  tool_params: any; // Tool parameters (adjust 'any' with a more specific type if possible)
  tool_result: any; // Tool result (adjust 'any' with a more specific type if possible)
}

// Interface for the data structure returned by your backend (a direct array of ConversationItem)
// No need for ConversationsData interface if we're just using ConversationItem[] directly

export default function ConversationsPage() {
  // State to hold the fetched conversation data
  const [allConversations, setAllConversations] =
    useState<ConversationItem[] | null>(null);
  // State to hold the data currently being displayed (after filtering)
  const [displayedConversations, setDisplayedConversations] =
    useState<ConversationItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // State for the selected intent filter
  const [selectedIntent, setSelectedIntent] = useState<string>("all"); // 'all' or a specific intent

  // Define your ngrok backend base URL
  const BACKEND_BASE_URL = "https://fbbe-2001-8f8-1539-4bbc-d4a9-b7e6-97e0-d542.ngrok-free.app"; // **VERIFY THIS URL**

  const fetchConversationsData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/conversations", {
        method: "POST", // Use POST method
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          backendUrl: BACKEND_BASE_URL, // Send backend URL
          endpoint: "/logs/debug", // Endpoint for debug logs (adjust if needed for conversations)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error fetching data: ${response.status} - ${errorData.message || response.statusText}`
        );
      }

      const data: ConversationItem[] = await response.json();
      setAllConversations(data); // Store all fetched data
      setDisplayedConversations(data); // Initially display all data
    } catch (err: any) {
      console.error("Failed to fetch conversations data:", err);
      setError(`Failed to load conversations data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data on component mount
  useEffect(() => {
    fetchConversationsData();
  }, []);

  // Effect to filter data when selectedIntent or allConversations changes
  useEffect(() => {
    if (!allConversations) {
      setDisplayedConversations(null);
      return;
    }

    if (selectedIntent === "all") {
      setDisplayedConversations(allConversations);
    } else {
      const filtered = allConversations.filter(
        (conversation) => conversation.classified_intent === selectedIntent
      );
      setDisplayedConversations(filtered);
    }
  }, [selectedIntent, allConversations]);

  // Loading and error states
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading Conversations Data...</span>
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

  // Extract unique intents for the filter dropdown
  const uniqueIntents = [
    "all",
    ...(allConversations
      ? Array.from(
          new Set(
            allConversations.map(
              (conversation) => conversation.classified_intent
            )
          )
        ).filter(Boolean) // Remove null or empty intents
      : []),
  ];

  return (
    <>
      <div className="space-y-6 w-full">
        <PageHeader
          title="Conversations Log"
          description="Log of interactions with the chatbot."
        />

        {/* Summary Card with Total Count and Filter */}
        <Card className="w-[90%]">
          <CardHeader>
            <CardTitle>
              Total Log Entries: {allConversations ? allConversations.length : 0}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-4">
            <span>Filter by Intent:</span>
            <Select
              onValueChange={(value) => setSelectedIntent(value)}
              value={selectedIntent}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Intent" />
              </SelectTrigger>
              <SelectContent>
                {uniqueIntents.map((intent) => (
                  <SelectItem key={intent} value={intent}>
                    {intent === "all" ? "All Intents" : intent}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Display filtered conversations */}
        {!displayedConversations || displayedConversations.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            No conversation data available for selected criteria.
          </div>
        ) : (
          displayedConversations.map((conversation, idx) => (
            <Card key={idx} className="w-[90%]">
              <CardHeader>
                <CardTitle className="font-headline">
                  User: {conversation.message}
                </CardTitle>
                {conversation.final_response && (
                  <CardDescription className="w-[90%] overflow-hidden">
                    AI: {conversation.final_response}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className=" flex justify-between text-sm text-gray-600"> {/* Adjusted text size/color */}
                <span>Intent: {conversation.classified_intent || "N/A"}</span>
                <span>Tool Used: {conversation.tool_triggered || "None"}</span>
                <span>Timestamp: {new Date(conversation.timestamp).toLocaleString()}</span>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </>
  );
}
