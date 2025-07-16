'use server';

/**
 * @fileOverview Generates a compelling event description from a YouTube URL using AI.
 *
 * - generateEventDescription - A function that generates an event description.
 * - GenerateEventDescriptionInput - The input type for the generateEventDescription function.
 * - GenerateEventDescriptionOutput - The return type for the generateEventDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEventDescriptionInputSchema = z.object({
  youtubeUrl: z
    .string()
    .describe('The YouTube URL of the event.'),
});
export type GenerateEventDescriptionInput = z.infer<
  typeof GenerateEventDescriptionInputSchema
>;

const GenerateEventDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated event description.'),
});
export type GenerateEventDescriptionOutput = z.infer<
  typeof GenerateEventDescriptionOutputSchema
>;

export async function generateEventDescription(
  input: GenerateEventDescriptionInput
): Promise<GenerateEventDescriptionOutput> {
  return generateEventDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEventDescriptionPrompt',
  input: {schema: GenerateEventDescriptionInputSchema},
  output: {schema: GenerateEventDescriptionOutputSchema},
  prompt: `You are an expert copywriter specializing in creating engaging event descriptions.

  Based on the content of the YouTube video provided, generate a compelling description for the event.
  Do not include any promotional language or calls to action.
  
  YouTube URL: {{{youtubeUrl}}}`,
});

const generateEventDescriptionFlow = ai.defineFlow(
  {
    name: 'generateEventDescriptionFlow',
    inputSchema: GenerateEventDescriptionInputSchema,
    outputSchema: GenerateEventDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
