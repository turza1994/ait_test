import {
  findSampleItemById,
  updateSampleItemCounterAtomic,
} from '../repositories/sampleRepository.js';
import { withTransaction } from '../db/transaction.js';
import { eq } from 'drizzle-orm';
import { sampleItems } from '../models/index.js';

export async function getSampleItem(id: number) {
  const item = await findSampleItemById(id);
  if (!item) {
    throw new Error('Sample item not found');
  }
  return item;
}

export async function incrementSampleItemCounterAtomic(
  id: number,
  increment: number
) {
  return updateSampleItemCounterAtomic(id, increment);
}

export async function incrementSampleItemCounterWithLock(
  id: number,
  increment: number
) {
  return withTransaction(async (tx) => {
    const item = await tx
      .select()
      .from(sampleItems)
      .where(eq(sampleItems.id, id))
      .for('update')
      .limit(1);

    if (item.length === 0) {
      throw new Error('Sample item not found');
    }

    const currentItem = item[0]!;
    const newCounter = currentItem.counter + increment;

    const updated = await tx
      .update(sampleItems)
      .set({ counter: newCounter })
      .where(eq(sampleItems.id, id))
      .returning();

    if (updated.length === 0) {
      throw new Error('Failed to update sample item');
    }

    return updated[0]!;
  });
}
