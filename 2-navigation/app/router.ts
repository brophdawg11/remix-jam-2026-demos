import { formData } from 'remix/middleware/form-data'
import { methodOverride } from 'remix/middleware/method-override'
import type { render } from 'remix/middleware/render'
import { createRouter, type MiddlewareContext, type RouterOptions } from 'remix/router'

import rootController from './actions/controller.tsx'
import garageController from './actions/garage/controller.tsx'
import type { GarageStore } from './data/garage-store.ts'
import { loadGarage } from './middleware/garage.ts'
import { routes } from './routes.ts'

type AppContext = MiddlewareContext<
  [ReturnType<typeof loadGarage>, ReturnType<typeof formData>, ReturnType<typeof render>]
>

interface GarageRouterOptions {
  render: ReturnType<typeof render>
  middleware?: RouterOptions['middleware']
}

declare module 'remix/router' {
  interface RouterTypes {
    context: AppContext
  }
}

export function createGarageRouter(store: GarageStore, options: GarageRouterOptions) {
  let router = createRouter<AppContext>({
    middleware: [
      ...(options.middleware ?? []),
      options.render,
      formData(),
      methodOverride(),
      loadGarage(store),
    ],
  })
  router.map(routes, rootController)
  router.map(routes.garage, garageController)
  return router
}
