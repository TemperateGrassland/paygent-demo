import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold tracking-tight">Paygent</h1>
          <p className="text-gray-400 text-lg">
            AI-verified contractor payments powered by Ralio
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-4">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-semibold mb-1">Post a Job</h3>
            <p className="text-gray-400 text-sm">Employers describe work and set a payment amount held in escrow.</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-2xl mb-2">🤖</div>
            <h3 className="font-semibold mb-1">AI Verifies</h3>
            <p className="text-gray-400 text-sm">Claude reviews the contractor&apos;s submission against the requirements.</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-2xl mb-2">💸</div>
            <h3 className="font-semibold mb-1">Ralio Pays</h3>
            <p className="text-gray-400 text-sm">If approved, the Ralio agent instantly releases payment to the contractor.</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center pt-2">
          <Link
            href="/jobs/new"
            className="bg-white text-gray-950 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Post a Job
          </Link>
          <Link
            href="/dashboard"
            className="border border-gray-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/chat"
            className="border border-gray-700 text-white font-semibold px-6 py-3 rounded-lg hover:bg-gray-900 transition-colors"
          >
            Ralio Agent
          </Link>
        </div>
      </div>
    </main>
  );
}
