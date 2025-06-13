import type { FAQItem, FallbackItem, TrainingDataItem, ChartDataPoint } from '../types';

export const placeholderFAQItems: FAQItem[] = [
  { id: '1', question: "What are your shipping rates to North America?", frequency: 125, lastAsked: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '2', question: "Do you offer temperature-controlled shipping?", frequency: 98, lastAsked: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '3', question: "What is the transit time to Shanghai?", frequency: 75, lastAsked: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
  { id: '4', question: "Can I track my shipment in real-time?", frequency: 62, lastAsked: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: '5', question: "What documents are required for international shipping?", frequency: 50, lastAsked: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
];

export const placeholderFallbackItems: FallbackItem[] = [
  { id: 'fb1', userMessage: "My shipment is stuck in customs, what's the magical incantation?", fallbackResponse: "I'm sorry, I can't provide specific customs advice. Please contact our support team.", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), reason: "Complex query beyond scope" },
  { id: 'fb2', userMessage: "Tell me a joke about shipping.", fallbackResponse: "I'm here to help with shipping inquiries. How can I assist you today?", timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), reason: "Off-topic" },
  { id: 'fb3', userMessage: "Can you guarantee delivery by tomorrow for a new booking?", fallbackResponse: "Delivery times depend on various factors. Let's check specific routes and services.", timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), reason: "Requires real-time data unavailable" },
];

export const placeholderTrainingData: TrainingDataItem[] = [
  {
    id: 'td1', userMessage: "What's the cost for a 20ft container to Rotterdam?", ayaResponse: "The approximate cost is $2500, subject to availability.", grade: 4, adminRemarks: "Good estimate, but mention seasonality.", correctedResponse: "The approximate cost is $2500. Please note that rates can vary based on season and availability. Would you like a more precise quote?", timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    session_id: undefined
  },
  {
    id: 'td2', userMessage: "How long does it take to ship from LA to Tokyo?", ayaResponse: "It takes about 2 weeks.", grade: 3, adminRemarks: "Too generic. Specify vessel type or service level if possible.", correctedResponse: "Standard ocean freight from Los Angeles to Tokyo typically takes 12-16 days. Express services might be faster. Do you have specific cargo details?", timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    session_id: undefined
  },
  {
    id: 'td3', userMessage: "Is insurance included?", ayaResponse: "Yes, basic insurance is included.", grade: 2, adminRemarks: "Incorrect. Basic insurance is optional.", correctedResponse: "Standard cargo insurance is not automatically included but can be added to your shipment. Would you like a quote for insurance?", timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    session_id: undefined
  },
  {
    id: 'td4', userMessage: "Do you ship hazardous materials?", ayaResponse: "I am not sure, let me check.", grade: 1, adminRemarks: "AI should know this. We do, with restrictions.", correctedResponse: "Yes, we handle select classes of hazardous materials. Could you provide the UN number and class for the cargo so I can confirm specific requirements?", timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    session_id: undefined
  },
];
export const placeholderLoggedQuestions = [
  { id: '1', question: 'What is TypeScript?', user: 'admin', timestamp: '2023-01-01T00:00:00Z', frequency: 5, lastAsked: '2023-01-01T00:00:00Z' },
  { id: '2', question: 'How to use React?', user: 'user123', timestamp: '2023-01-02T00:00:00Z', frequency: 3, lastAsked: '2023-01-02T00:00:00Z' },
];
export const placeholderInquiryTrendData: ChartDataPoint[] = [
  { name: 'Mon', value: 22 },
  { name: 'Tue', value: 35 },
  { name: 'Wed', value: 28 },
  { name: 'Thu', value: 42 },
  { name: 'Fri', value: 30 },
  { name: 'Sat', value: 15 },
  { name: 'Sun', value: 10 },
];

export const placeholderUnassessedItem: TrainingDataItem = {
  id: 'ua1',
  userMessage: "What are your payment terms for new clients?",
  ayaResponse: "Our standard payment terms are net 30 days upon credit approval. For new clients, we might require prepayment for the first shipment.",
  grade: undefined,
  adminRemarks: undefined,
  correctedResponse: undefined,
  timestamp: new Date().toISOString(),
  session_id: undefined
};
