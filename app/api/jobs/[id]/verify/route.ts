import { NextResponse } from "next/server";
import { jobs } from "@/lib/store";
import { verifyWork } from "@/lib/claude";
import { getRalioClient } from "@/lib/ralio";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = jobs.get(id);
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (job.status !== "submitted") {
    return NextResponse.json({ error: "Job has not been submitted yet" }, { status: 400 });
  }

  // Step 1: Claude verifies the work
  const { approved, reasoning } = await verifyWork(
    job.title,
    job.description,
    job.submission!
  );

  job.verificationReasoning = reasoning;

  if (!approved) {
    job.status = "rejected";
    jobs.set(id, job);
    return NextResponse.json(job);
  }

  job.status = "verified";

  // Step 2: Instruct Ralio agent to pay
  try {
    const ralio = await getRalioClient();
    const reply = await ralio.chat.send({
      message: `Pay £${job.amount} to ${job.contractorName} for: ${job.title}`,
    });
    job.ralioReply = reply.reply;
    job.status = "paid";
  } catch (err) {
    job.ralioReply = `Payment error: ${(err as Error).message}`;
  }

  jobs.set(id, job);
  return NextResponse.json(job);
}
