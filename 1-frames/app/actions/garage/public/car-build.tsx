import { clientEntry, css, on, type Handle } from "remix/component";

import {
  categoryLabels,
  getPart,
  partCategories,
} from "../../../data/public/catalog.ts";
import type { Part, PartCategory } from "../../../data/public/catalog.ts";
import type { Car } from "../../../data/garage-store.ts";
import { routes } from "../../../routes.ts";
import { CarIllustration } from "../../../ui/public/car-illustration.tsx";
import { colors, muted, panel } from "../../../ui/public/styles.ts";

export const CarBuild = clientEntry(
  import.meta.url,
  function CarBuild(handle: Handle<{ car: Car; error?: string }>) {
    let optimisticPart: Part | undefined;
    let saving = false;

    handle.queueTask(() => {
      window.navigation?.addEventListener(
        "navigate",
        (event) => {
          let partId = event.formData?.get("partId");
          if (typeof partId !== "string") return;
          optimisticPart = getPart(partId);
          handle.update();
        },
        { signal: handle.signal },
      );
    });

    handle.frame.addEventListener(
      "reloadStart",
      () => {
        saving = true;
        handle.update();
      },
      { signal: handle.signal },
    );
    handle.frame.addEventListener(
      "reloadComplete",
      () => {
        saving = false;
        optimisticPart = undefined;
        handle.update();
      },
      { signal: handle.signal },
    );

    return () => {
      let { car, error } = handle.props;
      let visibleParts = { ...car.parts };
      if (optimisticPart)
        visibleParts[optimisticPart.category] = optimisticPart.id;

      return (
        <section
          id={`car-build-${car.id}`}
          data-installed-chassis={car.parts.chassis}
          data-installed-engine={car.parts.engine}
          data-installed-paint={car.parts.paint}
          data-installed-tires={car.parts.tires}
          data-installed-spoiler={car.parts.spoiler}
          data-installed-hood={car.parts.hood}
          aria-labelledby="build-title"
          aria-busy={saving}
          mix={[
            panel,
            buildPanel,
            on("dragover", (event) => {
              if (event.dataTransfer?.types.includes("text/part-id")) {
                event.preventDefault();
                event.dataTransfer.dropEffect = "copy";
              }
            }),
            on("drop", async (event) => {
              let partId = event.dataTransfer?.getData("text/part-id");
              if (!partId) return;
              event.preventDefault();
              let part = getPart(partId);
              if (!part || saving) return;
              optimisticPart = part;
              saving = true;
              let signal = await handle.update();
              if (signal.aborted) return;
              let form = document.getElementById(
                `drop-install-${handle.props.car.id}`,
              );
              if (!(form instanceof HTMLFormElement)) return;
              let input = form.elements.namedItem("partId");
              if (!(input instanceof HTMLInputElement)) return;
              input.value = part.id;
              form.requestSubmit();
            }),
          ]}
        >
          <div mix={buildHeader}>
            <div>
              <h2 id="build-title" mix={buildTitle}>
                {car.name}
              </h2>
            </div>
            <div role="status" aria-live="polite" mix={saveStatus}>
              <span aria-hidden="true">{saving ? "◌" : "●"}</span>{" "}
              {saving ? "Saving…" : "Saved"}
            </div>
          </div>

          <div mix={dropZone} class={saving ? "is-saving" : undefined}>
            <CarIllustration parts={visibleParts} />
            <p mix={dropHint}>Drag any part here to install it</p>
          </div>

          {error && (
            <p role="alert" mix={errorStyle}>
              {error}
            </p>
          )}

          <div mix={buildSheet}>
            <div mix={sheetHeader}>
              <span mix={muted}>{partCategories.length} stations</span>
            </div>
            <dl mix={partsList}>
              {partCategories.map((category) => {
                let partId = visibleParts[category];
                let part = partId ? getPart(partId) : undefined;
                return (
                  <div
                    key={category}
                    mix={partRow}
                    class={
                      optimisticPart !== undefined &&
                      partId === optimisticPart.id
                        ? "is-optimistic"
                        : undefined
                    }
                  >
                    <dt>{categoryLabels[category]}</dt>
                    <dd>
                      <strong>{part?.name ?? "Open station"}</strong>
                      <span>{part?.spec ?? "Choose from inventory"}</span>
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>

          <form
            id={`drop-install-${car.id}`}
            action={handle.frames.top.src}
            method="post"
            data-rmx-target="build"
            data-rmx-src={routes.garage.updateBuild.href({ carId: car.id })}
            data-rmx-history="replace"
            data-rmx-reset-scroll="false"
            hidden
          >
            <input type="hidden" name="partId" />
          </form>
        </section>
      );
    };
  },
);

const buildPanel = css({ overflow: "hidden" });
const buildHeader = css({
  minHeight: 82,
  padding: "20px 22px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 20,
  borderBottom: `1px solid ${colors.line}`,
});
const buildTitle = css({
  margin: "4px 0 0",
  fontSize: 26,
  letterSpacing: "-0.04em",
});
const saveStatus = css({
  minWidth: 84,
  color: colors.green,
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.06em",
  textAlign: "right",
  textTransform: "uppercase",
});
const dropZone = css({
  position: "relative",
  padding: "14px 24px 4px",
  background: "linear-gradient(180deg, #e8e6de, #f8f6ef)",
  borderBottom: `1px solid ${colors.line}`,
  transition: "box-shadow 140ms ease",
  "&.is-saving": { boxShadow: `inset 0 0 0 4px ${colors.yellow}` },
});
const dropHint = css({
  position: "absolute",
  left: "50%",
  bottom: 12,
  margin: 0,
  padding: "6px 10px",
  color: "#fff",
  background: "rgba(25, 27, 29, 0.86)",
  borderRadius: 3,
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  transform: "translateX(-50%)",
  whiteSpace: "nowrap",
});
const errorStyle = css({
  margin: 0,
  padding: "12px 20px",
  color: colors.redDark,
  background: "#fff1eb",
  borderBottom: "1px solid #edc5b8",
  fontSize: 13,
  fontWeight: 700,
});
const buildSheet = css({ padding: "20px 22px 24px" });
const sheetHeader = css({
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  marginBottom: 10,
});
const partsList = css({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "0 20px",
  margin: 0,
  "@media (max-width: 540px)": { gridTemplateColumns: "1fr" },
});
const partRow = css({
  minHeight: 58,
  padding: "10px 0",
  display: "grid",
  gridTemplateColumns: "78px 1fr",
  gap: 10,
  borderBottom: `1px solid ${colors.line}`,
  "&.is-optimistic": { background: "#fff8da" },
  "& dt": {
    color: colors.muted,
    fontSize: 10,
    fontWeight: 800,
    textTransform: "uppercase",
  },
  "& dd": { margin: 0 },
  "& strong, & span": { display: "block" },
  "& strong": { fontSize: 12 },
  "& span": { marginTop: 3, color: colors.muted, fontSize: 10 },
});
