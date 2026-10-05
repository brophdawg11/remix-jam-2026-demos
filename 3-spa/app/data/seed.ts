import type { Car } from './garage-store.ts'

export function createSeedCars(): Car[] {
  let now = Date.now()
  return [
    {
      id: 'midnight-special',
      name: 'Midnight Special',
      createdAt: now - 7200000,
      parts: {
        chassis: 'chassis-apex',
        engine: 'engine-v8',
        paint: 'paint-apex-blue',
        tires: 'tires-track',
        spoiler: 'spoiler-ducktail',
        hood: 'hood-vented',
      },
    },
    {
      id: 'weekend-sprint',
      name: 'Weekend Sprint',
      createdAt: now - 3600000,
      parts: {
        chassis: 'chassis-sprint',
        engine: 'engine-i4',
        paint: 'paint-paddock-green',
        tires: 'tires-street',
        spoiler: undefined,
        hood: 'hood-smooth',
      },
    },
  ]
}
