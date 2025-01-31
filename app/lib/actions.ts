'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "@/app/db/schema";
import { error } from 'console';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const db = drizzle({ schema });


export type State = {
    errors?: {
      amount?: string[];
      categoryId?: string[];
      itemName?: string[];
      notes?: string[];
    };
    message?: string | null;
  };
  
  const FormSchema = z.object({
    amount: z.coerce.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
        message: 'Please enter a valid amount greater than 0.',
      }),
    itemName: z.string().min(1, { message: 'Item name is required.' }),
    categoryId: z.coerce.number().int().positive({ message: 'Category ID is required.' }),
    notes: z.string().min(1, { message: "Notes needed" }).max(255, { message: "Notes must be at most 255 characters" }),
    date: z.string(),
  });
  
  const CreateSpending = FormSchema.omit({ date: true });
  
  export async function createSpending(prevState: State, formData: FormData) {
    // Validate form using Zod
    const validatedFields = CreateSpending.safeParse({
      amount: formData.get('amount'),
      itemName: formData.get('itemName'),
      categoryId: formData.get('categoryId'),
      notes: formData.get('notes'),
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
    const { amount, itemName, categoryId, notes } = validatedFields.data;
    const date = new Date().toISOString().split('T')[0];
    const amountDecimal = parseFloat(amount).toFixed(2);
  
    // Insert data into the database using Drizzle ORM
    try {
      await db.insert(schema.spending).values({
        amount: amountDecimal,
        itemName: itemName,
        categoryId: categoryId,
        userId: 1,
        date: date,
        notes: notes,
      });
    } catch (error) {
      // If a database error occurs, return a more specific error.
      return {
        message: 'Database Error: Failed to Create Spending Entry.',
      };
    }
  
    // Revalidate the cache for the spending page and redirect the user.
    revalidatePath('/dashboard/spending');
    redirect('/dashboard/spending');
  }

// users log in
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
  