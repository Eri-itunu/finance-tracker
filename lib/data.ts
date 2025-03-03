import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "@/app/db/schema";
import { eq, sum, or, isNull, and, desc,gte,lte } from "drizzle-orm";

import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
const db = drizzle({ schema });

const ITEMS_PER_PAGE = 6;
export async function fetchIncome(currentPage: number) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized: No user ID found.");
  }

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const results = await db.query.income.findMany({
      limit: ITEMS_PER_PAGE,
      offset: offset,
      where: eq(schema.income.userId, Number(userId)),
    });

   
    return results;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user data.");
  }
}

export async function fetchIncomePages() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized: No user ID found.");
  }
  try {
    const results = await db.query.income.findMany({
      where: eq(schema.income.userId, Number(userId)),
    });

    const totalPages = Math.ceil(Number(results.length) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user data.");
  }
}

export async function fetchSpending(currentPage: number, month?: string) {
  const session = await auth();
  const userId = session?.user?.id;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // Get the current month if none specified
  const currentMonth = month || new Date().toLocaleString("en-CA", { year: "numeric", month: "2-digit" });

  const [year, monthNum] = currentMonth.split('-');
  
  const startDate = new Date(Number(year), Number(monthNum) - 1, 1);
  const endDate = new Date(Number(year), Number(monthNum), 0, 23, 59, 59, 999); // Ensure full coverage

  const startDateStr = startDate.toISOString().split('T')[0]; // Extracts YYYY-MM-DD
  const endDateStr = endDate.toISOString().split('T')[0];

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
      .where(
        and(
          eq(schema.spending.userId, Number(userId)),
          eq(schema.spending.isDeleted, false),
          gte(schema.spending.date, startDateStr),
          lte(schema.spending.date, endDateStr) 
        )  
      )
      .limit(ITEMS_PER_PAGE)
      .offset(offset)
      .orderBy(desc(schema.spending.date));

    return results;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch spending data.");
  }
}

export async function fetchSpendingPages(month?:string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized: No user ID found.");
  }

  // Get the current month if none specified
  const currentMonth = month || new Date().toLocaleString("en-CA", { year: "numeric", month: "2-digit" });

  const [year, monthNum] = currentMonth.split('-');
  
  const startDate = new Date(Number(year), Number(monthNum) - 1, 1);
  const endDate = new Date(Number(year), Number(monthNum), 0, 23, 59, 59, 999); // Ensure full coverage

  const startDateStr = startDate.toISOString().split('T')[0]; // Extracts YYYY-MM-DD
  const endDateStr = endDate.toISOString().split('T')[0];

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
      .where(
        and(
          eq(schema.spending.userId, Number(userId)),
          eq(schema.spending.isDeleted, false),
          gte(schema.spending.date, startDateStr),
          lte(schema.spending.date, endDateStr) 
        )  
      )
      const groupedData = results.reduce((acc, entry) => {
        const { categoryName, amount } = entry;
        const numericAmount = parseFloat(amount); // Convert string to number
      
        if (!acc[categoryName]) {
          acc[categoryName] = 0;
        }
      
        acc[categoryName] += numericAmount; // Sum amounts per category
        return acc;
      }, {} as Record<string, number>);
      
      // Convert the grouped object into an array format
      const resultArray = Object.entries(groupedData).map(([categoryName, totalAmount]) => ({
        categoryName,
        totalAmount
      }));
   
  
  
    // Calculate total pages based on ITEMS_PER_PAGE
    const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);

    console.log({ resultArray, totalPages });

    return { resultArray, totalPages };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch user data.");
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


    return results;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch savings goals data.");
  }
}

export async function deleteSpend(id: number) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized: No user ID found.");
  }

  try {
    const results = await db
      .update(schema.spending)
      .set({ isDeleted: true })
      .where(
        and(
          eq(schema.spending.userId, Number(userId)),
          eq(schema.spending.id, id)
        )
      );
      revalidatePath("/dashboard/expenses");
      return results
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete spending data.");
  }

  
}

export async function deleteCategory(id: number) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized: No user ID found.");
  }

  try {
    const results = await db
      .update(schema.categories)
      .set({ isDeleted: true })
      .where(
        and(
          eq(schema.categories.userId, Number(userId)),
          eq(schema.categories.id, id)
        )
      );
      revalidatePath("/dashboard/expenses");
      return results
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete spending data.");
  }

  
}
