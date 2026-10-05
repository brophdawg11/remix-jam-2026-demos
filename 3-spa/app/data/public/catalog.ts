export const partCategories = ['chassis', 'engine', 'paint', 'tires', 'spoiler', 'hood'] as const

export type PartCategory = (typeof partCategories)[number]

export const optionalPartCategories = ['spoiler', 'hood'] as const

export type OptionalPartCategory = (typeof optionalPartCategories)[number]

export function isOptionalPartCategory(category: PartCategory): category is OptionalPartCategory {
  return optionalPartCategories.some((optionalCategory) => optionalCategory === category)
}

export type Part = {
  id: string
  category: PartCategory
  name: string
  description: string
  spec: string
  color?: string
}

export const categoryLabels = {
  chassis: 'Chassis',
  engine: 'Engines',
  paint: 'Paint',
  tires: 'Tires',
  spoiler: 'Spoilers',
  hood: 'Hoods',
} satisfies Record<PartCategory, string>

export const parts = [
  {
    id: 'chassis-apex',
    category: 'chassis',
    name: 'Apex GT',
    description: 'Wide, planted, and ready for serious power.',
    spec: 'Track chassis',
  },
  {
    id: 'chassis-sprint',
    category: 'chassis',
    name: 'Sprint Club',
    description: 'A light chassis built to carry speed through corners.',
    spec: 'Lightweight chassis',
  },
  {
    id: 'engine-i4',
    category: 'engine',
    name: 'Kestrel I4 Turbo',
    description: 'Quick response with enough power for every chassis.',
    spec: '360 hp',
  },
  {
    id: 'engine-v8',
    category: 'engine',
    name: 'Foundry V8',
    description: 'Naturally aspirated torque and a mechanical soundtrack.',
    spec: '520 hp',
  },
  {
    id: 'engine-v12',
    category: 'engine',
    name: 'Tempest V12',
    description: 'The biggest motor in the shop. Apex chassis only.',
    spec: '740 hp',
  },
  {
    id: 'paint-redline',
    category: 'paint',
    name: 'Redline',
    description: 'The color every fast car thinks it is.',
    spec: 'Gloss finish',
    color: '#e23b2f',
  },
  {
    id: 'paint-apex-blue',
    category: 'paint',
    name: 'Apex Blue',
    description: 'Deep blue with a bright highlight under shop lights.',
    spec: 'Metallic finish',
    color: '#286bb8',
  },
  {
    id: 'paint-paddock-green',
    category: 'paint',
    name: 'Paddock Green',
    description: 'Classic racing green with a modern edge.',
    spec: 'Pearl finish',
    color: '#286451',
  },
  {
    id: 'paint-grid-silver',
    category: 'paint',
    name: 'Grid Silver',
    description: 'Bare-metal energy without the bare-metal upkeep.',
    spec: 'Satin finish',
    color: '#9ca4a8',
  },
  {
    id: 'tires-street',
    category: 'tires',
    name: 'Switchback Sport',
    description: 'Predictable grip for the road and the occasional lap.',
    spec: 'All-season sport',
  },
  {
    id: 'tires-track',
    category: 'tires',
    name: 'Hot Lap R',
    description: 'Soft compound with a short commute to the apex.',
    spec: 'Track compound',
  },
  {
    id: 'tires-rally',
    category: 'tires',
    name: 'Gravel Works',
    description: 'Chunky tread for builds that refuse to stay on asphalt.',
    spec: 'All-terrain',
  },
  {
    id: 'spoiler-ducktail',
    category: 'spoiler',
    name: 'Club Ducktail',
    description: 'A subtle lip that finishes the rear deck.',
    spec: 'Low profile',
  },
  {
    id: 'spoiler-wing',
    category: 'spoiler',
    name: 'Circuit Wing',
    description: 'Tall uprights and an adjustable aerofoil.',
    spec: 'High downforce',
  },
  {
    id: 'hood-smooth',
    category: 'hood',
    name: 'Clean Cut',
    description: 'A smooth hood that keeps the silhouette quiet.',
    spec: 'Factory profile',
  },
  {
    id: 'hood-vented',
    category: 'hood',
    name: 'Heat Extractor',
    description: 'Twin vents let the engine bay breathe.',
    spec: 'Vented profile',
  },
] as const satisfies readonly Part[]

export function getPart(partId: string): Part | undefined {
  return parts.find((part) => part.id === partId)
}

export function getParts(category: PartCategory): Part[] {
  return parts.filter((part) => part.category === category)
}

export function searchParts(query: string): Part[] {
  if (!query.trim()) return []
  let terms = query.trim().toLowerCase().split(/\s+/)
  return parts.filter((part) => {
    let text =
      `${categoryLabels[part.category]} ${part.name} ${part.description} ${part.spec}`.toLowerCase()
    return terms.every((term) => text.includes(term))
  })
}
