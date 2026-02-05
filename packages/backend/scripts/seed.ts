/**
 * Seed script for TalentX sample data.
 * Run from backend package: npm run seed
 * Uses DATABASE_URL from .env. All sample users have password: Password123!
 */
import { config } from 'dotenv';
config({ path: '.env' });

import { db } from '../src/db/client.js';
import { users, jobs, applications, invitations } from '../src/models/index.js';
import { hashPassword } from '../src/utils/password.js';

const SAMPLE_PASSWORD = 'Password123!';

async function seed() {
  const passwordHash = await hashPassword(SAMPLE_PASSWORD);

  const insertedUsers = await db
    .insert(users)
    .values([
      { name: 'Acme Corp HR', email: 'employer1@example.com', passwordHash, role: 'employer' },
      { name: 'DataFlow Inc', email: 'employer2@example.com', passwordHash, role: 'employer' },
      { name: 'Alex Chen', email: 'talent1@example.com', passwordHash, role: 'talent' },
      { name: 'Sam Rivera', email: 'talent2@example.com', passwordHash, role: 'talent' },
      { name: 'Jordan Lee', email: 'talent3@example.com', passwordHash, role: 'talent' },
    ])
    .returning({ id: users.id, email: users.email, role: users.role });

  const byEmail = new Map(insertedUsers.map((u) => [u.email, u]));
  const employer1 = byEmail.get('employer1@example.com')!;
  const employer2 = byEmail.get('employer2@example.com')!;
  const talent1 = byEmail.get('talent1@example.com')!;
  const talent2 = byEmail.get('talent2@example.com')!;
  const talent3 = byEmail.get('talent3@example.com')!;

  const deadline1 = new Date();
  deadline1.setDate(deadline1.getDate() + 30);
  const deadline2 = new Date();
  deadline2.setDate(deadline2.getDate() + 14);
  const deadline3 = new Date();
  deadline3.setDate(deadline3.getDate() + 7);

  const insertedJobs = await db
    .insert(jobs)
    .values([
      {
        title: 'Senior ML Engineer',
        techStack: 'Python, TensorFlow, PyTorch, MLOps',
        description: 'Build and deploy ML models. Experience with NLP and computer vision preferred.',
        deadline: deadline1,
        employerId: employer1.id,
        companyName: 'Acme Corp',
      },
      {
        title: 'Data Engineer',
        techStack: 'SQL, Python, Spark, Airflow, dbt',
        description: 'Design and maintain data pipelines. Strong SQL and ETL experience required.',
        deadline: deadline2,
        employerId: employer1.id,
        companyName: 'Acme Corp',
      },
      {
        title: 'AI Research Intern',
        techStack: 'Python, PyTorch, research',
        description: 'Support research team on LLM and retrieval systems. PhD or strong ML background.',
        deadline: deadline3,
        employerId: employer2.id,
        companyName: 'DataFlow Inc',
      },
    ])
    .returning({ id: jobs.id, title: jobs.title, employerId: jobs.employerId });

  const job1 = insertedJobs[0];
  const job2 = insertedJobs[1];
  const job3 = insertedJobs[2];

  await db.insert(applications).values([
    { jobId: job1.id, talentId: talent1.id, source: 'manual' },
    { jobId: job1.id, talentId: talent2.id, source: 'manual' },
    { jobId: job2.id, talentId: talent1.id, source: 'manual' },
    { jobId: job3.id, talentId: talent2.id, source: 'manual' },
  ]);

  await db.insert(invitations).values([
    { jobId: job1.id, talentId: talent3.id, status: 'pending' },
    { jobId: job2.id, talentId: talent3.id, status: 'accepted' },
  ]);

  console.log('Seed complete. Sample users (password: %s):', SAMPLE_PASSWORD);
  console.log('  Employers: employer1@example.com, employer2@example.com');
  console.log('  Talents:   talent1@example.com, talent2@example.com, talent3@example.com');
  console.log('  Jobs: %d, Applications: 4, Invitations: 2', insertedJobs.length);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
