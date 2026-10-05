import { createController } from 'remix/router'
import { redirect } from 'remix/response/redirect'

import { routes } from '../routes.ts'

export default createController(routes, {
  actions: {
    home() {
      return redirect(routes.garage.index.href())
    },
  },
})
