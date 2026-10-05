import type { Database, TableRow } from 'remix/data-table'

import type { Car, GarageStore } from './garage-store.ts'
import { getPart } from './public/catalog.ts'
import { cars } from './schema.ts'

export function createSqliteGarageStore(db: Database): GarageStore {
  return {
    async getCars() {
      await simulateLatency()
      let rows = await db.findMany(cars, { orderBy: ['created_at', 'desc'] })
      return rows.map(toCar)
    },

    async getCar(carId) {
      await simulateLatency()
      let row = await db.find(cars, carId)
      return row ? toCar(row) : undefined
    },

    async createCar(name, chassisId) {
      await simulateLatency()
      name = name.trim()
      if (name.length < 2 || name.length > 40) return { ok: false, reason: 'invalid-name' }
      let chassis = getPart(chassisId)
      if (chassis?.category !== 'chassis') return { ok: false, reason: 'invalid-chassis' }

      let row = await db.create(
        cars,
        {
          id: crypto.randomUUID(),
          name,
          created_at: Date.now(),
          chassis_id: chassis.id,
          paint_id: 'paint-redline',
        },
        { returnRow: true },
      )
      return { ok: true, car: toCar(row) }
    },

    async deleteCar(carId) {
      await simulateLatency()
      await db.delete(cars, carId)
    },

    async installPart(carId, partId) {
      await simulateLatency()
      let row = await db.find(cars, carId)
      let part = getPart(partId)
      if (!row) return { ok: false, reason: 'car-not-found' }
      if (!part) return { ok: false, reason: 'part-not-found' }
      if (
        (part.id === 'engine-v12' && row.chassis_id !== 'chassis-apex') ||
        (part.id === 'chassis-sprint' && row.engine_id === 'engine-v12')
      ) {
        return { ok: false, reason: 'incompatible' }
      }

      let changes =
        part.category === 'chassis'
          ? { chassis_id: part.id }
          : part.category === 'engine'
            ? { engine_id: part.id }
            : part.category === 'paint'
              ? { paint_id: part.id }
              : part.category === 'tires'
                ? { tires_id: part.id }
                : part.category === 'spoiler'
                  ? { spoiler_id: part.id }
                  : { hood_id: part.id }
      let updated = await db.update(cars, carId, changes)
      return { ok: true, car: toCar(updated) }
    },

    async removePart(carId, category) {
      await simulateLatency()
      let row = await db.find(cars, carId)
      if (!row) return { ok: false, reason: 'car-not-found' }
      let changes = category === 'spoiler' ? { spoiler_id: null } : { hood_id: null }
      let updated = await db.update(cars, carId, changes)
      return { ok: true, car: toCar(updated) }
    },
  }
}

type CarRow = TableRow<typeof cars>

function toCar(row: CarRow): Car {
  return {
    id: String(row.id),
    name: String(row.name),
    createdAt: Number(row.created_at),
    parts: {
      chassis: String(row.chassis_id),
      engine: optionalString(row.engine_id),
      paint: optionalString(row.paint_id),
      tires: optionalString(row.tires_id),
      spoiler: optionalString(row.spoiler_id),
      hood: optionalString(row.hood_id),
    },
  }
}

function optionalString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function simulateLatency(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 300))
}
