// src/app/page.tsx (Dashboard Page)

// import { PageHeader } from 'C:/Users/User/Downloads/src/components/shared/PageHeader';
import { PageHeader } from '../components/shared/PageHeader';
// Removed imports for data fetching actions and placeholder data
// import { getUnansweredQuestions } from './actions/unansweredQuestionsActions';
// import { getGradedResponses } from '../data/gradedResponseActions';
// import { getLoggedQuestions } from './actions/loggedQuestionsActions';
// import { placeholderInquiryTrendData } from 'C:/Users/User/Downloads/src/constants/placeholders';

// import { DashboardClientContent } from 'C:/Users/User/Downloads/src/app/DashboardClientContent';
import { DashboardClientContent } from './DashboardClientContent';

// This is now a Server Component, but doesn't need to fetch data for the dashboard
export default async function DashboardPage() {
  // Removed data fetching logic
  // const loggedQuestions = await getLoggedQuestions();
  // const unansweredItems = await getUnansweredQuestions();
  // const gradedResponses = await getGradedResponses();

  // Removed stats calculation
  // const totalInquiries = loggedQuestions.reduce((sum, item) => sum + item.frequency, 0) + unansweredItems.length;
  // const faqsTracked = loggedQuestions.length;
  // const unansweredQuestionsCount = unansweredItems.length;
  // const responsesGradedCount = gradedResponses.filter(item => item.grade !== null).length;

  // Removed stats object
  // const stats = {
  //   totalInquiries,
  //   faqsTracked,
  //   unansweredQuestions: unansweredQuestionsCount,
  //   responsesGraded: responsesGradedCount,
  // };

  return (
    <div className="space-y-6">
      <PageHeader title="AYA Admin Dashboard" description="Overview of user inquiries and AI performance." />
      {/* Render DashboardClientContent without passing data as props */}
      <DashboardClientContent />
    </div>
  );
}
