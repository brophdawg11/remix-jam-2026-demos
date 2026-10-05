import * as s from 'remix/data-schema'
import * as f from 'remix/data-schema/form-data'
import { maxLength, minLength } from 'remix/data-schema/checks'

import { optionalPartCategories, partCategories } from '../../data/public/catalog.ts'

const chassisId = s.enum_(['chassis-apex', 'chassis-sprint'])
const category = s.enum_(partCategories)

export const createCarSchema = f.object({
  name: f.field(s.string().pipe(minLength(2), maxLength(40))),
  chassisId: f.field(chassisId),
})

export const installPartSchema = f.object({
  partId: f.field(s.string().pipe(minLength(1), maxLength(50))),
})

export const deleteCarSchema = f.object({
  carId: f.field(s.string().pipe(minLength(1), maxLength(100))),
})

export const removePartSchema = f.object({
  intent: f.field(s.literal('remove')),
  category: f.field(s.enum_(optionalPartCategories)),
})

export function inventoryCategory(value: string | undefined) {
  return s.parseSafe(category, value ?? 'engine')
}
