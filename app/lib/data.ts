import {  sql } from '@vercel/postgres';
import {drizzle} from "drizzle-orm/vercel-postgres";
import * as schema from "@/app/db/schema";

const db = drizzle({ schema });

export async function fetchSavings() {
    try {
       const results = await db.query.users.findFirst()
       console.log(results)
      } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch user data.');
      }
}