import { pgTable, varchar, uuid, text, decimal, integer, timestamp, date, boolean as pgBoolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

//generating unique ids function
function generateUniqueString(length: number = 12): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let uniqueString = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueString += characters[randomIndex];
  }
  return uniqueString;
}

// Users Table
export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Spending Table
export const spending = pgTable("spending", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: date("date").notNull(),
  categoryId: integer("category_id").references(() => categories.id),
  itemName: varchar("item_name", { length: 255 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  notes: text("notes"),
  isDeleted: pgBoolean("is_deleted").default(false).notNull(),
});

// Income Table
export const income = pgTable("income", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull().references(() => users.id),
  date: date("date").notNull(),
  source: varchar("source", { length: 255 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(), // Recurring or One-off
});

// Savings Goals Table
export const savingsGoals = pgTable("savings_goals", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => users.id),
  goalName: varchar("goal_name", { length: 255 }).notNull(),
  targetAmount: decimal("target_amount", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  deadline: date("deadline"),
});

// Savings Contributions Table
export const savingsContributions = pgTable("savings_contributions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  goalId: integer("goal_id").notNull().references(() => savingsGoals.id),
  userId: integer("user_id").notNull().references(() => users.id),
  date: date("date").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
});

// Categories Table
export const categories = pgTable("categories", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").references(() => users.id), // Null for default categories
  categoryName: varchar("category_name", { length: 255 }).notNull(),
  isDeleted: pgBoolean("is_deleted").default(false).notNull(),
});
