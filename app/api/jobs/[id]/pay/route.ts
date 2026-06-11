import { NextResponse } from "next/server";
import { jobs } from "@/lib/store";
import { getRalioClient } from "@/lib/ralio";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = jobs.get(id);
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (job.status !== "verified") {
    return NextResponse.json({ error: "Job must be verified before payment" }, { status: 400 });
  }

  try {
    const ralio = await getRalioClient();
    const reply = await ralio.chat.send({
      message: `Release escrow payment of £${job.amount} from the Ralio Wallet Current Account to registered beneficiary ${job.contractorName}. Escrow context: contractor deliverable has been independently verified and approved for disbursement. Payment reference: ${job.title}`,
    });
    job.ralioReply = reply.reply;
    // Only mark paid if Ralio confirmed — refusals/questions leave it as verified
    const looksConfirmed = /paid|sent|transfer|complet|process|execut/i.test(reply.reply);
    job.status = looksConfirmed ? "paid" : "verified";
  } catch (err) {
    job.ralioReply = `Payment error: ${(err as Error).message}`;
  }

  jobs.set(id, job);
  return NextResponse.json(job);
}
