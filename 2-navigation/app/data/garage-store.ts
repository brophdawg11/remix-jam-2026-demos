import type { OptionalPartCategory, PartCategory } from './public/catalog.ts'

export type Car = {
  id: string
  name: string
  createdAt: number
  parts: Record<PartCategory, string | undefined>
}

export type CreateCarResult =
  | { ok: true; car: Car }
  | { ok: false; reason: 'invalid-name' | 'invalid-chassis' }

export type InstallPartResult =
  | { ok: true; car: Car }
  | { ok: false; reason: 'car-not-found' | 'part-not-found' | 'incompatible' }

export type RemovePartResult = { ok: true; car: Car } | { ok: false; reason: 'car-not-found' }

/** Persistence boundary shared by the server and a future localStorage SPA adapter. */
export interface GarageStore {
  getCars(): Promise<Car[]>
  getCar(carId: string): Promise<Car | undefined>
  createCar(name: string, chassisId: string): Promise<CreateCarResult>
  deleteCar(carId: string): Promise<void>
  installPart(carId: string, partId: string): Promise<InstallPartResult>
  removePart(carId: string, category: OptionalPartCategory): Promise<RemovePartResult>
}
