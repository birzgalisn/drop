ALTER TABLE "space_file" ADD COLUMN "thumb_key" text;--> statement-breakpoint
ALTER TABLE "space_file" ADD COLUMN "preview_key" text;--> statement-breakpoint
ALTER TABLE "space_file" DROP COLUMN "thumbnails_ready_at";
