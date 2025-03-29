import Link from 'next/link';

export default function TestGlossRoutePage() {
  // Use a test gloss ID from your database
  const testGlossId = '7679a54d-723b-49c9-ba13-ede3243cc97f';

  return (
    <div className="mx-auto max-w-6xl p-10">
      <h1 className="mb-6 text-2xl font-bold">Test Gloss Routing</h1>
      <p className="mb-4">
        This page tests if direct routing to a gloss ID works properly.
      </p>
      <div className="flex flex-col space-y-4">
        <Link
          href={`/gloss/${testGlossId}`}
          className="inline-flex w-fit items-center rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Test Direct Link to Gloss
        </Link>
        <div className="text-sm text-gray-500">
          <p>Testing ID: {testGlossId}</p>
          <p>
            This should take you to the carousel viewer page for this specific
            gloss.
          </p>
        </div>
      </div>
    </div>
  );
} 