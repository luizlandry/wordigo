ALTER TYPE "public"."type" ADD VALUE 'IELTS_READING';--> statement-breakpoint
ALTER TYPE "public"."type" ADD VALUE 'IELTS_WRITING';--> statement-breakpoint
ALTER TYPE "public"."type" ADD VALUE 'IELTS_LISTENING';--> statement-breakpoint
ALTER TYPE "public"."type" ADD VALUE 'IELTS_SPEAKING';--> statement-breakpoint
ALTER TYPE "public"."type" ADD VALUE 'IELTS_TFNG';--> statement-breakpoint
ALTER TABLE "challenges" ADD COLUMN "passage" text;--> statement-breakpoint
ALTER TABLE "challenges" ADD COLUMN "audio_src" text;--> statement-breakpoint
ALTER TABLE "lessons" ADD COLUMN "mode" text DEFAULT 'normal';