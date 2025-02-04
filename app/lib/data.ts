import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "@/app/db/schema";
import { eq, sum, or, isNull } from "drizzle-orm";
import { formatCurrency, formatDateToLocal } from "@/app/lib/utils";
import { auth } from "@/auth";
const db = drizzle({ schema });

export async function fetchIncome() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized: No user ID found.");
  }

  try {
    const results = await db.query.income.findMany({
      where: eq(schema.income.userId, Number(userId)),
    });

    console.log(results);
    return results;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user data.");
  }
}


export async function fetchSpending() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized: No user ID found.");
  }

  try {
    const results = await db
      .select({
        id: schema.spending.id,
        date: schema.spending.date,
        amount: schema.spending.amount,
        itemName: schema.spending.itemName,
        notes: schema.spending.notes,
        categoryName: schema.categories.categoryName,
      })
      .from(schema.spending)
      .innerJoin(
        schema.categories,
        eq(schema.spending.categoryId, schema.categories.id)
      )
      .where(eq(schema.spending.userId, Number(userId))); // 👈 Filter by user ID

    console.log(results);
    return results;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch spending data.");
  }
}


export async function fetchSavings() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized: No user ID found.");
  }
  try {
    const results = await db
    .select({
      id: schema.savingsContributions.id,
      date: schema.savingsContributions.date,
      amount: schema.savingsContributions.amount,
      savingsGoals: schema.savingsGoals.goalName,
    })
    .from(schema.savingsContributions)
    .innerJoin(
      schema.savingsGoals,
      eq(schema.savingsContributions.goalId, schema.savingsGoals.id) // 👈 Ensure correct join condition
    )
    .where(eq(schema.savingsContributions.userId, Number(userId))); // 👈 Filter by user ID

  console.log(results);

    return results;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch savings data.");
  }
}


export async function fetchCategories() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized: No user ID found.");
  }

  try {
    const results = await db
      .select({
        id: schema.categories.id,
        userId: schema.categories.userId,
        categoryName: schema.categories.categoryName,
      })
      .from(schema.categories)
      .where(
        or(
          eq(schema.categories.userId, Number(userId)), // Match userId
          isNull(schema.categories.userId) // Also include categories with NULL userId
        )
      );

    console.log(results);
    return results;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch categories data.");
  }
}



export async function fetchCardData() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized: No user ID found.");
  }
  try {
    const totalSpendPromise = db
      .select({ value: sum(schema.spending.amount) })
      .from(schema.spending)
      .where(eq(schema.spending.userId, Number(userId))); // 👈 Filter by user ID
    const totalIncomePromise = db
      .select({ value: sum(schema.income.amount) })
      .from(schema.income)
      .where(eq(schema.income.userId, Number(userId))); // 👈 Filter by user ID
    const totalSavingsPromise = db
      .select({ value: sum(schema.savingsContributions.amount) })
      .from(schema.savingsContributions)
      .where(eq(schema.savingsContributions.userId, Number(userId))); // 👈 Filter by user ID

    const data = await Promise.all([
      totalSpendPromise,
      totalIncomePromise,
      totalSavingsPromise,
    ]);

    const totalSpend = Number(data[0][0].value ?? "0");
    const totalIncome = Number(data[1][0].value ?? "0");
    const totalSavings = Number(data[2][0].value ?? "0");
    console.log(totalSpend, totalIncome, totalSavings);
    return { totalSpend, totalIncome, totalSavings };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch spending data.");
  }
}

export async function fetchSavingsGoals() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized: No user ID found.");
  }

  try {
    const results = await db
      .select({
        id: schema.savingsGoals.id,
        userId: schema.savingsGoals.userId,
        goalName: schema.savingsGoals.goalName,
      })
      .from(schema.savingsGoals)
      .where(
          or(
            eq(schema.savingsGoals.userId, Number(userId)), // Match userId
            isNull(schema.savingsGoals.userId) // Also include categories with NULL userId
          )
      );

    console.log(results);
    return results;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch savings goals data.");
  }
}
