import { css, type Handle, type RemixNode } from "remix/component";
import { ImportMap } from "remix/component/server";

import { scriptEntry } from "../assets.ts";

export function Document(handle: Handle<{ children: RemixNode }>) {
  return () => (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Build a race car from URL-backed, server-rendered Remix frames."
        />
        <title>Remix Garage</title>
        <ImportMap value={scriptEntry.importMap} />
        {scriptEntry.preloads.map((href) => (
          <link key={href} rel="modulepreload" href={href} />
        ))}
      </head>
      <body mix={css({ margin: 0 })}>
        {handle.props.children}
        <script type="module" src={scriptEntry.href} />
      </body>
    </html>
  );
}
