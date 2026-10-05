import { column as c, table } from 'remix/data-table'

export const cars = table({
  name: 'cars',
  columns: {
    id: c.text(),
    name: c.text(),
    created_at: c.integer(),
    chassis_id: c.text(),
    engine_id: c.text().nullable(),
    paint_id: c.text().nullable(),
    tires_id: c.text().nullable(),
    spoiler_id: c.text().nullable(),
    hood_id: c.text().nullable(),
  },
})
