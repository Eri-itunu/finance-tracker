'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "@/app/db/schema";
import { AuthError } from 'next-auth';
import { signIn } from "@/auth"; // Your authentication logic
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { deleteSpend, deleteIncome } from './data';


const db = drizzle({ schema });
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

function parseAmount(amount: string): number {
  return parseFloat(amount.replace(/,/g, "")); // Remove commas and convert to float
}

export type State = {
  errors?: {
    amount?: string[];
    categoryId?: string[];
    itemName?: string[];
    notes?: string[];
    date?: string[];
    category?: string[],
    savingsGoal?: string[],
    userId?: string[],
    source?: string[]
  };
  message?: string | null;
};

export type registerState = {
  errors?: {
    firstName?:string[],
    lastName?:string[],
    email?:string[]
    password?:string[],
    confirmPassword?: string[]
  };
  message?: string | null;
}
  
const FormSchema = z.object({
  amount: z.coerce.string().refine((val) => !isNaN(parseAmount(val)) && parseAmount(val) > 0, {
     message: 'Please enter a valid amount greater than 0.',
   }),
  itemName: z.string().min(1, { message: 'Item name is required.' }),
  categoryId: z.coerce.number().int().positive({ message: 'Category ID is required.' }),
  notes: z.string().max(255, { message: "Notes must be at most 255 characters" }).optional(),
  date: z
    .string()
    .regex(dateRegex, "Invalid date format. Use YYYY-MM-DD.")
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date. Ensure it's a real date.",
    }),
  category: z.string().min(1, { message: 'Category name is required.' }),
  userId: z.string()
});
  
const CreateSpending = FormSchema.omit({ category:true });
  
export async function createSpending(prevState: State, formData: FormData) {


  // Validate form using Zod
  const validatedFields = CreateSpending.safeParse({
    amount: formData.get('amount'),
    itemName: formData.get('itemName'),
    categoryId: formData.get('categoryId'),
    notes: formData.get('notes'),
    userId: formData.get('userId'),
    date: formData.get('date')
  });


  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
      console.log(validatedFields.error.flatten().fieldErrors)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Spending Entry.',
    };
  }

  // Prepare data for insertion into the database
  const { amount, itemName, categoryId, notes, userId, date } = validatedFields.data;
  // const date = new Date().toISOString().split('T')[0];
  const amountDecimal = parseAmount(amount).toFixed(2);

  // Insert data into the database using Drizzle ORM
  try {
    await db.insert(schema.spending).values({
      amount: amountDecimal,
      itemName: itemName,
      categoryId: categoryId,
      userId: Number(userId),
      date: date,
      notes: notes,
    });
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Spending Entry.',error
    };
  }

  // Revalidate the cache for the spending page and redirect the user.
  revalidatePath('/dashboard/expenses');
  redirect('/dashboard/expenses');
}


const CreateCategory = FormSchema.omit({ date: true, amount: true, itemName:true, notes:true, categoryId:true });

export async function createCategory(prevState: State | undefined, formData: FormData){

  const validatedFields = CreateCategory.safeParse({
    category: formData.get('category'),
    userId: formData.get('userId')
  });


  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
      console.log(validatedFields.error.flatten().fieldErrors)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Add New Category.',
    };
  }

  // Prepare data for insertion into the database
  const { category, userId } = validatedFields.data;
  

  // Insert data into the database using Drizzle ORM
  try {
    await db.insert(schema.categories).values({
      userId: Number(userId),
      categoryName: category
    });
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Categories Entry.',error
    };
  }

  // Revalidate the cache for the spending page and redirect the user.
  revalidatePath('/dashboard/expenses');
  redirect('/dashboard/expenses');
}


const savingsSchema  = z.object({
  amount: z.coerce.string().refine((val) => !isNaN(parseAmount(val)) && parseAmount(val) > 0, {
    message: 'Please enter a valid amount greater than 0.',
  }),
  savingsId: z.coerce.number().int().positive({ message: 'Savings Goal is required.' }),
  userId: z.string()
  });
export async function createSavingsCategory(prevState: State | undefined, formData: FormData){

  const validatedFields = savingsSchema.safeParse({
    amount: formData.get('amount'),
    userId: formData.get('userId'),
    savingsId: formData.get('savingsId')
  });


  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
      console.log(validatedFields.error.flatten().fieldErrors)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Add New Saving.',
    };
  }

  // Prepare data for insertion into the database
  const { amount, savingsId, userId } = validatedFields.data;
  const amountDecimal = parseAmount(amount).toFixed(2);
  const date = new Date().toISOString().split('T')[0];

  // Insert data into the database using Drizzle ORM
  try {
    await db.insert(schema.savingsContributions).values({
      userId: Number(userId),
      goalId: Number(savingsId),
      amount: amountDecimal,
      date: date
    });
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Savings Entry.',error
    };
  }

  // Revalidate the cache for the spending page and redirect the user.
  revalidatePath('/dashboard/savings');
  redirect('/dashboard/savings');
}

const incomeSchema  = z.object({
  amount: z.coerce.string().refine((val) => !isNaN(parseAmount(val)) && parseAmount(val) > 0, {
    message: 'Please enter a valid amount greater than 0.',
  }),
 source: z.string().min(1, { message: 'Item name is required.' }),
  userId: z.string()
});

const savingGoalSchema  = z.object({
  amount: z.coerce.string().refine((val) => !isNaN(parseAmount(val)) && parseAmount(val) > 0, {
    message: 'Please enter a valid amount greater than 0.',
  }),
  savingsGoal: z.string().min(1, { message: 'Item name is required.' }),
  userId: z.string()
});

export async function createSavingsGoal(prevState: State | undefined, formData: FormData){
  const validatedFields = savingGoalSchema.safeParse({
    amount: formData.get('amount'),
    userId: formData.get('userId'),
    savingsGoal: formData.get('savingsGoal')
  });
  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
      console.log(validatedFields.error.flatten().fieldErrors)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Add New Saving.',
    };
  }
  // Prepare data for insertion into the database
  const { amount, userId, savingsGoal } = validatedFields.data;
  const amountDecimal = parseAmount(amount).toFixed(2);
  const date = new Date().toISOString().split('T')[0];
  // Insert data into the database using Drizzle ORM
  try {
    await db.insert(schema.savingsGoals).values({
      userId: Number(userId),
      goalName: savingsGoal,
      targetAmount: amountDecimal,
      deadline: date
    })
  }catch(error){
    return {
      message: 'Database Error: Failed to Create Savings Goal Entry.',error
    };
  }

  revalidatePath('/dashboard/savings');
  redirect('/dashboard/savings');
}

export async function createIncomeEntry(prevState: State | undefined, formData: FormData){

  const validatedFields = incomeSchema.safeParse({
    amount: formData.get('amount'),
    userId: formData.get('userId'),
    source: formData.get('source')
  });


  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
      console.log(validatedFields.error.flatten().fieldErrors)
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Add New Income.',
    };
  }

  // Prepare data for insertion into the database
  const { amount, source, userId } = validatedFields.data;
  const amountDecimal = parseAmount(amount).toFixed(2);
  const date = new Date().toISOString().split('T')[0];


  // Insert data into the database using Drizzle ORM
  try {
    await db.insert(schema.income).values({
      userId: Number(userId),
      source: source,
      amount: amountDecimal,
      type: 'One-off',
      date: date
    });
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: 'Database Error: Failed to Create Income Entry.',error
    };
  }

  // Revalidate the cache for the spending page and redirect the user.
  revalidatePath('/dashboard/income');
  redirect('/dashboard/income');
}



export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

const SignupSchema = z.object({
  firstName: z.string().min(2, "First Name must be at least 2 characters"),
  lastName: z.string().min(2, "Last Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export async function register(prevState: registerState | undefined, formData: FormData) {
  // Ensure prevState is always defined
 

  // Validate input fields
  const validatedFields = SignupSchema.safeParse({
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword')
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid input. Please check your form fields.',
    };
  }

  const { firstName, lastName, email, password } = validatedFields.data;

  try {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1)
      .execute();

    if (existingUser.length > 0) {
      return {  message: "User already exists" };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await db.insert(schema.users).values({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).execute();

    return {  message: "Registration successful log in now" };

  } catch (error) {
    console.error("Error during registration:", error);
    return {  message: "Something went wrong. Please try again later." };
  }
}


export async function deleteSpendingAction(id: number) {
  try {
    await deleteSpend(id);
    revalidatePath('/dashboard/expenses');
    return { message: 'Success' };
  } catch (error) {
    return { message: 'Error', error };
  }
}

export async function deleteIncomeAction(id: number) {
  try {
    await deleteIncome(id);
    revalidatePath('/dashboard/income');
    return { message: 'Success' };
  } catch (error) {
    return { message: 'Error', error };
  }
}