import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './app/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgres://neondb_owner:gxs7Gbwz4VZQ@ep-rapid-frog-a593iyds-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require",
  },
});
