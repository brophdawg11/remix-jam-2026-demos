import { del, get, post, route } from 'remix/routes'

export const routes = route({
  home: get('/'),
  garage: route('/garage', {
    index: get(''),
    create: post(''),
    destroy: del(''),
    show: get('/:carId(/parts/:category)'),
    search: get('/:carId/inventory-search'),
    build: get('/:carId/build'),
    updateBuild: post('/:carId/build'),
    install: post('/:carId(/parts/:category)'),
  }),
})
