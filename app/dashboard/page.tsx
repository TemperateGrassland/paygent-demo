"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Job } from "@/lib/types";

const STATUS_STYLES: Record<string, string> = {
  open: "bg-blue-900 text-blue-300",
  submitted: "bg-yellow-900 text-yellow-300",
  verified: "bg-green-900 text-green-300",
  paid: "bg-emerald-900 text-emerald-300",
  rejected: "bg-red-900 text-red-300",
};

type Transaction = {
  date: string;
  amount: number;
  currency: string;
  creditor: string;
  status: string;
};

export default function DashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txError, setTxError] = useState("");

  useEffect(() => {
    fetch("/api/jobs")
      .then((r) => r.json())
      .then((data) => setJobs(Array.isArray(data) ? data : []));

    fetch("/api/transactions")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setTxError(data.error);
        else setTransactions(Array.isArray(data) ? data : []);
      });
  }, []);

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/" className="text-gray-400 text-sm hover:text-white transition-colors">
              ← Home
            </Link>
            <h1 className="text-3xl font-bold mt-2">Dashboard</h1>
          </div>
          <Link
            href="/jobs/new"
            className="bg-white text-gray-950 font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-100 transition-colors text-sm"
          >
            Post a Job
          </Link>
        </div>

        {/* Jobs */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Jobs</h2>
          {jobs.length === 0 ? (
            <p className="text-gray-500 text-sm">No jobs yet.</p>
          ) : (
            <div className="space-y-2">
              {jobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="block bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{job.title}</p>
                      <p className="text-sm text-gray-400 mt-0.5">
                        £{job.amount} · {job.contractorName}
                      </p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[job.status]}`}>
                      {job.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Ralio Transactions */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Ralio Transactions</h2>
          {txError ? (
            <p className="text-red-400 text-sm">{txError}</p>
          ) : transactions.length === 0 ? (
            <p className="text-gray-500 text-sm">No transactions yet.</p>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx, i) => (
                <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{tx.creditor}</p>
                      <p className="text-sm text-gray-400 mt-0.5">
                        {new Date(tx.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {tx.currency} {tx.amount}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">{tx.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
