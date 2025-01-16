import "@/app/db/config";
import {drizzle} from "drizzle-orm/vercel-postgres";
import { sql } from "@vercel/postgres";
import {users, categories, spending, savingsContributions, savingsGoals, income} from "./schema"
import * as schema from "./schema";
import { usersData, savingsData, savingsProgressData, incomeData, spendingData, categoriesData } from '@/app/db/placeholder';

export const db = drizzle(sql, {schema});

export const getUsers = async () => {
    return await db.select().from(users);
}

export type NewUser = typeof users.$inferInsert;
export type NewCategory = typeof categories.$inferInsert;

export const insertUser = async (newUser: NewUser) => {
    return await db.insert(users).values(newUser).returning();
}

export const addCategory = async (newCategory:NewCategory) => {
    await db.insert(categories).values(newCategory).returning();
}

export const addIncome = async (newIncome: typeof income.$inferInsert) => {
    await db.insert(income).values(newIncome).returning();
}

export const addSavingGoal = async (newSaving: typeof savingsGoals.$inferInsert) => {    
    await db.insert(savingsGoals).values(newSaving).returning();
}

export const addSpend = async (newSpending: typeof spending.$inferInsert) => {    
    await db.insert(spending).values(newSpending).returning();
}

export const addContributions = async (newContribution: typeof savingsContributions.$inferInsert) => {
    await db.insert(savingsContributions).values(newContribution).returning();
}
