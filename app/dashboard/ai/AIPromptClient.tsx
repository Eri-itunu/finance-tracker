"use client";
import React, { useState } from 'react';

export default function AIPromptClient() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponseText(null);
    try {
      const res = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error('Failed to get insights');
      const data = await res.json();
      setResponseText(data.text ?? JSON.stringify(data));
      if (data.aiAvailable === false && data.aiError) {
        setError(data.aiError);
      }
    } catch (err: any) {
      setError(err?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <form onSubmit={submit} className="flex flex-col gap-3">
        <textarea
          className="w-full rounded-md border p-2"
          rows={4}
          placeholder="Ask something like: 'Where can I cut my monthly spending?'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="rounded bg-blue-600 px-4 py-2 text-white" disabled={loading || !prompt}>
            {loading ? 'Thinking...' : 'Ask AI'}
          </button>
        </div>
      </form>

      <div className="mt-4">
        {error ? (
          <div className="rounded bg-red-100 p-3 text-red-700">{error}</div>
        ) : responseText ? (
          <div>
            <pre className="whitespace-pre-wrap rounded bg-gray-50 p-4">{responseText}</pre>
            {/* show ai status if available */}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {/** read local variable `responseText` only; API errors handled via `error` state */}
          </div>
        ) : null}
      </div>
    </div>
  );
}
