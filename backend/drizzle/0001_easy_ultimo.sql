CREATE TYPE "public"."activity_kind" AS ENUM('VIEW', 'STAGE', 'MESSAGE', 'MATCH', 'INVITE');--> statement-breakpoint
CREATE TYPE "public"."alert_frequency" AS ENUM('INSTANT', 'DAILY', 'WEEKLY');--> statement-breakpoint
CREATE TYPE "public"."application_source" AS ENUM('DIRECT', 'REFERRAL', 'JOB_ALERT', 'RECRUITER');--> statement-breakpoint
CREATE TYPE "public"."interview_mode" AS ENUM('VIDEO', 'PHONE', 'ONSITE');--> statement-breakpoint
CREATE TYPE "public"."interview_status" AS ENUM('CONFIRMED', 'AWAITING', 'COMPLETED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."saved_folder" AS ENUM('SHORTLIST', 'MAYBE', 'RESEARCHING');--> statement-breakpoint
CREATE TABLE "activity_items" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"user_id" varchar(30) NOT NULL,
	"kind" "activity_kind" NOT NULL,
	"title" varchar(240) NOT NULL,
	"detail" varchar(400),
	"href" varchar(240),
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "application_events" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"application_id" varchar(30) NOT NULL,
	"status" "application_status" NOT NULL,
	"note" varchar(400),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "candidate_profiles" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"user_id" varchar(30) NOT NULL,
	"bio" text,
	"phone" varchar(40),
	"website" varchar(200),
	"github" varchar(200),
	"linkedin" varchar(200),
	"skills" text[] DEFAULT '{}' NOT NULL,
	"languages" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"desired_role" varchar(200),
	"salary_expectation" integer,
	"currency" varchar(3) DEFAULT 'EUR' NOT NULL,
	"preferred_work_mode" "work_mode",
	"notice_period" varchar(40),
	"open_to_work" boolean DEFAULT true NOT NULL,
	"will_relocate" boolean DEFAULT false NOT NULL,
	"searchable" boolean DEFAULT true NOT NULL,
	"hidden_from_company_ids" text[] DEFAULT '{}' NOT NULL,
	"show_salary_expectation" boolean DEFAULT false NOT NULL,
	"profile_views" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_follows" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"user_id" varchar(30) NOT NULL,
	"company_id" varchar(30) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_profiles" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"company_id" varchar(30) NOT NULL,
	"tagline" varchar(240),
	"about" text,
	"founded" varchar(10),
	"funding" varchar(60),
	"rating" integer DEFAULT 0 NOT NULL,
	"benefits" text[] DEFAULT '{}' NOT NULL,
	"values" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"offices" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"metrics" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"rating_breakdown" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_reviews" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"company_id" varchar(30) NOT NULL,
	"author_id" varchar(30),
	"title" varchar(200) NOT NULL,
	"body" text NOT NULL,
	"rating" integer NOT NULL,
	"role_title" varchar(160),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "company_team_members" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"company_id" varchar(30) NOT NULL,
	"name" varchar(120) NOT NULL,
	"role" varchar(160) NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "connected_accounts" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"user_id" varchar(30) NOT NULL,
	"provider" varchar(60) NOT NULL,
	"connected" boolean DEFAULT false NOT NULL,
	"connected_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "educations" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"user_id" varchar(30) NOT NULL,
	"school" varchar(200) NOT NULL,
	"degree" varchar(240) NOT NULL,
	"start_year" integer,
	"end_year" integer,
	"detail" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "experiences" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"user_id" varchar(30) NOT NULL,
	"role" varchar(200) NOT NULL,
	"company" varchar(160) NOT NULL,
	"location" varchar(160),
	"start_date" timestamp with time zone NOT NULL,
	"end_date" timestamp with time zone,
	"current" boolean DEFAULT false NOT NULL,
	"summary" text,
	"highlights" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hiring_process_steps" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"company_id" varchar(30) NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"step" varchar(160) NOT NULL,
	"detail" text NOT NULL,
	"duration" varchar(60)
);
--> statement-breakpoint
CREATE TABLE "interviews" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"application_id" varchar(30) NOT NULL,
	"round" varchar(160) NOT NULL,
	"scheduled_at" timestamp with time zone NOT NULL,
	"duration_mins" integer DEFAULT 45 NOT NULL,
	"mode" "interview_mode" DEFAULT 'VIDEO' NOT NULL,
	"interviewer_name" varchar(120),
	"interviewer_title" varchar(160),
	"status" "interview_status" DEFAULT 'AWAITING' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_alerts" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"user_id" varchar(30) NOT NULL,
	"query" varchar(200) NOT NULL,
	"location" varchar(160),
	"frequency" "alert_frequency" DEFAULT 'DAILY' NOT NULL,
	"channels" text[] DEFAULT '{"EMAIL"}' NOT NULL,
	"filters" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"matches_total" integer DEFAULT 0 NOT NULL,
	"last_sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "message_threads" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"subject" varchar(240) NOT NULL,
	"candidate_id" varchar(30) NOT NULL,
	"company_id" varchar(30) NOT NULL,
	"job_id" varchar(30),
	"starred_by_candidate" boolean DEFAULT false NOT NULL,
	"archived_by_candidate" boolean DEFAULT false NOT NULL,
	"last_message_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"thread_id" varchar(30) NOT NULL,
	"sender_id" varchar(30) NOT NULL,
	"body" text NOT NULL,
	"read_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_preferences" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"user_id" varchar(30) NOT NULL,
	"key" varchar(60) NOT NULL,
	"email" boolean DEFAULT true NOT NULL,
	"push" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resumes" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"user_id" varchar(30) NOT NULL,
	"name" varchar(200) NOT NULL,
	"url" text NOT NULL,
	"size_bytes" integer DEFAULT 0 NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"used_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_searches" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"user_id" varchar(30) NOT NULL,
	"name" varchar(160) NOT NULL,
	"params" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"last_run_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "source" "application_source" DEFAULT 'DIRECT' NOT NULL;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "next_step" varchar(240);--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "salary_expectation" integer;--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "available_from" varchar(60);--> statement-breakpoint
ALTER TABLE "applications" ADD COLUMN "last_activity_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "summary" varchar(400);--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "responsibilities" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "nice_to_have" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "equity" varchar(60);--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "urgent" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "easy_apply" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "responds_in_days" integer;--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "view_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "saved_jobs" ADD COLUMN "folder" "saved_folder" DEFAULT 'SHORTLIST' NOT NULL;--> statement-breakpoint
ALTER TABLE "saved_jobs" ADD COLUMN "note" varchar(500);--> statement-breakpoint
ALTER TABLE "activity_items" ADD CONSTRAINT "activity_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_events" ADD CONSTRAINT "application_events_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "candidate_profiles" ADD CONSTRAINT "candidate_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_follows" ADD CONSTRAINT "company_follows_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_follows" ADD CONSTRAINT "company_follows_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_profiles" ADD CONSTRAINT "company_profiles_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_reviews" ADD CONSTRAINT "company_reviews_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_reviews" ADD CONSTRAINT "company_reviews_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_team_members" ADD CONSTRAINT "company_team_members_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "connected_accounts" ADD CONSTRAINT "connected_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "educations" ADD CONSTRAINT "educations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "experiences" ADD CONSTRAINT "experiences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hiring_process_steps" ADD CONSTRAINT "hiring_process_steps_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interviews" ADD CONSTRAINT "interviews_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_alerts" ADD CONSTRAINT "job_alerts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_threads" ADD CONSTRAINT "message_threads_candidate_id_users_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_threads" ADD CONSTRAINT "message_threads_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "message_threads" ADD CONSTRAINT "message_threads_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_thread_id_message_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."message_threads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_preferences" ADD CONSTRAINT "notification_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_searches" ADD CONSTRAINT "saved_searches_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "activity_items_user_id_idx" ON "activity_items" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "application_events_application_id_idx" ON "application_events" USING btree ("application_id");--> statement-breakpoint
CREATE UNIQUE INDEX "candidate_profiles_user_id_key" ON "candidate_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "company_follows_user_company_key" ON "company_follows" USING btree ("user_id","company_id");--> statement-breakpoint
CREATE UNIQUE INDEX "company_profiles_company_id_key" ON "company_profiles" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "company_reviews_company_id_idx" ON "company_reviews" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "company_team_members_company_id_idx" ON "company_team_members" USING btree ("company_id");--> statement-breakpoint
CREATE UNIQUE INDEX "connected_accounts_user_provider_key" ON "connected_accounts" USING btree ("user_id","provider");--> statement-breakpoint
CREATE INDEX "educations_user_id_idx" ON "educations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "experiences_user_id_idx" ON "experiences" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "hiring_process_steps_company_id_idx" ON "hiring_process_steps" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "interviews_application_id_idx" ON "interviews" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX "job_alerts_user_id_idx" ON "job_alerts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "message_threads_candidate_id_idx" ON "message_threads" USING btree ("candidate_id");--> statement-breakpoint
CREATE INDEX "message_threads_company_id_idx" ON "message_threads" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "messages_thread_id_idx" ON "messages" USING btree ("thread_id");--> statement-breakpoint
CREATE UNIQUE INDEX "notification_preferences_user_key" ON "notification_preferences" USING btree ("user_id","key");--> statement-breakpoint
CREATE INDEX "resumes_user_id_idx" ON "resumes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "saved_searches_user_id_idx" ON "saved_searches" USING btree ("user_id");