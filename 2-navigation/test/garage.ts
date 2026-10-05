import { loadMigrations } from 'remix/data-table/migrations/node'
import { createSqliteDatabase } from 'remix/data-table/sqlite'

import type { GarageStore } from '../app/data/garage-store.ts'
import { createSqliteGarageStore } from '../app/data/sqlite-store.ts'

export async function createTestGarage(): Promise<{ store: GarageStore; close(): Promise<void> }> {
  let db = createSqliteDatabase({ filename: ':memory:', foreignKeys: true })
  try {
    await db.migrate(await loadMigrations(new URL('../db/migrations', import.meta.url).pathname))
  } catch (error) {
    await db.close()
    throw error
  }
  return { store: createSqliteGarageStore(db), close: () => db.close() }
}
