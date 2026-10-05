import * as assert from 'remix/assert'
import { describe, it } from 'remix/test'

import { createTestGarage } from '../../../test/garage.ts'
import { renderDocument } from '../../middleware/document.tsx'
import { createGarageRouter } from '../../router.ts'
import { routes } from '../../routes.ts'

describe('part installation route', () => {
  it('rejects a V12 on a Sprint chassis without changing the saved car', async (t) => {
    let { store, close } = await createTestGarage()
    t.after(close)
    let router = createGarageRouter(store, { render: renderDocument() })
    let car = await store.getCar('weekend-sprint')
    assert.ok(car)
    assert.equal(car.parts.chassis, 'chassis-sprint')
    assert.equal(car.parts.engine, 'engine-i4')

    let response = await router.fetch(
      new URL(
        routes.garage.install.href({ carId: car.id, category: 'engine' }),
        'http://garage.test',
      ),
      { method: 'POST', body: new URLSearchParams({ partId: 'engine-v12' }) },
    )

    assert.equal(response.status, 422)
    assert.equal(response.headers.get('Location'), null)
    assert.match(await response.text(), /That combination does not fit/)
    assert.deepEqual(await store.getCar(car.id), car)
  })

  it('renders the updated workshop in the installation response', async (t) => {
    let { store, close } = await createTestGarage()
    t.after(close)
    let router = createGarageRouter(store, { render: renderDocument() })
    let car = await store.getCar('weekend-sprint')
    assert.ok(car)

    let response = await router.fetch(
      new URL(
        routes.garage.install.href({ carId: car.id, category: 'engine' }),
        'http://garage.test',
      ),
      { method: 'POST', body: new URLSearchParams({ partId: 'engine-v8' }) },
    )

    assert.equal(response.status, 200)
    assert.equal(response.headers.get('Location'), null)
    assert.match(await response.text(), /Engines<\/dt><dd><strong>Foundry V8/)
    assert.equal((await store.getCar(car.id))?.parts.engine, 'engine-v8')
  })

  it('renders the updated workshop when an optional part is removed', async (t) => {
    let { store, close } = await createTestGarage()
    t.after(close)
    let router = createGarageRouter(store, { render: renderDocument() })
    let car = await store.getCar('weekend-sprint')
    assert.ok(car)
    let installed = await store.installPart(car.id, 'spoiler-wing')
    assert.ok(installed.ok)

    let response = await router.fetch(
      new URL(
        routes.garage.install.href({ carId: car.id, category: 'spoiler' }),
        'http://garage.test',
      ),
      { method: 'POST', body: new URLSearchParams({ intent: 'remove', category: 'spoiler' }) },
    )

    assert.equal(response.status, 200)
    assert.equal(response.headers.get('Location'), null)
    assert.match(await response.text(), /Spoilers<\/dt><dd><strong>Open station/)
    assert.equal((await store.getCar(car.id))?.parts.spoiler, undefined)
  })
})
