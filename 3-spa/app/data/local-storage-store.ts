import * as s from 'remix/data-schema'

import type {
  Car,
  CreateCarResult,
  GarageStore,
  InstallPartResult,
  RemovePartResult,
} from './garage-store.ts'
import { getPart, type PartCategory } from './public/catalog.ts'
import { createSeedCars } from './seed.ts'

const storageKey = 'remix-garage:cars:v1'
const carsSchema = s
  .array(
    s.object({
      id: s.string().refine((id) => id.length > 0 && id.length <= 100),
      name: s.string().refine((name) => name.trim().length >= 2 && name.length <= 40),
      createdAt: s.number().refine((value) => Number.isSafeInteger(value) && value >= 0),
      parts: s
        .object({
          chassis: partId('chassis'),
          engine: s.optional(partId('engine')),
          paint: s.optional(partId('paint')),
          tires: s.optional(partId('tires')),
          spoiler: s.optional(partId('spoiler')),
          hood: s.optional(partId('hood')),
        })
        .refine((parts) => parts.engine !== 'engine-v12' || parts.chassis === 'chassis-apex'),
    }),
  )
  .refine((cars) => new Set(cars.map((car) => car.id)).size === cars.length)

function partId(category: PartCategory) {
  return s.string().refine((id) => getPart(id)?.category === category)
}

export async function createLocalStorageGarageStore(storage: Storage): Promise<GarageStore> {
  await navigator.locks.request(storageKey, () => {
    if (storage.getItem(storageKey) === null) write(createSeedCars())
    read()
  })

  return {
    async getCars() {
      await simulateLatency()
      return read().sort((a, b) => b.createdAt - a.createdAt || a.id.localeCompare(b.id))
    },

    async getCar(carId) {
      await simulateLatency()
      return read().find((car) => car.id === carId)
    },

    async createCar(name, chassisId) {
      await simulateLatency()
      name = name.trim()
      if (name.length < 2 || name.length > 40) return { ok: false, reason: 'invalid-name' }
      let chassis = getPart(chassisId)
      if (chassis?.category !== 'chassis') return { ok: false, reason: 'invalid-chassis' }

      return navigator.locks.request(storageKey, (): CreateCarResult => {
        let cars = read()
        let car: Car = {
          id: crypto.randomUUID(),
          name,
          createdAt: Date.now(),
          parts: {
            chassis: chassis.id,
            engine: undefined,
            paint: 'paint-redline',
            tires: undefined,
            spoiler: undefined,
            hood: undefined,
          },
        }
        cars.push(car)
        write(cars)
        return { ok: true, car }
      })
    },

    async deleteCar(carId) {
      await simulateLatency()
      await navigator.locks.request(storageKey, () => {
        write(read().filter((car) => car.id !== carId))
      })
    },

    async installPart(carId, partId) {
      await simulateLatency()
      return navigator.locks.request(storageKey, (): InstallPartResult => {
        let cars = read()
        let car = cars.find((car) => car.id === carId)
        let part = getPart(partId)
        if (!car) return { ok: false, reason: 'car-not-found' }
        if (!part) return { ok: false, reason: 'part-not-found' }
        if (
          (part.id === 'engine-v12' && car.parts.chassis !== 'chassis-apex') ||
          (part.id === 'chassis-sprint' && car.parts.engine === 'engine-v12')
        )
          return { ok: false, reason: 'incompatible' }

        car.parts[part.category] = part.id
        write(cars)
        return { ok: true, car }
      })
    },

    async removePart(carId, category) {
      await simulateLatency()
      return navigator.locks.request(storageKey, (): RemovePartResult => {
        let cars = read()
        let car = cars.find((car) => car.id === carId)
        if (!car) return { ok: false, reason: 'car-not-found' }
        car.parts[category] = undefined
        write(cars)
        return { ok: true, car }
      })
    },
  }

  function read(): Car[] {
    let saved = storage.getItem(storageKey)
    if (saved === null) throw new Error('Saved builds are missing. Reload to start again.')
    return s.parse(carsSchema, JSON.parse(saved)).map((car) => ({
      ...car,
      parts: {
        chassis: car.parts.chassis,
        engine: car.parts.engine,
        paint: car.parts.paint,
        tires: car.parts.tires,
        spoiler: car.parts.spoiler,
        hood: car.parts.hood,
      },
    }))
  }

  function write(cars: Car[]): void {
    storage.setItem(storageKey, JSON.stringify(cars))
  }
}

function simulateLatency(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 250 + Math.random() * 750))
}
