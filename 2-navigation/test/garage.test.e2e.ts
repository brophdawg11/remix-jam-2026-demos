import * as assert from 'remix/assert'
import { createTestServer } from 'remix/node-fetch-server/test'
import { describe, it } from 'remix/test'

import { assets } from '../app/assets.ts'
import { renderDocument } from '../app/middleware/document.tsx'
import { createGarageRouter } from '../app/router.ts'
import { routes } from '../app/routes.ts'
import { createTestGarage } from './garage.ts'

describe('garage workshop', () => {
  it('keeps an installed engine after leaving and returning', async (t) => {
    let { store, close } = await createTestGarage()
    t.after(close)
    t.after(() => assets.close())
    let router = createGarageRouter(store, { render: renderDocument() })
    router.get(
      '/assets/*path',
      async ({ request }) =>
        (await assets.fetch(request)) ?? new Response('Not found', { status: 404 }),
    )
    let page = await t.serve(await createTestServer(router.fetch))
    let workshop = routes.garage.show.href({ carId: 'weekend-sprint', category: 'engine' })
    await page.goto(workshop)
    let workshopRequests: string[] = []
    page.on('request', (request) => {
      if (new URL(request.url()).pathname === workshop) workshopRequests.push(request.method())
    })

    let engine = page.getByRole('listitem').filter({ hasText: 'Foundry V8' })
    await engine.getByRole('button', { name: 'Install', exact: true }).click()
    await engine.getByText('Installed', { exact: true }).waitFor()
    assert.deepEqual(workshopRequests, ['POST'])

    await page.getByRole('link', { name: 'Garage', exact: true }).click()
    await page.getByRole('heading', { name: 'Your garage. Your rules.' }).waitFor()
    await page.getByRole('link', { name: /Weekend Sprint/ }).click()
    await page.getByRole('heading', { name: 'Weekend Sprint', level: 1 }).waitFor()

    await engine.getByText('Installed', { exact: true }).waitFor()
    assert.equal(await engine.getByText('On car', { exact: true }).count(), 1)
    assert.match(
      await page.getByRole('region', { name: 'Weekend Sprint' }).innerText(),
      /Foundry V8/,
    )

    // A fresh document also restores the build from SQLite, not client component state.
    await page.reload()
    await engine.getByText('Installed', { exact: true }).waitFor()
    assert.match(
      await page.getByRole('region', { name: 'Weekend Sprint' }).innerText(),
      /Foundry V8/,
    )
  })
})
