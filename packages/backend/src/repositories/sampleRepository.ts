import { eq, sql } from 'drizzle-orm';
import { db } from '../db/client.js';
import { sampleItems } from '../models/index.js';

export async function findSampleItemById(id: number) {
  const result = await db
    .select()
    .from(sampleItems)
    .where(eq(sampleItems.id, id))
    .limit(1);

  return result[0] ?? null;
}

export async function createSampleItem(counter: number = 0) {
  const result = await db.insert(sampleItems).values({ counter }).returning();

  return result[0];
}

export async function updateSampleItemCounterAtomic(
  id: number,
  increment: number
) {
  const result = await db
    .update(sampleItems)
    .set({
      counter: sql`${sampleItems.counter} + ${increment}`,
    })
    .where(eq(sampleItems.id, id))
    .returning();

  if (result.length === 0) {
    throw new Error('Sample item not found');
  }

  return result[0];
}

export async function getSampleItemForUpdate(id: number) {
  const result = await db
    .select()
    .from(sampleItems)
    .where(eq(sampleItems.id, id))
    .for('update')
    .limit(1);

  return result[0] ?? null;
}
