import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "@/app/db/schema";
import { eq, desc, sum, and, gte } from "drizzle-orm";
import { auth } from "@/auth";
import OpenAI from "openai";

const db = drizzle({ schema });

// Use OpenRouter as the base URL and DeepSeek as the model
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000", // or your deployed domain
    "X-Title": "Finance Tracker",
  },
});

function formatCurrency(n: number) {
  return n.toLocaleString?.(undefined, { style: "currency", currency: "NGN" }) ?? String(n);
}

export type InsightsResponse = {
  metrics: {
    totalSpend: number;
    totalIncome: number;
    totalSavings: number;
    monthlyAverage: number;
    topCategory?: { name: string; total: number } | null;
    largestExpense?: { id: number; itemName: string; amount: number } | null;
  };
  text: string;
  aiAvailable?: boolean;
  aiError?: string | null;
};

export async function generateInsights(userPrompt?: string): Promise<InsightsResponse> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) throw new Error("Unauthorized");

  const uid = Number(userId);

  // Totals
  const totalSpendPromise = db
    .select({ value: sum(schema.spending.amount) })
    .from(schema.spending)
    .where(eq(schema.spending.userId, uid));

  const totalIncomePromise = db
    .select({ value: sum(schema.income.amount) })
    .from(schema.income)
    .where(eq(schema.income.userId, uid));

  const totalSavingsPromise = db
    .select({ value: sum(schema.savingsContributions.amount) })
    .from(schema.savingsContributions)
    .where(eq(schema.savingsContributions.userId, uid));

  // Top category
  const categoryRows = await db
    .select({ categoryName: schema.categories.categoryName, amount: schema.spending.amount })
    .from(schema.spending)
    .innerJoin(schema.categories, eq(schema.spending.categoryId, schema.categories.id))
    .where(eq(schema.spending.userId, uid));

  const grouped: Record<string, number> = {};
  for (const row of categoryRows) {
    const name = row.categoryName ?? "Unknown";
    const amt = Number(row.amount ?? 0);
    grouped[name] = (grouped[name] || 0) + amt;
  }

  const topCategoryEntry =
    Object.entries(grouped)
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)[0] || null;

  // Largest single expense
  const largestExpenseRows = await db
    .select({
      id: schema.spending.id,
      itemName: schema.spending.itemName,
      amount: schema.spending.amount,
    })
    .from(schema.spending)
    .where(eq(schema.spending.userId, uid))
    .orderBy(desc(schema.spending.amount))
    .limit(1);

  const largestExpense = largestExpenseRows[0]
    ? {
        id: Number(largestExpenseRows[0].id),
        itemName: String(largestExpenseRows[0].itemName ?? ""),
        amount: Number(largestExpenseRows[0].amount ?? 0),
      }
    : null;

  // Monthly average over last 3 months
  const now = new Date();
  const past = new Date();
  past.setMonth(now.getMonth() - 3);
  const startDate = past.toISOString().split("T")[0];

  const recentSumRows = await db
    .select({ value: sum(schema.spending.amount) })
    .from(schema.spending)
    .where(and(eq(schema.spending.userId, uid), gte(schema.spending.date, startDate)));

  const recentSum = Number(recentSumRows[0]?.value ?? 0);
  const monthlyAverage = recentSum / 3;

  const [totalsSpend, totalsIncome, totalsSavings] = await Promise.all([
    totalSpendPromise,
    totalIncomePromise,
    totalSavingsPromise,
  ]);

  const totalSpend = Number(totalsSpend[0]?.value ?? 0);
  const totalIncome = Number(totalsIncome[0]?.value ?? 0);
  const totalSavings = Number(totalsSavings[0]?.value ?? 0);

  const bullets = [
    `Total documented income: ${formatCurrency(totalIncome)}`,
    `Total documented expenses: ${formatCurrency(totalSpend)}`,
    `Total documented savings: ${formatCurrency(totalSavings)}`,
    `Average monthly spend (last 3 months): ${formatCurrency(monthlyAverage)}`,
  ];

  if (topCategoryEntry) {
    bullets.push(`Top spending category: ${topCategoryEntry.name} (${formatCurrency(topCategoryEntry.total)})`);
  }
  if (largestExpense) {
    bullets.push(`Largest single expense: ${largestExpense.itemName} (${formatCurrency(largestExpense.amount)})`);
  }

  // ✅ DeepSeek AI integration (via OpenRouter)
  const hasKey = Boolean(process.env.OPENROUTER_API_KEY);
  if (hasKey) {
    console.log("✅ Using DeepSeek R1 via OpenRouter to generate insights...");
    try {
      const promptBase =
        `You are a financial assistant. Given the user's financial metrics, generate 3 concise insights (1 sentence each) and 1 suggested action they can take to improve their finances.`;
      const prompt = `${promptBase}\n\nMetrics:\n${bullets.join(
        "\n"
      )}\n\n${userPrompt ? `User question: ${userPrompt}` : "Provide general insights."}`;

      const completion = await openai.chat.completions.create({
        model: "alibaba/tongyi-deepresearch-30b-a3b:free",
        messages: [{ role: "user", content: prompt }],
        
      });

      const aiText = completion.choices?.[0]?.message?.content;

      if (aiText && typeof aiText === "string") {
        return {
          metrics: {
            totalSpend,
            totalIncome,
            totalSavings,
            monthlyAverage,
            topCategory: topCategoryEntry
              ? { name: topCategoryEntry.name, total: topCategoryEntry.total }
              : null,
            largestExpense,
          },
          text: aiText,
          aiAvailable: true,
          aiError: null,
        };
      }
    } catch (err: any) {
      console.error("❌ DeepSeek call failed:", err);
      return {
        metrics: {
          totalSpend,
          totalIncome,
          totalSavings,
          monthlyAverage,
          topCategory: topCategoryEntry
            ? { name: topCategoryEntry.name, total: topCategoryEntry.total }
            : null,
          largestExpense,
        },
        text:
          bullets.map((b) => `• ${b}`).join("\n") +
          "\n\nSuggested action: Review your top spending category and set a goal to reduce it by 10% next month.",
        aiAvailable: false,
        aiError: err?.message ?? "DeepSeek call failed",
      };
    }
  }

  // Fallback if no key or AI unavailable
  const fallbackText =
    bullets.map((b) => `• ${b}`).join("\n") +
    "\n\nSuggested action: Review your top spending category and set a goal to reduce it by 10% next month.";

  return {
    metrics: {
      totalSpend,
      totalIncome,
      totalSavings,
      monthlyAverage,
      topCategory: topCategoryEntry
        ? { name: topCategoryEntry.name, total: topCategoryEntry.total }
        : null,
      largestExpense,
    },
    text: fallbackText,
    aiAvailable: false,
    aiError: hasKey ? "No valid DeepSeek response" : "OPENROUTER_API_KEY not set",
  };
}
