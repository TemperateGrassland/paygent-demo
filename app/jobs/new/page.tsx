"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;
    const data = {
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      description: (form.elements.namedItem("description") as HTMLTextAreaElement).value,
      amount: (form.elements.namedItem("amount") as HTMLInputElement).value,
      contractorName: (form.elements.namedItem("contractorName") as HTMLInputElement).value,
    };

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? "Failed to create job");
      setLoading(false);
      return;
    }

    const job = await res.json();
    router.push(`/jobs/${job.id}`);
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-12">
      <div className="max-w-xl mx-auto space-y-8">
        <div>
          <Link href="/" className="text-gray-400 text-sm hover:text-white transition-colors">
            ← Back
          </Link>
          <h1 className="text-3xl font-bold mt-3">Post a Job</h1>
          <p className="text-gray-400 mt-1">Describe the work and set the payment amount.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="title">
              Job Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="e.g. Design a landing page mockup"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="description">
              Requirements
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              placeholder="Describe exactly what the contractor needs to deliver..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="amount">
                Payment Amount (£)
              </label>
              <input
                id="amount"
                name="amount"
                type="number"
                required
                min="1"
                step="0.01"
                placeholder="500"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="contractorName">
                Contractor Name
              </label>
              <input
                id="contractorName"
                name="contractorName"
                type="text"
                required
                placeholder="e.g. Alice Smith"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
              />
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-gray-950 font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Job"}
          </button>
        </form>
      </div>
    </main>
  );
}
