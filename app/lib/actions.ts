'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "@/app/db/schema";
import { AuthError } from 'next-auth';
import { signIn } from "@/auth"; // Your authentication logic
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import bcrypt from "bcrypt";
const db = drizzle({ schema });
;


export type State = {
  errors?: {
    amount?: string[];
    categoryId?: string[];
    itemName?: string[];
    notes?: string[];
    category?: string[],
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
  amount: z.coerce.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
     message: 'Please enter a valid amount greater than 0.',
   }),
  itemName: z.string().min(1, { message: 'Item name is required.' }),
  categoryId: z.coerce.number().int().positive({ message: 'Category ID is required.' }),
  notes: z.string().min(1, { message: "Notes needed" }).max(255, { message: "Notes must be at most 255 characters" }),
  date: z.string(),
  category: z.string().min(1, { message: 'Category name is required.' }),
  userId: z.string()
});
  
const CreateSpending = FormSchema.omit({ date: true, category:true });
  
export async function createSpending(prevState: State, formData: FormData) {


  // Validate form using Zod
  const validatedFields = CreateSpending.safeParse({
    amount: formData.get('amount'),
    itemName: formData.get('itemName'),
    categoryId: formData.get('categoryId'),
    notes: formData.get('notes'),
    userId: formData.get('userId')
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
  const { amount, itemName, categoryId, notes, userId } = validatedFields.data;
  const date = new Date().toISOString().split('T')[0];
  const amountDecimal = parseFloat(amount).toFixed(2);

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
      message: 'Database Error: Failed to Create Spending Entry.',
    };
  }

  // Revalidate the cache for the spending page and redirect the user.
  revalidatePath('/dashboard/spending');
  redirect('/dashboard/spending');
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
      message: 'Database Error: Failed to Create Categories Entry.',
    };
  }

  // Revalidate the cache for the spending page and redirect the user.
  revalidatePath('/dashboard/spending');
  redirect('/dashboard/spending');
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

    return {  message: "Registration successful" };

  } catch (error) {
    console.error("Error during registration:", error);
    return {  message: "Something went wrong. Please try again later." };
  }
}
