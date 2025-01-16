import {migrate} from "drizzle-orm/vercel-postgres/migrator";
import {db} from "@/app/db/db";

async function main() {
    await migrate(db, {migrationsFolder : "/drizzle"});
}

main();