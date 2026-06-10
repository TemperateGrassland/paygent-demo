"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Job } from "@/lib/types";

const STATUS_STYLES: Record<string, string> = {
  open: "bg-blue-900 text-blue-300",
  submitted: "bg-yellow-900 text-yellow-300",
  verified: "bg-green-900 text-green-300",
  paid: "bg-emerald-900 text-emerald-300",
  rejected: "bg-red-900 text-red-300",
};

export default function JobPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [submission, setSubmission] = useState("");
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/jobs/${id}`)
      .then((r) => r.json())
      .then(setJob);
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch(`/api/jobs/${id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submission }),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? "Submission failed");
      setLoading(false);
      return;
    }

    setLoading(false);
    setVerifying(true);

    // Auto-trigger verification
    const verifyRes = await fetch(`/api/jobs/${id}/verify`, { method: "POST" });
    const updated = await verifyRes.json();
    setJob(updated);
    setVerifying(false);
  }

  if (!job) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-12">
      <div className="max-w-xl mx-auto space-y-6">
        <div>
          <Link href="/dashboard" className="text-gray-400 text-sm hover:text-white transition-colors">
            ← Dashboard
          </Link>
          <div className="flex items-center gap-3 mt-3">
            <h1 className="text-3xl font-bold">{job.title}</h1>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[job.status]}`}>
              {job.status}
            </span>
          </div>
          <p className="text-gray-400 mt-1">
            £{job.amount} · Contractor: {job.contractorName}
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Requirements</h2>
          <p className="text-gray-100 whitespace-pre-wrap">{job.description}</p>
        </div>

        {job.status === "open" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Submit Your Work</label>
              <textarea
                value={submission}
                onChange={(e) => setSubmission(e.target.value)}
                required
                rows={5}
                placeholder="Paste a link, describe what you've done, or provide your deliverable..."
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 resize-none"
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading || verifying}
              className="w-full bg-white text-gray-950 font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {loading ? "Submitting..." : verifying ? "Verifying with AI..." : "Submit Work"}
            </button>
          </form>
        )}

        {job.submission && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Submitted Work</h2>
            <p className="text-gray-100 whitespace-pre-wrap">{job.submission}</p>
          </div>
        )}

        {job.verificationReasoning && (
          <div className={`border rounded-xl p-4 ${job.status === "rejected" ? "bg-red-950 border-red-800" : "bg-green-950 border-green-800"}`}>
            <h2 className="text-sm font-semibold uppercase tracking-wide mb-2">
              {job.status === "rejected" ? "❌ AI Verdict: Rejected" : "✅ AI Verdict: Approved"}
            </h2>
            <p className="text-sm whitespace-pre-wrap">{job.verificationReasoning}</p>
          </div>
        )}

        {job.ralioReply && (
          <div className="bg-emerald-950 border border-emerald-800 rounded-xl p-4">
            <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide mb-2">💸 Ralio Payment</h2>
            <p className="text-sm text-emerald-200 whitespace-pre-wrap">{job.ralioReply}</p>
          </div>
        )}
      </div>
    </main>
  );
}
