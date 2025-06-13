"use client";
import type { TrainingDataItem } from '../../../types';
import { format } from 'date-fns';
import { FilePenLine, Star } from 'lucide-react';
import React, { useState } from 'react';
import { EditResponseDialog } from './EditResponseDialog';
import { Button } from '../../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { useToast } from '../../../hooks/use-toast';
import { saveGradedResponse } from '../../../app/actions/gradedResponsesActions';
interface ResponseEditorClientContentProps {
  initialTrainingData: TrainingDataItem[];
}

export function ResponseEditorClientContent({ initialTrainingData }: ResponseEditorClientContentProps) {
  const [editingItem, setEditingItem] = useState<TrainingDataItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [trainingData, setTrainingData] = useState<TrainingDataItem[]>(initialTrainingData);
  const { toast } = useToast();

  const handleEdit = (item: TrainingDataItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDialogSave = async (updatedItem: TrainingDataItem) => {
    try {
      await saveGradedResponse(updatedItem); // This now calls the server action directly
      setTrainingData(prevData =>
        prevData.map(item => item.id === updatedItem.id ? updatedItem : item)
      );
      toast({ title: "Success", description: "Response updated and saved successfully." });
      setIsDialogOpen(false);
      setEditingItem(null);
    } catch (error) {
        console.error("Failed to save edited response:", error);
        toast({
            title: "Error",
            description: "Failed to save the edited response. Please try again.",
            variant: "destructive",
        });
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%]">User Message</TableHead>
              <TableHead className="w-[20%]">AYA's Response</TableHead>
              <TableHead className="w-[20%]">Corrected Response</TableHead>
              <TableHead className="text-center">Grade</TableHead>
              <TableHead>Admin Remarks</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trainingData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium truncate max-w-xs">{item.userMessage}</TableCell>
                <TableCell className="truncate max-w-xs">{item.ayaResponse}</TableCell>
                <TableCell className="truncate max-w-xs">{item.correctedResponse || 'N/A'}</TableCell>
                <TableCell className="text-center">
                  {item.grade !== null ? (
                    <span className="flex items-center justify-center">
                      {item.grade} <Star className="w-3 h-3 ml-1 text-yellow-400 fill-yellow-400" />
                    </span>
                  ) : 'N/A'}
                </TableCell>
                <TableCell className="truncate max-w-xs">{item.adminRemarks || 'N/A'}</TableCell>
                <TableCell>{format(new Date(item.timestamp), 'MMM d, yy HH:mm')}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                    <FilePenLine className="w-4 h-4 mr-2" /> Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {trainingData.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">No training data available.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {editingItem && (
        <EditResponseDialog
          isOpen={isDialogOpen}
          onClose={handleDialogClose}
          item={editingItem}
          onSave={handleDialogSave} // This is the prop EditResponseDialog will call
        />
      )}
    </>
  );
}


