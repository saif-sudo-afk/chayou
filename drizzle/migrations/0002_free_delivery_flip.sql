ALTER TABLE "store_settings" RENAME COLUMN "delivery_fee_enabled" TO "free_delivery_enabled";
--> statement-breakpoint
UPDATE "store_settings"
SET "free_delivery_enabled" = NOT "free_delivery_enabled";
--> statement-breakpoint
ALTER TABLE "store_settings" ALTER COLUMN "free_delivery_enabled" SET DEFAULT true;
