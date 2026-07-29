CREATE TYPE "public"."space_file_status" AS ENUM('pending', 'uploading', 'paused', 'ready', 'failed', 'removed');--> statement-breakpoint
CREATE TYPE "public"."space_status" AS ENUM('draft', 'ready', 'shared', 'expired');--> statement-breakpoint
CREATE TABLE "share" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"space_id" uuid NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp (3) NOT NULL,
	"pin_hash" text NOT NULL,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "share_space_id_unique" UNIQUE("space_id"),
	CONSTRAINT "share_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "space_file" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"space_id" uuid NOT NULL,
	"original_name" text NOT NULL,
	"mime_type" text NOT NULL,
	"byte_size" integer NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"storage_key" text,
	"status" "space_file_status" DEFAULT 'pending' NOT NULL,
	"thumbnails_ready_at" timestamp (3),
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "space_file_storage_key_unique" UNIQUE("storage_key")
);
--> statement-breakpoint
CREATE TABLE "space" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "space_status" DEFAULT 'draft' NOT NULL,
	"author_key" text NOT NULL,
	"owner_user_id" text,
	"created_at" timestamp (3) DEFAULT now() NOT NULL,
	"updated_at" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "share" ADD CONSTRAINT "share_space_id_space_id_fk" FOREIGN KEY ("space_id") REFERENCES "public"."space"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "space_file" ADD CONSTRAINT "space_file_space_id_space_id_fk" FOREIGN KEY ("space_id") REFERENCES "public"."space"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "space_file_space_id_index" ON "space_file" USING btree ("space_id");