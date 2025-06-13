import { NextResponse } from 'next/server';
// Remove local action import
// import { getLoggedQuestions } from '../../../../app/actions/loggedQuestionsActions';

// Replace GET method with POST method
export async function POST(request: Request) {
  try {
    const { backendUrl, endpoint } = await request.json();

    if (!backendUrl || !endpoint) {
      return NextResponse.json(
        { message: "Missing backendUrl or endpoint in request body" },
        { status: 400 }
      );
    }

    const urlToFetch = `${backendUrl}${endpoint}`;

    // Fetch FAQ data from your ngrok-hosted backend endpoint
    const response = await fetch(urlToFetch);

    if (!response.ok) {
      // Handle errors from the backend when fetching FAQ data
      const errorText = await response.text();
      throw new Error(
        `Backend FAQ data error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    // Parse the JSON response from the backend
    const backendData = await response.json();

    // Return the FAQ data received from the backend to the frontend
    // Assuming your backend returns the data in a format directly usable by the frontend
    return NextResponse.json(backendData);
  } catch (error: any) {
    console.error('API Error POST /api/data/faqs:', error);
    return NextResponse.json(
      { message: 'Failed to fetch FAQs from backend', error: error.message },
      { status: 500 }
    );
  }
}

// Remove the old GET method
// export async function GET() {
//   // ... (rest of your old GET method code)
// }
