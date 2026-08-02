CREATE TABLE "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"long_description" text,
	"category" text NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"technologies" text[] DEFAULT '{}' NOT NULL,
	"links" jsonb,
	"date" text NOT NULL,
	"images" text[] DEFAULT '{}',
	"key_features" text[] DEFAULT '{}',
	"impact" jsonb,
	"published" boolean DEFAULT true NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skill_categories" (
	"id" text PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"proficiency" integer NOT NULL,
	"color" text NOT NULL,
	"skills" text[] DEFAULT '{}' NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "timeline_items" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"title" text NOT NULL,
	"organization" text NOT NULL,
	"location" text NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text,
	"description" text[] DEFAULT '{}',
	"technologies" text[] DEFAULT '{}',
	"icon" text,
	"published" boolean DEFAULT true NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "projects_published_position_idx" ON "projects" USING btree ("published","position");--> statement-breakpoint
CREATE INDEX "skills_published_position_idx" ON "skill_categories" USING btree ("published","position");--> statement-breakpoint
CREATE INDEX "timeline_published_position_idx" ON "timeline_items" USING btree ("published","position");--> statement-breakpoint
CREATE INDEX "timeline_type_idx" ON "timeline_items" USING btree ("type");