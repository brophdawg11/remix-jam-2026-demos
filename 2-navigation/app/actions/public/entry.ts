import { run } from "remix/component";

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
