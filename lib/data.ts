import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "@/app/db/schema";
import { eq, sum, or, isNull, and, desc,gte,lte,sql } from "drizzle-orm";

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
      orderBy: desc(schema.income.date) // Ensure this column exists in the `income` table
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

export async function fetchSpending(currentPage: number,  startDate:string, endDate:string, category?:string) {
  const session = await auth();
  const userId = session?.user?.id;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;


  try {
    const baseConditions = [
      eq(schema.spending.userId, Number(userId)),
      eq(schema.spending.isDeleted, false),
      gte(schema.spending.date, startDate),
      lte(schema.spending.date, endDate),
    ];

    // If a category is provided, add it to the query
    if (category) {
      baseConditions.push(eq(schema.categories.categoryName, category));
    }
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
        and(...baseConditions)  
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


export async function fetchSpendingPages(
  startDate: string,
  endDate: string,
  category?: string
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized: No user ID found.");
  }

  try {
    const sharedConditions = [
      eq(schema.spending.userId, Number(userId)),
      eq(schema.spending.isDeleted, false),
      gte(schema.spending.date, startDate),
      lte(schema.spending.date, endDate),
    ];

    // ✅ First query: group by category — *no category filter*
    const fullResults = await db
      .select({
        categoryName: schema.categories.categoryName,
        amount: schema.spending.amount,
      })
      .from(schema.spending)
      .innerJoin(
        schema.categories,
        eq(schema.spending.categoryId, schema.categories.id)
      )
      .where(and(...sharedConditions));

    const groupedData = fullResults.reduce((acc, entry) => {
      const { categoryName, amount } = entry;
      const numericAmount = parseFloat(amount); // Convert string to number

      if (!acc[categoryName]) {
        acc[categoryName] = 0;
      }

      acc[categoryName] += numericAmount;
      return acc;
    }, {} as Record<string, number>);

    const resultArray = Object.entries(groupedData).map(
      ([categoryName, totalAmount]) => ({
        categoryName,
        totalAmount,
      })
    );

    // ✅ Second query: total count of items only for selected category
    let categoryPageCount = 0;

    if (category) {
      const filteredResults = await db
        .select({
          id: schema.spending.id,
        })
        .from(schema.spending)
        .innerJoin(
          schema.categories,
          eq(schema.spending.categoryId, schema.categories.id)
        )
        .where(
          and(
            ...sharedConditions,
            eq(schema.categories.categoryName, category)
          )
        );

      categoryPageCount = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);
    }

    return {
      resultArray,
      totalPages: category ? categoryPageCount : Math.ceil(fullResults.length / ITEMS_PER_PAGE),
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch spending pages.");
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

    console.log(results);
    return results;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch savings goals data.");
  }
}

export async function fetchSavingsPercentages(){
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("Unauthorized: No user ID found.");
  }
  try {
    const results = await db
  .select({
    goalId: schema.savingsGoals.id,
    goalName: schema.savingsGoals.goalName,
    targetAmount: schema.savingsGoals.targetAmount,
    totalContributed: sql`COALESCE(SUM(${schema.savingsContributions.amount}), 0)`.as("total_contributed"),
    percentageSaved: sql`ROUND(COALESCE(SUM(${schema.savingsContributions.amount}), 0) / ${schema.savingsGoals.targetAmount} * 100, 2)`.as("percentage_saved")
  })
  .from(schema.savingsGoals)
  .leftJoin(schema.savingsContributions, sql`${schema.savingsGoals.id} = ${schema.savingsContributions.goalId}`)
  .groupBy(schema.savingsGoals.id, schema.savingsGoals.goalName, schema.savingsGoals.targetAmount)
  .where(
      eq(schema.savingsGoals.userId, Number(userId)), // Match userId
  );

  return results;

  } catch(error){
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

export async function deleteIncome(id: number) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized: No user ID found.");
  }

  try {
    const results = await db
      .delete(schema.income)
      .where(
        and(
          eq(schema.income.userId, Number(userId)),
          eq(schema.income.id, id)
        )
      );
      revalidatePath("/dashboard/income");
      return results
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to delete income data.");
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
