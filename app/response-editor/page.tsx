// src/app/response-editor/page.tsx
import { PageHeader } from '../../components/shared/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { getGradedResponses } from '../../app/actions/gradedResponsesActions';
import { ResponseEditorClientContent } from '../response-editor/components/ResponseEditorClientContext'; // Corrected component name

// This is now a Server Component, so it can be async
export default async function ResponseEditorPage() {
  const initialTrainingData = await getGradedResponses();

  return (
    <div className="space-y-6">
      <PageHeader title="Response Editor" description="Review, edit, and grade AI responses for reinforcement learning." />
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Training Data Management</CardTitle>
          <CardDescription>Edit AI responses and provide feedback to improve performance.</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponseEditorClientContent initialTrainingData={initialTrainingData} />
        </CardContent>
      </Card>
    </div>
  );
}
