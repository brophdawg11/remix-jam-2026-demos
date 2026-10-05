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
      let frame = context.request.headers.get('X-Remix-Frame') === 'true'

      let renderContent: RenderFunction = (content, init) => {
        let headers = new Headers(init?.headers)
        headers.append('Vary', 'X-Remix-Frame')
        headers.append('Vary', 'X-Remix-Target')
        if (!frame) {
          if (context.url.pathname !== routes.garage.index.href())
            content = <Layout>{content}</Layout>
          content = <Document>{content}</Document>
        }
        return renderHtml(content, { ...init, headers })
      }
      context.set(Renderer, renderContent, { property: 'render' })
      return next()
    })
}
