import * as path from 'node:path'
import { loadMigrations } from 'remix/data-table/migrations/node'
import { createSqliteDatabase } from 'remix/data-table/sqlite'

import { createSqliteGarageStore } from './sqlite-store.ts'

export async function openGarageDatabase() {
  let directory = path.resolve(import.meta.dirname, '../../db')
  let db = createSqliteDatabase({
    filename: path.join(directory, 'garage.sqlite'),
    foreignKeys: true,
  })
  try {
    await db.migrate(await loadMigrations(path.join(directory, 'migrations')))
  } catch (error) {
    await db.close()
    throw error
  }
  return { store: createSqliteGarageStore(db), close: () => db.close() }
}
