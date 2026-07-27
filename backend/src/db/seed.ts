import bcrypt from "bcryptjs";
import { client, db } from "@/db";
import { applications, companies, jobs, savedJobs, users } from "@/db/schema";
import { uniqueSlug } from "@/utils/id";

async function seed() {
  await db.delete(savedJobs);
  await db.delete(applications);
  await db.delete(jobs);
  await db.delete(companies);
  await db.delete(users);

  const passwordHash = await bcrypt.hash("password123", 12);

  const [employer, candidate] = await db
    .insert(users)
    .values([
      {
        name: "Ava Mercer",
        email: "employer@hireloop.dev",
        passwordHash,
        role: "EMPLOYER",
        location: "Bengaluru, IN",
      },
      {
        name: "Rohan Patel",
        email: "candidate@hireloop.dev",
        passwordHash,
        role: "CANDIDATE",
        headline: "Full-stack engineer",
        location: "Pune, IN",
      },
    ])
    .returning();

  const [company] = await db
    .insert(companies)
    .values({
      ownerId: employer!.id,
      name: "Northwind Labs",
      slug: uniqueSlug("Northwind Labs"),
      website: "https://northwind.example.com",
      description: "We build developer tooling for distributed teams.",
      location: "Bengaluru, IN",
      industry: "Software",
      size: "51-200",
    })
    .returning();

  const inserted = await db
    .insert(jobs)
    .values([
      {
        companyId: company!.id,
        title: "Senior Backend Engineer",
        slug: uniqueSlug("Senior Backend Engineer"),
        description:
          "Own the design and delivery of our core API platform, from schema design to rollout.",
        requirements: "5+ years with Node.js, PostgreSQL and distributed systems.",
        location: "Bengaluru, IN",
        workMode: "HYBRID",
        employmentType: "FULL_TIME",
        experienceLevel: "SENIOR",
        salaryMin: 3500000,
        salaryMax: 5000000,
        currency: "INR",
        skills: ["node.js", "typescript", "postgresql", "drizzle"],
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
      {
        companyId: company!.id,
        title: "Frontend Engineer, Design Systems",
        slug: uniqueSlug("Frontend Engineer Design Systems"),
        description:
          "Build and maintain the component library powering every surface of our product.",
        requirements: "Strong React and accessibility fundamentals.",
        location: "Remote",
        workMode: "REMOTE",
        employmentType: "FULL_TIME",
        experienceLevel: "MID",
        salaryMin: 2200000,
        salaryMax: 3200000,
        currency: "INR",
        skills: ["react", "next.js", "tailwind", "accessibility"],
        status: "PUBLISHED",
        publishedAt: new Date(),
      },
      {
        companyId: company!.id,
        title: "Product Design Intern",
        slug: uniqueSlug("Product Design Intern"),
        description: "Work alongside our design team on end-to-end product flows.",
        location: "Pune, IN",
        workMode: "ONSITE",
        employmentType: "INTERNSHIP",
        experienceLevel: "INTERN",
        skills: ["figma", "user research"],
        status: "DRAFT",
      },
    ])
    .returning();

  await db.insert(applications).values({
    jobId: inserted[0]!.id,
    candidateId: candidate!.id,
    coverLetter: "I have shipped three large Node.js platforms and would love to talk.",
    status: "IN_REVIEW",
  });

  await db.insert(savedJobs).values({
    jobId: inserted[1]!.id,
    userId: candidate!.id,
  });

  console.log("Seed complete: 2 users, 1 company, 3 jobs");
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => client.end());
