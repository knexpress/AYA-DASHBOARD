// src/app/response-editor/components/EditResponseDialog.tsx
"use client";

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
// Update the import path below if your dialog components are located elsewhere
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from 'C:\\Users\\User\\Downloads\\src\\components\\ui\\dialog';
import {Dialog,DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose} from "../../../components/ui/dialog"
import { Button } from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import type { TrainingDataItem } from '../../../types';

const formSchema = z.object({
  ayaResponse: z.string().min(1, "AYA's response cannot be empty."), 
  correctedResponse: z.string().optional(),
  grade: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? null : Number(val)),
    z.number().min(1).max(5).nullable()
  ),
  adminRemarks: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface EditResponseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  item: TrainingDataItem;
  onSave: (updatedItem: TrainingDataItem) => void; // Parent handles actual save
}

export function EditResponseDialog({ isOpen, onClose, item, onSave }: EditResponseDialogProps) {
  const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ayaResponse: item.ayaResponse,
      correctedResponse: item.correctedResponse || '',
      grade: item.grade,
      adminRemarks: item.adminRemarks || '',
    },
  });

  useEffect(() => {
    if (item) {
      reset({
        ayaResponse: item.ayaResponse,
        correctedResponse: item.correctedResponse || '',
        grade: item.grade,
        adminRemarks: item.adminRemarks || '',
      });
    }
  }, [item, reset]);

  const processSubmit = async (data: FormData) => {
    const updatedItem: TrainingDataItem = {
      ...item, 
      // ayaResponse is from item, not data, as it's read-only in the form
      correctedResponse: data.correctedResponse || null,
      grade: data.grade === null ? null : Number(data.grade),
      adminRemarks: data.adminRemarks || null,
      timestamp: new Date().toISOString(), // Update timestamp on edit
    };
    
    onSave(updatedItem); // Call parent's save handler
    // onClose will be called by parent after successful save
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline">Edit AI Response</DialogTitle>
          <DialogDescription>Review the AI's original response, provide a corrected version, grade it, and add remarks. Changes will be saved persistently.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(processSubmit)} className="space-y-4 py-2">
          <div>
            <Label className="font-semibold">User Message:</Label>
            <p className="text-sm text-muted-foreground p-2 border rounded-md bg-stone-50">{item.userMessage}</p>
          </div>

          <div>
            <Label htmlFor="ayaResponse">Original AYA's Response (Read-only)</Label>
            <Controller
              name="ayaResponse"
              control={control}
              render={({ field }) => <Textarea id="ayaResponse" {...field} rows={3} readOnly className="bg-muted/50 cursor-default" />}
            />
          </div>

          <div>
            <Label htmlFor="correctedResponse">Corrected Response (Enter edits here)</Label>
            <Controller
              name="correctedResponse"
              control={control}
              render={({ field }) => <Textarea id="correctedResponse" {...field} rows={3} placeholder="Enter the ideal response..."/>}
            />
          </div>
          
          <div>
            <Label>Grade (1-5)</Label>
            <Controller
              name="grade"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  onValueChange={(value) => field.onChange(value === "" ? null : Number(value))}
                  value={field.value !== null ? String(field.value) : ""}
                  className="flex space-x-2 mt-1"
                >
                  {[1, 2, 3, 4, 5].map(value => (
                    <div key={value} className="flex items-center space-x-1">
                      <RadioGroupItem value={String(value)} id={`grade-${value}`} />
                      <Label htmlFor={`grade-${value}`}>{value}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
            {errors.grade && <p className="text-sm text-destructive mt-1">{errors.grade.message}</p>}
          </div>

          <div>
            <Label htmlFor="adminRemarks">Admin Remarks (Optional)</Label>
            <Controller
              name="adminRemarks"
              control={control}
              render={({ field }) => <Textarea id="adminRemarks" {...field} rows={3} placeholder="Add any notes or comments..." />}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}