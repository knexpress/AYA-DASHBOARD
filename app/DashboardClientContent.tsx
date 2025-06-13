// src/app/DashboardClientContent.tsx
"use client";
import React, { useState, useEffect } from "react"; // Import useState and useEffect
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  MessageSquare,
  ListChecks,
  AlertOctagon,
  CheckCircle2,
  Loader2,
} from "lucide-react"; // Added Loader2 for loading indicator
import type { ChartDataPoint } from "../types";
import { useRouter } from "next/navigation";

// Define the type for the data expected from the API endpoint
interface DashboardData {
  stats: {
    totalInquiries: number;
    faqsTracked: number;
    unansweredQuestions: number;
    responsesGraded: number;
    totalConversations: number;
  };
  inquiryTrendData: ChartDataPoint[];
}

// No longer needs props since it fetches its own data
// interface DashboardClientContentProps {
//   stats: DashboardStats;
//   inquiryTrendData: ChartDataPoint[];
// }

export function DashboardClientContent() {
  const router = useRouter();

  const handleConversationClick = () => {
    router.push("/conversations");
  };
  // Removed props
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch data from the API
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/dashboard-data");
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      const data: DashboardData = await response.json();
      setDashboardData(data);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(); // Fetch data when the component mounts

    // Optional: Set up polling for near real-time updates (e.g., every 30 seconds)
    const pollingInterval = setInterval(fetchDashboardData, 30000); // Poll every 30 seconds

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(pollingInterval);
  }, []); // Empty dependency array means this effect runs only once on mount and cleans up on unmount

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading Dashboard Data...</span>
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

  // Render nothing or a message if dashboardData is null after loading (shouldn't happen with current logic)
  if (!dashboardData) {
    return null; // Or a message like "No data available"
  }

  // Destructure data from state for easier access in rendering
  const { stats, inquiryTrendData } = dashboardData;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Conversaton Logs Card */}
        <Card onClick={handleConversationClick} className="cursor-pointer">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Conversations
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* Use stats from state */}
            <div className="text-2xl font-bold">{stats.totalConversations}</div>
            <p className="text-xs text-muted-foreground">
              Conversation with the chatbot
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">FAQs Tracked</CardTitle>
            <ListChecks className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* Use stats from state */}
            <div className="text-2xl font-bold">{stats.faqsTracked}</div>
            <p className="text-xs text-muted-foreground">
              Distinct questions monitored for frequency.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Unanswered Questions
            </CardTitle>
            <AlertOctagon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* Use stats from state */}
            <div className="text-2xl font-bold">
              {stats.unansweredQuestions}
            </div>
            <p className="text-xs text-muted-foreground">
              User questions AI couldn't answer.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Responses Graded
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* Use stats from state */}
            <div className="text-2xl font-bold">{stats.responsesGraded}</div>
            <p className="text-xs text-muted-foreground">For RL training</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Inquiry Trends</CardTitle>
          {/* <CardDescription>Weekly user inquiry volume.</CardDescription> */}
        </CardHeader>
        <CardContent className="h-[350px] p-2">
          <ResponsiveContainer width="100%" height="100%">
            {/* Use inquiryTrendData from state */}
            <BarChart data={inquiryTrendData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar
                dataKey="value"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                name="Inquiries"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
}
