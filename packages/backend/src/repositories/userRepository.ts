import { eq } from 'drizzle-orm';
import { db } from '../db/client.js';
import { users } from '../models/index.js';

export async function findUserByEmail(email: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return result[0] ?? null;
}

export async function findUserById(id: number) {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result[0] ?? null;
}

export async function createUser(
  email: string,
  passwordHash: string,
  name: string,
  role: string
) {
  const result = await db
    .insert(users)
    .values({
      email,
      passwordHash,
      name,
      role,
    })
    .returning();

  return result[0];
}

export async function updateUserRefreshToken(
  userId: number,
  refreshTokenHash: string | null
) {
  const result = await db
    .update(users)
    .set({ refreshTokenHash })
    .where(eq(users.id, userId))
    .returning();

  if (result.length === 0) {
    throw new Error('User not found');
  }

  return result[0];
}

export async function updateUserRefreshTokenForLock(
  userId: number,
  refreshTokenHash: string | null
) {
  const result = await db
    .update(users)
    .set({ refreshTokenHash })
    .where(eq(users.id, userId))
    .returning();

  if (result.length === 0) {
    throw new Error('User not found');
  }

  return result[0];
}

export async function listTalents() {
  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
    })
    .from(users)
    .where(eq(users.role, 'talent'));
}
