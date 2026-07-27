CREATE TYPE "public"."application_status" AS ENUM('APPLIED', 'IN_REVIEW', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN');--> statement-breakpoint
CREATE TYPE "public"."employment_type" AS ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'TEMPORARY');--> statement-breakpoint
CREATE TYPE "public"."experience_level" AS ENUM('INTERN', 'ENTRY', 'MID', 'SENIOR', 'LEAD');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('DRAFT', 'PUBLISHED', 'CLOSED');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('CANDIDATE', 'EMPLOYER', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."work_mode" AS ENUM('ONSITE', 'HYBRID', 'REMOTE');--> statement-breakpoint
CREATE TABLE "applications" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"job_id" varchar(30) NOT NULL,
	"candidate_id" varchar(30) NOT NULL,
	"cover_letter" text,
	"resume_url" text,
	"status" "application_status" DEFAULT 'APPLIED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"owner_id" varchar(30) NOT NULL,
	"name" varchar(160) NOT NULL,
	"slug" varchar(200) NOT NULL,
	"website" text,
	"logo_url" text,
	"description" text,
	"location" varchar(160),
	"industry" varchar(120),
	"size" varchar(40),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"company_id" varchar(30) NOT NULL,
	"title" varchar(200) NOT NULL,
	"slug" varchar(240) NOT NULL,
	"description" text NOT NULL,
	"requirements" text,
	"location" varchar(160) NOT NULL,
	"work_mode" "work_mode" DEFAULT 'ONSITE' NOT NULL,
	"employment_type" "employment_type" DEFAULT 'FULL_TIME' NOT NULL,
	"experience_level" "experience_level" DEFAULT 'MID' NOT NULL,
	"salary_min" integer,
	"salary_max" integer,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"skills" text[] DEFAULT '{}' NOT NULL,
	"status" "job_status" DEFAULT 'DRAFT' NOT NULL,
	"published_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"user_id" varchar(30) NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "saved_jobs" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"job_id" varchar(30) NOT NULL,
	"user_id" varchar(30) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(30) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"name" varchar(120) NOT NULL,
	"role" "role" DEFAULT 'CANDIDATE' NOT NULL,
	"avatar_url" text,
	"headline" varchar(255),
	"location" varchar(160),
	"resume_url" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_candidate_id_users_id_fk" FOREIGN KEY ("candidate_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_jobs" ADD CONSTRAINT "saved_jobs_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_jobs" ADD CONSTRAINT "saved_jobs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "applications_job_candidate_key" ON "applications" USING btree ("job_id","candidate_id");--> statement-breakpoint
CREATE INDEX "applications_candidate_id_idx" ON "applications" USING btree ("candidate_id");--> statement-breakpoint
CREATE UNIQUE INDEX "companies_slug_key" ON "companies" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "companies_owner_id_key" ON "companies" USING btree ("owner_id");--> statement-breakpoint
CREATE UNIQUE INDEX "jobs_slug_key" ON "jobs" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "jobs_status_published_at_idx" ON "jobs" USING btree ("status","published_at");--> statement-breakpoint
CREATE INDEX "jobs_company_id_idx" ON "jobs" USING btree ("company_id");--> statement-breakpoint
CREATE UNIQUE INDEX "refresh_tokens_token_key" ON "refresh_tokens" USING btree ("token");--> statement-breakpoint
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "saved_jobs_job_user_key" ON "saved_jobs" USING btree ("job_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_key" ON "users" USING btree ("email");