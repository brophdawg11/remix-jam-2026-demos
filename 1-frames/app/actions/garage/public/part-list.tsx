import { css, on, type Handle } from "remix/component";

import {
  categoryLabels,
  isOptionalPartCategory,
} from "../../../data/public/catalog.ts";
import type { Part } from "../../../data/public/catalog.ts";
import type { Car } from "../../../data/garage-store.ts";
import { partCategories } from "../../../data/public/catalog.ts";
import { routes } from "../../../routes.ts";
import { button, colors, primaryButton } from "../../../ui/public/styles.ts";
import { PartImage } from "./part-image.tsx";

export function PartList(
  handle: Handle<{
    carId: string;
    parts: Part[];
    installedParts: Car["parts"];
    compact?: boolean;
  }>,
) {
  let activeParts = { ...handle.props.installedParts };
  let renderedInstalledParts = handle.props.installedParts;
  let pendingPartId: string | undefined;

  handle.queueTask(() => {
    let buildFrame = handle.frames.get("build");
    if (!buildFrame) return;
    buildFrame.addEventListener(
      "reloadComplete",
      () => {
        pendingPartId = undefined;
        syncInstalledPart();
      },
      { signal: handle.signal },
    );
    syncInstalledPart();
  });

  function syncInstalledPart() {
    let { carId } = handle.props;
    let build = document.getElementById(`car-build-${carId}`);
    if (!build) return;
    for (let category of partCategories) {
      activeParts[category] =
        build.getAttribute(`data-installed-${category}`) ?? undefined;
    }
    handle.update();
  }

  return () => {
    let { carId, installedParts, parts, compact } = handle.props;
    if (
      partCategories.some(
        (category) =>
          installedParts[category] !== renderedInstalledParts[category],
      )
    ) {
      activeParts = { ...installedParts };
    }
    renderedInstalledParts = installedParts;
    return (
      <ul mix={inventoryList}>
        {parts.map((part) => (
          <li
            key={part.id}
            class={
              activeParts[part.category] === part.id
                ? "is-installed"
                : undefined
            }
            mix={compact ? [partCard, compactPartCard] : partCard}
          >
            <div
              draggable={true}
              aria-label={`Drag ${part.name} to the car`}
              title={`Drag ${part.name} to the car`}
              mix={[
                partImage,
                ...(compact ? [compactPartImage] : []),
                on("dragstart", (event) => {
                  event.stopPropagation();
                  event.dataTransfer?.setData("text/part-id", part.id);
                  if (event.dataTransfer)
                    event.dataTransfer.effectAllowed = "copy";
                }),
              ]}
            >
              <PartImage part={part} />
              <span mix={dragLabel} aria-hidden="true">
                Drag
              </span>
            </div>
            <div mix={partCopy}>
              <div mix={partNameLine}>
                <strong>{part.name}</strong>
                {activeParts[part.category] === part.id && (
                  <span mix={installedBadge}>Installed</span>
                )}
              </div>
              <span>
                {categoryLabels[part.category]} · {part.spec}
              </span>
              {!compact && <p>{part.description}</p>}
            </div>
            {activeParts[part.category] !== part.id ? (
              <form
                method="post"
                data-rmx-target="build"
                data-rmx-src={routes.garage.updateBuild.href({ carId })}
                data-rmx-history="replace"
                data-rmx-reset-scroll="false"
                mix={on("submit", () => {
                  pendingPartId = part.id;
                  handle.update();
                })}
              >
                <input type="hidden" name="partId" value={part.id} />
                <button
                  type="submit"
                  disabled={pendingPartId === part.id}
                  aria-busy={pendingPartId === part.id}
                  class={
                    pendingPartId === part.id ? "is-installing" : undefined
                  }
                  mix={[button, primaryButton, installButton]}
                >
                  {pendingPartId === part.id ? "Installing..." : "Install"}
                </button>
              </form>
            ) : isOptionalPartCategory(part.category) ? (
              <form
                method="post"
                data-rmx-target="build"
                data-rmx-src={routes.garage.updateBuild.href({ carId })}
                data-rmx-history="replace"
                data-rmx-reset-scroll="false"
              >
                <input type="hidden" name="intent" value="remove" />
                <input type="hidden" name="category" value={part.category} />
                <button type="submit" mix={button}>
                  Remove
                </button>
              </form>
            ) : (
              <span mix={activeLabel}>On car</span>
            )}
          </li>
        ))}
      </ul>
    );
  };
}

const inventoryList = css({ margin: 0, padding: 0, listStyle: "none" });
const installButton = css({
  transition: "opacity 120ms ease",
  "&.is-installing": { opacity: 0.55, cursor: "progress" },
});
const partCard = css({
  minHeight: 144,
  padding: "17px 18px",
  display: "grid",
  gridTemplateColumns: "112px minmax(0, 1fr) auto",
  alignItems: "center",
  gap: 14,
  borderBottom: `1px solid ${colors.line}`,
  "&:last-child": { borderBottom: 0 },
  "&.is-installed": { background: "#f3f7f2" },
  "@media (max-width: 500px)": {
    gridTemplateColumns: "96px 1fr",
    "& form, & > span:last-child": { gridColumn: "2" },
  },
});
const compactPartCard = css({
  minHeight: 64,
  padding: "6px 12px",
  gridTemplateColumns: "60px minmax(0, 1fr) auto",
  gap: 8,
  "@media (max-width: 500px)": { gridTemplateColumns: "60px minmax(0, 1fr)" },
});
const partImage = css({
  position: "relative",
  width: 112,
  minHeight: 88,
  display: "grid",
  placeItems: "center",
  background: "linear-gradient(145deg, #f7f5ee, #e3dfd4)",
  border: `1px solid ${colors.line}`,
  borderRadius: 4,
  cursor: "grab",
  userSelect: "none",
  "&:active": { cursor: "grabbing" },
  "& svg": { width: "100%", height: "auto", pointerEvents: "none" },
  "@media (max-width: 500px)": { width: 96 },
});
const compactPartImage = css({
  width: 60,
  minHeight: 46,
  "@media (max-width: 500px)": { width: 60 },
});
const dragLabel = css({
  position: "absolute",
  right: 5,
  bottom: 5,
  padding: "3px 5px",
  color: "#fff",
  background: "rgba(25, 27, 29, 0.78)",
  borderRadius: 2,
  fontSize: 8,
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
});
const partCopy = css({
  "& strong, & span": { display: "block" },
  "& strong": { fontSize: 14 },
  "& span": {
    marginTop: 3,
    color: colors.redDark,
    fontSize: 10,
    fontWeight: 800,
    textTransform: "uppercase",
  },
  "& p": {
    margin: "7px 0 0",
    color: colors.muted,
    fontSize: 11,
    lineHeight: 1.4,
  },
});
const partNameLine = css({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 7,
});
const installedBadge = css({
  padding: "3px 5px",
  color: "#fff",
  background: colors.green,
  borderRadius: 2,
  fontSize: "8px !important",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
});
const activeLabel = css({
  color: colors.green,
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
});
