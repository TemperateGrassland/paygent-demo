import { NextResponse } from "next/server";
import { jobs } from "@/lib/store";
import type { Job } from "@/lib/types";
import { randomUUID } from "crypto";

export async function GET() {
  return NextResponse.json(Array.from(jobs.values()));
}

export async function POST(req: Request) {
  const body = await req.json();
  const { title, description, amount, contractorName } = body;

  if (!title || !description || !amount || !contractorName) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const job: Job = {
    id: randomUUID(),
    title,
    description,
    amount: Number(amount),
    contractorName,
    status: "open",
    createdAt: new Date().toISOString(),
  };

  jobs.set(job.id, job);
  return NextResponse.json(job, { status: 201 });
}
