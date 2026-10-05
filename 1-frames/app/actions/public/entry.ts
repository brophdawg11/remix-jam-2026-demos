import { run } from "remix/component";
import type { ResolveFrameOptions } from "remix/component";

const app = run({
  async loadModule(moduleUrl, exportName) {
    let module = await import(moduleUrl);
    let component = module[exportName];
    if (typeof component !== "function")
      throw new Error(`Missing client entry: ${exportName}`);
    return component;
  },
});

app.addEventListener("error", (event) => console.error(event.error));
app.ready().catch((error: unknown) => console.error(error));

// Custom resolveFrame you could provide to run()
// async function customResolveFrame(src: string, options?: ResolveFrameOptions) {
//   let headers = new Headers({ Accept: "text/html", "X-Remix-Frame": "true" });
//   if (options?.target != null) headers.set("X-Remix-Target", options.target);

//   let response = await fetch(src, {
//     body: getBody(options),
//     headers,
//     method: options?.method,
//     mode: "same-origin",
//     signal: options?.signal,
//   });

//   if (!response.ok) {
//     throw new Error(
//       `Failed to resolve frame: ${response.status} ${response.statusText}`.trimEnd(),
//     );
//   }

//   return response;
// }

// function getBody(options?: ResolveFrameOptions): BodyInit | undefined {
//   let formData = options?.formData;
//   let method = options?.method;
//   if (!formData || !method || ["get", "head"].includes(method.toLowerCase()))
//     return;

//   if (options?.encType === "application/x-www-form-urlencoded") {
//     let params = new URLSearchParams();
//     for (let [name, value] of formData) {
//       params.append(name, typeof value === "string" ? value : value.name);
//     }
//     return params;
//   }

//   return formData;
// }
