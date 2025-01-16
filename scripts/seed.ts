import bycrypt from 'bcrypt';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { categoriesData, incomeData, savingsData, savingsProgressData, spendingData  } from '@/app/db/placeholder';
import { categories, spending, income } from '@/app/db/schema';
import { addCategory, addContributions, addIncome, addSavingGoal, addSpend } from '@/app/db/db';


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool);

async function main(){
  // Insert example user
  // usersData.map(async (user) => {
  //   user.password = await bycrypt.hash(user.password, 10);
  //   const res = insertUser(user);
  //   console.log("insert succes" , res);
  //   process.exit;
  // });

  //Insert default categories
  categoriesData.map(async (category) => {
    const res = await addCategory(category);

    console.log("insert success", res);
  });
 


  //Insert example income
  incomeData.map(async (userIncome) => {
    const res =  await addIncome(userIncome);

    console.log("insert success", res);
  });

  //Insert example spending      
  spendingData.map(async (userSpending) => {
    const res =  await addSpend(userSpending);

    console.log("insert success", res);
  });

  //Insert example savings
  savingsData.map(async (userSaving) => {
    const res = await addSavingGoal(userSaving);

    console.log("insert success", res);
  });

  //Insert example savings progress
  savingsProgressData.map(async (userSavingProgress) => {
    const res = await addContributions(userSavingProgress);

    console.log("insert success", res);
  });

  process.exit;

}

main()
  

 



// Insert default categories
// categoriesData.map(async (category) => {
//     await db.insert(categories).values(category).returning();
//   });

  // Insert example income
//   incomeData.map(async (userIncome) => {
//       await db.insert(income).values(userIncome).returning();
//   });

  // Insert example spending      
//   spendingData.map(async (userSpending) => {
//       await db.insert(spending).values(userSpending).returning();
//   });