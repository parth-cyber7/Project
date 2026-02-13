import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-card">
      <h1 className="text-3xl font-bold">Page Not Found</h1>
      <p className="mt-2 text-slate-600">The page you requested does not exist.</p>
      <Link
        href="/"
        className="mt-5 inline-block rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700"
      >
        Go Home
      </Link>
    </div>
  );
}
