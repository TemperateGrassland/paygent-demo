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
    tools: [
      {
        name: "submit_verification",
        description: "Submit the verification result for the submitted work",
        input_schema: {
          type: "object" as const,
          properties: {
            approved: { type: "boolean", description: "Whether the work meets the requirements" },
            reasoning: { type: "string", description: "Explanation of the decision" },
          },
          required: ["approved", "reasoning"],
        },
      },
    ],
    tool_choice: { type: "tool", name: "submit_verification" },
    messages: [
      {
        role: "user",
        content: `You are a work verification agent for a contractor payment platform. Determine whether the submitted work satisfies the job requirements.

Job Title: ${jobTitle}
Job Requirements: ${jobDescription}
Submitted Work: ${submittedWork}`,
      },
    ],
  });

  const toolUse = response.content.find((b) => b.type === "tool_use") as Anthropic.ToolUseBlock;
  if (!toolUse) throw new Error("No verification result returned from Claude");
  return toolUse.input as VerificationResult;
}
