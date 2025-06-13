"use client";

import type { NextPage } from "next";
import { PageHeader } from "../../components/shared/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import { useToast } from "../../hooks/use-toast";
import { RefreshCcw } from "lucide-react";
import type { TrainingDataItem } from "../../types";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React, { useEffect, useState } from "react";
import { placeholderUnassessedItem } from "../../constants/placeholders";

const formSchema = z.object({
  grade: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z.number().min(1, "Grade must be between 1 and 5.").max(5, "Grade must be between 1 and 5.").nullable()
  ).refine(val => val !== null, { message: "Grade is required." }),
  adminRemarks: z.string().optional(),
  correctedResponse: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const ResponseGraderPage: NextPage = () => {
  const { toast } = useToast();
  const [currentItem, setCurrentItem] = useState<TrainingDataItem>(placeholderUnassessedItem);
  
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grade: currentItem.grade,
      adminRemarks: currentItem.adminRemarks || '',
      correctedResponse: currentItem.correctedResponse || '',
    },
  });

  useEffect(() => {
    reset({
      grade: currentItem.grade,
      adminRemarks: currentItem.adminRemarks || '',
      correctedResponse: currentItem.correctedResponse || '',
    });
  }, [currentItem, reset]);

  const onSubmit = async (data: FormData) => {
    const gradedItem: TrainingDataItem = {
      ...currentItem,
      grade: data.grade, // Zod schema ensures grade is not null here due to refine
      adminRemarks: data.adminRemarks || null,
      correctedResponse: data.correctedResponse || null,
      timestamp: new Date().toISOString(), // Update timestamp on grading
    };

    console.log("Grading submitted:", gradedItem);
    try {
      await saveGradedResponse(gradedItem);
      toast({
        title: "Grade Submitted & Saved",
        description: `Response for "${currentItem.userMessage.substring(0,30)}..." has been graded and saved.`,
      });
      // Fetch next item or clear form
      setCurrentItem({ ...placeholderUnassessedItem, id: `ua${Date.now()}` }); // Simulate new item
    } catch (error) {
      console.error("Failed to save graded response:", error);
      toast({
        title: "Error",
        description: "Failed to save the graded response. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchNextItem = () => {
    // Simulate fetching a new item
    toast({ title: "Loading next item...", description: "This is a mock action."});
    setCurrentItem({ ...placeholderUnassessedItem, id: `ua${Date.now()}`, userMessage: "What is your policy on damaged goods received at port?" });
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Response Grader" 
        description="Grade AI responses to help train the model."
        actions={
          <Button variant="outline" onClick={fetchNextItem} disabled={isSubmitting}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Load Next Item
          </Button>
        }
      />
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Current Item for Grading</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="font-semibold text-sm">User Message:</Label>
            <p className="text-sm p-3 border rounded-md bg-muted mt-1 whitespace-pre-wrap">{currentItem.userMessage}</p>
          </div>
          <div>
            <Label className="font-semibold text-sm">AYA's Response:</Label>
            <p className="text-sm p-3 border rounded-md bg-muted mt-1 whitespace-pre-wrap">{currentItem.ayaResponse}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Grading Form</CardTitle>
          <CardDescription>Provide your assessment and corrections below.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label className="font-semibold block mb-2">Grade (1-5 Stars)</Label>
              <Controller
                name="grade"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value !== null ? String(field.value) : ""}
                    className="flex items-center space-x-2 sm:space-x-4"
                  >
                    {[1, 2, 3, 4, 5].map(value => (
                      <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem value={String(value)} id={`grade-${value}-grader`} />
                        <Label htmlFor={`grade-${value}-grader`} className="text-sm cursor-pointer">{value}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}
              />
              {errors.grade && <p className="text-sm text-destructive mt-1">{errors.grade.message}</p>}
            </div>

            <div>
              <Label htmlFor="adminRemarks-grader" className="font-semibold">Admin Remarks (Optional)</Label>
              <Controller
                name="adminRemarks"
                control={control}
                render={({ field }) => <Textarea id="adminRemarks-grader" {...field} rows={3} className="mt-1" placeholder="Observations, suggestions for improvement..." />}
              />
            </div>

            <div>
              <Label htmlFor="correctedResponse-grader" className="font-semibold">Corrected Response (Optional)</Label>
              <Controller
                name="correctedResponse"
                control={control}
                render={({ field }) => <Textarea id="correctedResponse-grader" {...field} rows={4} className="mt-1" placeholder="The ideal response AYA should have given..."/>}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Grade & Save"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResponseGraderPage;

function saveGradedResponse(gradedItem: TrainingDataItem) {
  throw new Error("Function not implemented.");
}
