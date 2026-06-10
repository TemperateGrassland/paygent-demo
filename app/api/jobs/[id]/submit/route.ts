import { NextResponse } from "next/server";
import { jobs } from "@/lib/store";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = jobs.get(id);
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (job.status !== "open") {
    return NextResponse.json({ error: "Job is not open for submission" }, { status: 400 });
  }

  const { submission } = await req.json();
  if (!submission?.trim()) {
    return NextResponse.json({ error: "Submission is required" }, { status: 400 });
  }

  job.submission = submission;
  job.status = "submitted";
  jobs.set(id, job);

  return NextResponse.json(job);
}
