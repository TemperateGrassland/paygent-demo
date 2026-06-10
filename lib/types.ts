export type JobStatus = "open" | "submitted" | "verified" | "paid" | "rejected";

export type Job = {
  id: string;
  title: string;
  description: string;
  amount: number;
  contractorName: string;
  status: JobStatus;
  submission?: string;
  verificationReasoning?: string;
  ralioReply?: string;
  createdAt: string;
};
