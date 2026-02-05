import { pgTable, serial, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
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

export const schema = {
  users,
  sampleItems,
};
