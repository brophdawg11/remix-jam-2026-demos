import { render, run } from "remix/spa";
import type { Middleware } from "remix/router";
import { createRoot, spaResponse } from "remix/component";

import { createLocalStorageGarageStore } from "./app/data/local-storage-store.ts";
import { createGarageRouter } from "./app/router.ts";
import { routes } from "./app/routes.ts";
import { Layout } from "./app/ui/layout.tsx";

const logSpaRequests: Middleware = async ({ request }, next) => {
  let url = new URL(request.url);
  let start = performance.now();
  console.log(`[SPA] → ${request.method} ${url.pathname}${url.search}`);
  let response = await next();
  let duration = Math.round(performance.now() - start);
  console.log(
    `[SPA] ← ${response.status} ${request.method} ${url.pathname} (${duration} ms)`,
  );
  return response;
};

try {
  let store = await createLocalStorageGarageStore(localStorage);
  let router = createGarageRouter(store, {
    middleware: [
      logSpaRequests,
      async (_context, next) => {
        let response = await next();
        // Plain-text errors from the router still need a renderable SPA response.
        if (
          response.status >= 400 &&
          response.headers.get("Content-Type")?.startsWith("text/plain")
        ) {
          return spaResponse.create(
            <Layout>
              <p role="alert">{await response.text()}</p>
            </Layout>,
            { status: response.status },
          );
        }
        return response;
      },
    ],
    render: render((content) => <Layout>{content}</Layout>),
  });

  let app = run(router, {
    fallback: (
      <Layout>
        <p>Opening the garage…</p>
      </Layout>
    ),
  });
  app.addEventListener("error", (event) => {
    console.error("Garage request failed:", event.error);
  });
  await app.ready().catch((error) => {
    app.dispose();
    throw error;
  });
} catch (error) {
  console.error("Garage could not start:", error);
  createRoot(document.body).render(
    <Layout>
      <h1>Could not open the garage</h1>
      <p>
        This demo requires localStorage and Web Locks in a secure browser
        context.
      </p>
      <p>
        Saved builds are never reset automatically. See the README for recovery
        instructions.
      </p>
    </Layout>,
  );
}
