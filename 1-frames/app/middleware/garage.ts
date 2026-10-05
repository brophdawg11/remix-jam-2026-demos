import { createContextKey, type Middleware } from 'remix/router'

import type { GarageStore } from '../data/garage-store.ts'

export const garageStore = createContextKey<GarageStore>()

export function loadGarage(store: GarageStore): Middleware<{
  key: typeof garageStore
  value: GarageStore
}> {
  return (context, next) => {
    context.set(garageStore, store)
    return next()
  }
}
