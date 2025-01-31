import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "@/app/db/schema";
import { eq, sum } from "drizzle-orm";
import { formatCurrency, formatDateToLocal } from "@/lib/utils";
const db = drizzle({ schema });

export async function fetchIncome() {
  try {
    const results = await db.query.income.findMany();
    console.log(results);
    return results;
  } catch (error) {
    console.log("Database Error:", error);
    throw new Error("Failed to fetch user data.");
  }
}

export async function fetchSpending() {
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
      .innerJoin(schema.categories, eq(schema.spending.categoryId, schema.categories.id));

    console.log(results)
    return results;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch spending data.");
  }
}

export async function fetchSavings() {

  try{
    const results = await db
      .select({
        id: schema.savingsContributions.id,
        date: schema.savingsContributions.date,
        amount: schema.savingsContributions.amount,
        savingsGoals: schema.savingsGoals.goalName,
      })
      .from(schema.savingsContributions)
      .innerJoin(schema.savingsGoals, eq(schema.savingsContributions.userId, schema.savingsGoals.userId));

    
    return results;
  }catch(error){
    console.error("Database Error:", error);
    throw new Error("Failed to fetch savings data.");
  } 

}

export async function fetchCategories() {

  try{
    const results = await db.select({
      id: schema.categories.id,
      userId: schema.categories.userId,
      categoryName: schema.categories.categoryName,
    })
    .from(schema.categories)
    console.log(results);
    return results;
  }catch(error){
    console.error("Database Error:", error);
    throw new Error("Failed to fetch categories data.");
  }

}

export async function fetchCardData() {

  try{
    const totalSpendPromise =  db.select({ value: sum(schema.spending.amount) }).from(schema.spending);
    const totalIncomePromise =  db.select({ value: sum(schema.income.amount) }).from(schema.income);
    const totalSavingsPromise =  db.select({ value: sum(schema.savingsContributions.amount) }).from(schema.savingsContributions);

    const data = await Promise.all([
      totalSpendPromise,
      totalIncomePromise,
      totalSavingsPromise,
    ]);


    const totalSpend = Number(data[0][0].value ?? '0');
    const totalIncome = Number(data[1][0].value ?? '0');
    const totalSavings = Number(data[2][0].value ?? '0');
    console.log( totalSpend , totalIncome , totalSavings);
    return{ totalSpend , totalIncome , totalSavings};
    
  }catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch spending data.");
  }
}
