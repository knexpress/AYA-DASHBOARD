
'use server';
/**
 * @fileOverview A Genkit flow to generate an enhanced AI response using graded examples.
 *
 * - generateEnhancedResponse - A function that takes a user query and uses past graded examples to generate an improved response.
 * - GenerateEnhancedResponseInput - The input type for the generateEnhancedResponse function.
 * - GenerateEnhancedResponseOutput - The return type for the generateEnhancedResponse function.
 */

import * as ai from '../genkit'; // Adjusted to import all members from the module
import { z } from 'genkit';
import { TrainingDataItem } from '../../types';
// Ensure the module exists or adjust the path accordingly
// Adjusted path to match the correct location of the module
import { getGradedResponses } from 'C:/Users/User/Downloads/src/data/gradedResponseActions'; // Verify the file exists at this location
import { ZodObject, ZodString, ZodOptional, ZodArray, ZodTypeAny } from 'zod';

// Input schema for the flow
const GenerateEnhancedResponseInputSchema = z.object({
  currentQuery: z.string().describe('The new user query for which to generate a response.'),
});
export type GenerateEnhancedResponseInput = z.infer<typeof GenerateEnhancedResponseInputSchema>;

// Output schema for the flow
const GenerateEnhancedResponseOutputSchema = z.object({
  enhancedResponse: z.string().describe('The AI-generated response, enhanced by learning from past graded examples.'),
});
export type GenerateEnhancedResponseOutput = z.infer<typeof GenerateEnhancedResponseOutputSchema>;

// Wrapper function to be called from the application
export async function generateEnhancedResponse(input: GenerateEnhancedResponseInput): Promise<GenerateEnhancedResponseOutput> {
  return generateEnhancedResponseFlow.execute(input);
}

// Schema for the prompt's input, including examples
const EnhancedPromptInputSchema = z.object({
  currentQuery: z.string(),
  examples: z.array(z.object({
    userMessage: z.string(),
    ayaResponse: z.string(),
    correctedResponse: z.string(),
    adminRemarks: z.string().optional(),
    timestamp: z.string(),
  })).optional(),
});

const enhancedResponsePrompt = ai.definePrompt({
  name: 'enhancedResponsePrompt',
  input: { schema: EnhancedPromptInputSchema },
  output: { schema: GenerateEnhancedResponseOutputSchema }, // Expecting the same output structure
  prompt: `You are AYA, an AI Sales Assistant. Your goal is to provide accurate and helpful responses to user inquiries.
You have been provided with a new user query.
{{#if examples.length}}
Below are some examples of past interactions, including the user's message, AYA's original (potentially flawed) response, and a "Corrected Response" which represents the ideal answer.
Please learn from these "Corrected Responses" to generate the best possible, improved response to the NEW user query.

**Past Examples for Reference:**
{{#each examples}}
---
User's Message: {{{this.userMessage}}}
AYA's Original Response: {{{this.ayaResponse}}}
Corrected / Ideal Response: {{{this.correctedResponse}}}
{{#if this.adminRemarks}}Admin Remarks on this example: {{{this.adminRemarks}}}{{/if}}
---
{{/each}}
{{else}}
(No past examples with corrected responses were available to provide for reference for this query.)
{{/if}}

**NEW User Query to Answer:**
{{{currentQuery}}}

Based on the query and any provided examples, particularly the corrected responses, provide your best response below.

**Your Improved Response for the NEW User Query:**
`,
  // Custom render function to ensure enhancedResponse is part of the output object
  // and matches the flow's output schema.
  // We're asking the model to produce text, and we'll wrap it.
  // Alternatively, we could ask the model to produce JSON matching GenerateEnhancedResponseOutputSchema
  // but that's more complex for the LLM. Simpler to get text and wrap.
  // For this simple case where prompt output *is* the flow output (almost), 
  // we can rely on the model generating the response and then mapping it.
  // Let's refine the prompt to directly ask for the "enhancedResponse" field if possible, or just take its text.
  // The output schema for the prompt expects `enhancedResponse`. So the LLM needs to provide that.
  // The prompt above implicitly guides the LLM to provide the text for "Your Improved Response..."
  // We can adjust the prompt to be more explicit about the JSON structure if needed, or process the raw text.
  // For now, let's assume the LLM's main text output after "Your Improved Response..." is what we want.
  // The `output: { schema: GenerateEnhancedResponseOutputSchema }` will guide Gemini
  // to attempt to structure its output. If it just gives text, Genkit will try to fit it.
});


const generateEnhancedResponseFlow = ai.defineFlow(
    {
        name: 'generateEnhancedResponseFlow',
        inputSchema: GenerateEnhancedResponseInputSchema,
        outputSchema: GenerateEnhancedResponseOutputSchema,
    },
    async (input: GenerateEnhancedResponseInput): Promise<GenerateEnhancedResponseOutput> => {
        const allGradedResponses = await getGradedResponses();

        // Filter for examples with a corrected response and take the last 3 (or fewer if not available)
        const relevantExamples = allGradedResponses
            .filter(item => item.correctedResponse && item.correctedResponse.trim() !== '')
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) // Sort by newest first
            .slice(0, 3); // Take up to 3 most recent with corrected responses

        console.log(`Using ${relevantExamples.length} examples for query: ${input.currentQuery}`);

        const promptInput = {
            currentQuery: input.currentQuery,
            examples: relevantExamples.length > 0 ? relevantExamples : undefined, // Pass undefined if no examples
        };

        // The prompt is defined to output data matching GenerateEnhancedResponseOutputSchema
        const { output } = await ai.runPrompt(enhancedResponsePrompt, promptInput);

        if (!output || !output.enhancedResponse) {
            // Fallback if the model doesn't adhere to the output schema or provides empty response
            console.warn('LLM did not produce the expected enhancedResponse structure. Generating a simple response.');
            const fallbackResult = await ai.generate({
                prompt: `Answer the following user query: ${input.currentQuery}`,
            }) as unknown as { text: string; };
            return { enhancedResponse: fallbackResult?.text ?? "I'm sorry, I couldn't generate a response at this time." };
        }

        return output;
    }
) as unknown as { execute: (input: GenerateEnhancedResponseInput) => Promise<GenerateEnhancedResponseOutput> };