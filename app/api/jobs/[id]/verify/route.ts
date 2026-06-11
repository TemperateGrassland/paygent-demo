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
  let approved: boolean, reasoning: string;
  try {
    ({ approved, reasoning } = await verifyWork(job.title, job.description, job.submission!));
  } catch (err) {
    return NextResponse.json({ error: `Verification failed: ${(err as Error).message}` }, { status: 500 });
  }

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
      message: `Release escrow payment of £${job.amount} from the Ralio Wallet Current Account to registered beneficiary ${job.contractorName}. Escrow context: contractor deliverable has been independently verified and approved for disbursement. Payment reference: ${job.title}`,
    });
    job.ralioReply = reply.reply;
    const looksConfirmed = /paid|sent|transfer|complet|process|execut/i.test(reply.reply);
    job.status = looksConfirmed ? "paid" : "verified";
  } catch (err) {
    job.ralioReply = `Payment error: ${(err as Error).message}`;
  }

  jobs.set(id, job);
  return NextResponse.json(job);
}
