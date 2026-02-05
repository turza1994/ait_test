import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().default('User'),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('user'),
  refreshTokenHash: text('refresh_token_hash'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const sampleItems = pgTable('sample_items', {
  id: serial('id').primaryKey(),
  counter: integer('counter').notNull().default(0),
});

export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  techStack: text('tech_stack').notNull(),
  description: text('description').notNull(),
  deadline: timestamp('deadline').notNull(),
  employerId: integer('employer_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  companyName: text('company_name').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const applications = pgTable(
  'applications',
  {
    id: serial('id').primaryKey(),
    jobId: integer('job_id')
      .notNull()
      .references(() => jobs.id, { onDelete: 'cascade' }),
    talentId: integer('talent_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    source: text('source').notNull(), // 'manual' | 'invitation'
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('applications_job_id_talent_id_unique').on(
      table.jobId,
      table.talentId
    ),
  ]
);

export const invitations = pgTable(
  'invitations',
  {
    id: serial('id').primaryKey(),
    jobId: integer('job_id')
      .notNull()
      .references(() => jobs.id, { onDelete: 'cascade' }),
    talentId: integer('talent_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    status: text('status').notNull(), // 'pending' | 'accepted' | 'declined'
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('invitations_job_id_talent_id_unique').on(
      table.jobId,
      table.talentId
    ),
  ]
);

export const schema = {
  users,
  sampleItems,
  jobs,
  applications,
  invitations,
};
