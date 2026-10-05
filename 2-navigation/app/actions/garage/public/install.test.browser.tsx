import * as assert from "remix/assert";
import { describe, it } from "remix/test";
import { render } from "remix/component/test";

import type { Car } from "../../../data/garage-store.ts";
import { getPart } from "../../../data/public/catalog.ts";
import { CarBuild } from "./car-build.tsx";
import { PartList } from "./part-list.tsx";

describe("install button and live build", () => {
  it("shows Installing... and previews the new paint before the submission completes", async (t) => {
    let car: Car = {
      id: "weekend-sprint",
      name: "Weekend Sprint",
      createdAt: 0,
      parts: {
        chassis: "chassis-sprint",
        engine: "engine-i4",
        paint: "paint-paddock-green",
        tires: "tires-street",
        spoiler: undefined,
        hood: "hood-smooth",
      },
    };
    let paint = getPart("paint-redline");
    assert.ok(paint);
    let { $, act, cleanup } = render(
      <>
        <CarBuild car={car} />
        <PartList parts={[paint]} installedParts={car.parts} />
      </>,
    );
    t.after(cleanup);

    // Hold the native form navigation open so assertions cannot race a response.
    let response = Promise.withResolvers<void>();
    let submitted = Promise.withResolvers<FormData | null>();
    let listener = new AbortController();
    window.navigation.addEventListener(
      "navigate",
      (event) => {
        event.intercept({ handler: () => response.promise });
        submitted.resolve(event.formData);
      },
      { signal: listener.signal },
    );
    t.after(async () => {
      listener.abort();
      response.resolve();
      await window.navigation.transition?.finished;
    });

    let button = $('button[type="submit"]');
    assert.ok(button instanceof HTMLButtonElement);
    assert.equal(button.textContent, "Install");
    assert.equal(
      $('[role="img"]')?.getAttribute("aria-label"),
      "Side view of the car in Paddock Green",
    );

    await act(async () => {
      button.click();
      assert.equal((await submitted.promise)?.get("partId"), paint.id);
    });

    assert.equal(button.textContent, "Installing...");
    assert.equal(button.disabled, true);
    assert.equal(button.getAttribute("aria-busy"), "true");
    assert.equal(
      $('[role="img"]')?.getAttribute("aria-label"),
      "Side view of the car in Redline",
    );
    assert.equal(
      $("#car-build-weekend-sprint")?.getAttribute("aria-busy"),
      "true",
    );
    assert.equal(car.parts.paint, "paint-paddock-green");
  });
});
