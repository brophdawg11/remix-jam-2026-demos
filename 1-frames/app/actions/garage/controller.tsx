import * as s from "remix/data-schema";
import type { RenderFunction } from "remix/middleware/render";
import { createController } from "remix/router";
import { redirect } from "remix/response/redirect";

import { getPart, getParts, searchParts } from "../../data/public/catalog.ts";
import type { PartCategory } from "../../data/public/catalog.ts";
import type { GarageStore } from "../../data/garage-store.ts";
import { garageStore } from "../../middleware/garage.ts";
import { routes } from "../../routes.ts";
import { GaragePage } from "./garage-page.tsx";
import { CarList } from "./car-list.tsx";
import { CarBuild as BuildPanel } from "./public/car-build.tsx";
import { InventoryPanel as Inventory } from "./public/inventory-panel.tsx";
import { InventorySearch } from "./public/inventory-search.tsx";
import {
  createCarSchema,
  deleteCarSchema,
  installPartSchema,
  inventoryCategory,
  removePartSchema,
} from "./validation.ts";
import { WorkshopPage } from "./workshop-page.tsx";

const installErrors = {
  incompatible:
    "That combination does not fit. The Tempest V12 requires the Apex GT chassis.",
  "part-not-found": "That part is no longer in the catalog.",
  "car-not-found": "That car is no longer in the garage.",
} as const;

export default createController(routes.garage, {
  actions: {
    async index(context) {
      if (
        context.request.headers.get("X-Remix-Frame") === "true" &&
        context.request.headers.get("X-Remix-Target") === "car-list"
      ) {
        let cars = await context.get(garageStore).getCars();
        return context.render(<CarList cars={cars} />, noStore());
      }
      return context.render(<GaragePage />, noStore());
    },

    async create(context) {
      let store = context.get(garageStore);
      let input = s.parseSafe(createCarSchema, context.get(FormData));
      if (!input.success) {
        return context.render(
          <GaragePage error="Give the build a name and choose a chassis." />,
          noStore(422),
        );
      }
      let result = await store.createCar(
        input.value.name,
        input.value.chassisId,
      );
      if (!result.ok) {
        return context.render(
          <GaragePage
            name={input.value.name}
            error="Give the build a name and choose a chassis."
          />,
          noStore(422),
        );
      }
      return redirect(
        routes.garage.show.href({ carId: result.car.id, category: "engine" }),
        303,
      );
    },

    async destroy(context) {
      let input = s.parseSafe(deleteCarSchema, context.get(FormData));
      if (!input.success)
        return new Response("Choose a car to sell.", { status: 422 });
      let store = context.get(garageStore);
      await store.deleteCar(input.value.carId);
      if (
        context.request.headers.get("X-Remix-Frame") === "true" &&
        context.request.headers.get("X-Remix-Target") === "car-list"
      ) {
        let cars = await store.getCars();
        return context.render(<CarList cars={cars} />, noStore());
      }
      return redirect(routes.garage.index.href(), 303);
    },

    async show(context) {
      let category = inventoryCategory(context.params.category);
      if (!category.success)
        return new Response("Unknown inventory category", { status: 404 });
      let car = await context.get(garageStore).getCar(context.params.carId);
      if (!car) return new Response("Car not found", { status: 404 });
      let query = context.url.searchParams.get("q") ?? "";
      if (
        context.request.headers.get("X-Remix-Frame") === "true" &&
        context.request.headers.get("X-Remix-Target") === "inventory"
      ) {
        return context.render(
          <Inventory
            carId={car.id}
            category={category.value}
            parts={getParts(category.value)}
            installedParts={car.parts}
          />,
          noStore(),
        );
      }
      let errorCode = context.url.searchParams.get("error");
      let installError = errorCode === "incompatible" ? errorCode : undefined;
      return context.render(
        <WorkshopPage
          car={car}
          category={category.value}
          query={query}
          installError={installError}
        />,
        noStore(),
      );
    },

    async search(context) {
      let car = await context.get(garageStore).getCar(context.params.carId);
      if (!car) return new Response("Car not found", { status: 404 });
      let query = context.url.searchParams.get("q") ?? "";
      if (context.request.headers.get("X-Remix-Frame") !== "true") {
        return redirect(
          routes.garage.show.href(
            { carId: car.id, category: "engine" },
            { searchParams: { q: query || undefined } },
          ),
        );
      }
      return context.render(
        <InventorySearch
          carId={car.id}
          query={query}
          parts={searchParts(query)}
          installedParts={car.parts}
        />,
        noStore(),
      );
    },

    async build(context) {
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      let car = await context.get(garageStore).getCar(context.params.carId);
      if (!car) return new Response("Car not found", { status: 404 });
      let errorCode = context.url.searchParams.get("error");
      let error =
        errorCode === "incompatible" ? installErrors.incompatible : undefined;
      return context.render(<BuildPanel car={car} error={error} />, noStore());
    },

    async install(context) {
      let category = inventoryCategory(context.params.category);
      if (!category.success)
        return new Response("Unknown inventory category", { status: 404 });
      return updatePart({
        store: context.get(garageStore),
        carId: context.params.carId,
        returnCategory: category.value,
        formData: context.get(FormData),
        request: context.request,
        url: context.url,
        render: context.render,
      });
    },

    async updateBuild(context) {
      return updatePart({
        store: context.get(garageStore),
        carId: context.params.carId,
        formData: context.get(FormData),
        request: context.request,
        url: context.url,
        render: context.render,
      });
    },
  },
});

function noStore(status = 200): ResponseInit {
  return { status, headers: { "Cache-Control": "no-store" } };
}

interface UpdatePartOptions {
  store: GarageStore;
  carId: string;
  returnCategory?: PartCategory;
  formData: FormData;
  request: Request;
  url: URL;
  render: RenderFunction;
}

async function updatePart(options: UpdatePartOptions): Promise<Response> {
  if (options.formData.get("intent") === "remove") return removePart(options);

  let input = s.parseSafe(installPartSchema, options.formData);
  if (!input.success)
    return new Response("Choose a part to install.", { status: 422 });
  let part = getPart(input.value.partId);
  let result = await options.store.installPart(
    options.carId,
    input.value.partId,
  );
  if (!result.ok && result.reason === "car-not-found") {
    return new Response("Car not found", { status: 404 });
  }

  let frameRequest = options.request.headers.get("X-Remix-Frame") === "true";
  if (frameRequest) {
    let car = result.ok
      ? result.car
      : await options.store.getCar(options.carId);
    if (!car) return new Response("Car not found", { status: 404 });
    let error = result.ok ? undefined : installErrors[result.reason];
    return options.render(
      <BuildPanel car={car} error={error} />,
      noStore(result.ok ? 200 : 409),
    );
  }

  let searchParams: Record<string, string> = {};
  let query = options.url.searchParams.get("q");
  if (query) searchParams.q = query;
  if (!result.ok) searchParams.error = result.reason;
  return redirect(
    routes.garage.show.href(
      {
        carId: options.carId,
        category: options.returnCategory ?? part?.category ?? "engine",
      },
      { searchParams },
    ),
    303,
  );
}

async function removePart(options: UpdatePartOptions): Promise<Response> {
  let input = s.parseSafe(removePartSchema, options.formData);
  if (!input.success)
    return new Response("Choose an optional part to remove.", { status: 422 });
  let result = await options.store.removePart(
    options.carId,
    input.value.category,
  );
  if (!result.ok) return new Response("Car not found", { status: 404 });

  if (options.request.headers.get("X-Remix-Frame") === "true") {
    return options.render(<BuildPanel car={result.car} />, noStore());
  }

  return redirect(
    routes.garage.show.href(
      {
        carId: options.carId,
        category: options.returnCategory ?? input.value.category,
      },
      { searchParams: { q: options.url.searchParams.get("q") ?? undefined } },
    ),
    303,
  );
}
