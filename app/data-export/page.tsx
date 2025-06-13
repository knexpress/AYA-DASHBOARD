// src/app/data-export/page.tsx
"use client";
import type { NextPage } from "next";
// import { PageHeader } from 'C:/Users/User/Downloads/src/components/shared/PageHeader';
import { PageHeader } from "../../components/shared/PageHeader";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'C:/Users/User/Downloads/src/components/ui/card';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
// import { Button } from 'C:/Users/User/Downloads/src/components/ui/button';
import { Button } from "../../components/ui/button";
// import { placeholderTrainingData } from 'C:/Users/User/Downloads/src/constants/placeholders';
import { placeholderTrainingData } from "../../constants/placeholders";
// import { exportToJson, exportToCsv } from 'C:/Users/User/Downloads/src/lib/helpers';
import { exportToJson, exportToCsv } from "../../lib/helpers";
import { FileJson, Files, DownloadCloud } from "lucide-react"; // Corrected: FileCsv to Files
// import { useToast } from "C:/Users/User/Downloads/src/hooks/use-toast";
import { useToast } from "../../hooks/use-toast";

const DataExportPage: NextPage = () => {
  const { toast } = useToast();

  const handleExportJson = () => {
    exportToJson(placeholderTrainingData, "aya_rl_training_data");
    toast({
      title: "Exporting JSON",
      description: "Reinforcement Learning data is being downloaded as JSON.",
    });
  };

  const handleExportCsv = () => {
    exportToCsv(placeholderTrainingData, "aya_rl_training_data");
    toast({
      title: "Exporting CSV",
      description: "Reinforcement Learning data is being downloaded as CSV.",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Export"
        description="Download Reinforcement Learning (RL) training data."
      />
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center">
            <DownloadCloud className="w-6 h-6 mr-2 text-primary" />
            Export RL Training Data
          </CardTitle>
          <CardDescription>
            Download the curated dataset of user messages, AI responses, grades,
            and corrected responses for use in training your AI models.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            The dataset includes all admin-reviewed interactions. Choose your
            preferred format below.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleExportJson} className="w-full sm:w-auto">
              <FileJson className="w-4 h-4 mr-2" />
              Export as JSON
            </Button>
            <Button onClick={handleExportCsv} className="w-full sm:w-auto">
              <Files className="w-4 h-4 mr-2" />{" "}
              {/* Corrected: FileCsv to Files */}
              Export as CSV
            </Button>
          </div>
          <p className="text-xs text-muted-foreground pt-2">
            Note: This is a mock export. Data is sourced from placeholders. In a
            real application, this would fetch and format live database records.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataExportPage;
