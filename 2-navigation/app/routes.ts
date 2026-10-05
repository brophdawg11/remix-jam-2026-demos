import { del, get, post, route } from 'remix/routes'

export const routes = route({
  home: get('/'),
  garage: route('/garage', {
    index: get(''),
    create: post(''),
    destroy: del(''),
    show: get('/:carId(/parts/:category)'),
    install: post('/:carId(/parts/:category)'),
  }),
})
