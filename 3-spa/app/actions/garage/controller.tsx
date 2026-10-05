import * as s from 'remix/data-schema'
import { createController } from 'remix/router'
import { redirect } from 'remix/response/redirect'

import { garageStore } from '../../middleware/garage.ts'
import { routes } from '../../routes.ts'
import { GaragePage } from './garage-page.tsx'
import {
  createCarSchema,
  deleteCarSchema,
  installPartSchema,
  inventoryCategory,
  removePartSchema,
} from './validation.ts'
import { WorkshopPage } from './workshop-page.tsx'

const installErrors = {
  incompatible: 'That combination does not fit. The Tempest V12 requires the Apex GT chassis.',
  'part-not-found': 'That part is no longer in the catalog.',
  'car-not-found': 'That car is no longer in the garage.',
} as const

export default createController(routes.garage, {
  actions: {
    async index(context) {
      let cars = await context.get(garageStore).getCars()
      return context.render(<GaragePage cars={cars} />, noStore())
    },

    async create(context) {
      let store = context.get(garageStore)
      let input = s.parseSafe(createCarSchema, context.get(FormData))
      if (!input.success) {
        return context.render(
          <GaragePage
            cars={await store.getCars()}
            error="Give the build a name and choose a chassis."
          />,
          noStore(422),
        )
      }
      let result = await store.createCar(input.value.name, input.value.chassisId)
      if (!result.ok) {
        return context.render(
          <GaragePage
            cars={await store.getCars()}
            name={input.value.name}
            error="Give the build a name and choose a chassis."
          />,
          noStore(422),
        )
      }
      return redirect(routes.garage.show.href({ carId: result.car.id, category: 'engine' }), 303)
    },

    async destroy(context) {
      let input = s.parseSafe(deleteCarSchema, context.get(FormData))
      if (!input.success) return new Response('Choose a car to sell.', { status: 422 })
      let store = context.get(garageStore)
      await store.deleteCar(input.value.carId)
      return redirect(routes.garage.index.href(), 303)
    },

    async show(context) {
      let category = inventoryCategory(context.params.category)
      if (!category.success) return new Response('Unknown inventory category', { status: 404 })
      let car = await context.get(garageStore).getCar(context.params.carId)
      if (!car) return new Response('Car not found', { status: 404 })
      let query = context.url.searchParams.get('q') ?? ''
      let errorCode = context.url.searchParams.get('error')
      let installError = errorCode === 'incompatible' ? installErrors.incompatible : undefined
      return context.render(
        <WorkshopPage
          car={car}
          category={category.value}
          query={query}
          installError={installError}
        />,
        noStore(),
      )
    },

    async install(context) {
      let category = inventoryCategory(context.params.category)
      if (!category.success) return new Response('Unknown inventory category', { status: 404 })
      let store = context.get(garageStore)
      let formData = context.get(FormData)
      let query = context.url.searchParams.get('q') ?? ''

      if (formData.get('intent') === 'remove') {
        let input = s.parseSafe(removePartSchema, formData)
        if (!input.success) {
          return new Response('Choose an optional part to remove.', { status: 422 })
        }
        let result = await store.removePart(context.params.carId, input.value.category)
        if (!result.ok) return new Response('Car not found', { status: 404 })
        return context.render(
          <WorkshopPage car={result.car} category={category.value} query={query} />,
          noStore(),
        )
      }

      let input = s.parseSafe(installPartSchema, formData)
      if (!input.success) return new Response('Choose a part to install.', { status: 422 })
      let result = await store.installPart(context.params.carId, input.value.partId)
      if (!result.ok && result.reason === 'car-not-found') {
        return new Response('Car not found', { status: 404 })
      }
      if (!result.ok) {
        let car = await store.getCar(context.params.carId)
        if (!car) return new Response('Car not found', { status: 404 })
        return context.render(
          <WorkshopPage
            car={car}
            category={category.value}
            query={query}
            installError={installErrors[result.reason]}
          />,
          noStore(422),
        )
      }
      return context.render(
        <WorkshopPage car={result.car} category={category.value} query={query} />,
        noStore(),
      )
    },
  },
})

function noStore(status = 200): ResponseInit {
  return { status, headers: { 'Cache-Control': 'no-store' } }
}
