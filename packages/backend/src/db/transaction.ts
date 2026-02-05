import { db } from './client.js';

export async function withTransaction<T>(
  fn: (_tx: Parameters<Parameters<typeof db.transaction>[0]>[0]) => Promise<T>
): Promise<T> {
  return db.transaction(fn);
}
