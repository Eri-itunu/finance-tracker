
import { generateInsights } from '@/lib/ai';

export default async function AICard() {
  let insightsText = 'No insights available.';
  let aiInfo: { available: boolean; error?: string | null } = { available: false };
  try {
    const data = await generateInsights();
    insightsText = data.text;
    aiInfo.available = Boolean(data.aiAvailable);
    if (data.aiError) aiInfo.error = data.aiError;
  } catch (err: any) {
    insightsText = 'Failed to generate insights.';
    aiInfo = { available: false, error: err?.message ?? String(err) };
  }

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex items-center justify-between p-4">
        <h3 className="ml-2 text-sm font-medium">AI Insights</h3>
        <div className="text-xs text-gray-500">{aiInfo.available ? 'AI: available' : 'AI: fallback'}</div>
      </div>
      <pre className="whitespace-pre-wrap rounded-xl bg-white px-4 py-6 text-sm">{insightsText}</pre>
      {aiInfo.error ? (
        <div className="mt-2 rounded bg-yellow-50 p-2 text-sm text-yellow-700">AI error: {aiInfo.error}</div>
      ) : null}
    </div>
  );
}
