import { render, Renderer, type RenderFunction } from 'remix/middleware/render'

import { assets } from '../assets.ts'
import { routes } from '../routes.ts'
import { Document } from '../ui/document.tsx'
import { Layout } from '../ui/layout.tsx'

export function renderDocument(): ReturnType<typeof render> {
  let html = render({ assets })
  return (context, next) =>
    html(context, async () => {
      let renderHtml = context.get(Renderer) as RenderFunction
      let renderContent: RenderFunction = (content, init) => {
        if (context.url.pathname !== routes.garage.index.href())
          content = <Layout>{content}</Layout>
        return renderHtml(<Document>{content}</Document>, init)
      }
      context.set(Renderer, renderContent, { property: 'render' })
      return next()
    })
}
