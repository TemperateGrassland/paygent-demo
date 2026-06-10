import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export type VerificationResult = {
  approved: boolean;
  reasoning: string;
};

export async function verifyWork(
  jobTitle: string,
  jobDescription: string,
  submittedWork: string
): Promise<VerificationResult> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `You are a work verification agent for a contractor payment platform. Determine whether the submitted work satisfies the job requirements.

Job Title: ${jobTitle}
Job Requirements: ${jobDescription}
Submitted Work: ${submittedWork}

Respond with valid JSON only (no markdown, no code fences):
{ "approved": boolean, "reasoning": string }`,
      },
    ],
  });

  const text = (response.content[0] as Anthropic.TextBlock).text;
  return JSON.parse(text) as VerificationResult;
}
