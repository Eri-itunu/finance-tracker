ALTER TABLE "categories" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "spending" ADD COLUMN "is_deleted" boolean DEFAULT false NOT NULL;