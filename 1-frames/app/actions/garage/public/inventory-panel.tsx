import { clientEntry, css, on, type Handle } from "remix/component";

import {
  categoryLabels,
  partCategories,
} from "../../../data/public/catalog.ts";
import type { Part, PartCategory } from "../../../data/public/catalog.ts";
import type { Car } from "../../../data/garage-store.ts";
import { routes } from "../../../routes.ts";
import { colors, panel } from "../../../ui/public/styles.ts";
import { PartList } from "./part-list.tsx";

export const InventoryPanel = clientEntry(
  import.meta.url,
  function InventoryPanel(
    handle: Handle<{
      carId: string;
      category: PartCategory;
      parts: Part[];
      installedParts: Car["parts"];
    }>,
  ) {
    let compact = true;

    return () => {
      let { carId, category, parts, installedParts } = handle.props;
      return (
        <section
          mix={[panel, css({ overflow: "hidden" })]}
          aria-labelledby="inventory-title"
        >
          <div mix={inventoryHeader}>
            <div>
              <h2 id="inventory-title" mix={inventoryTitle}>
                Inventory
              </h2>
            </div>
            <div mix={inventoryMeta}>
              <span mix={partCount} role="status">
                {parts.length} in stock
              </span>
              <button
                type="button"
                aria-pressed={!compact}
                mix={[
                  detailsToggle,
                  on("click", () => {
                    compact = !compact;
                    handle.update();
                  }),
                ]}
              >
                Toggle details
              </button>
            </div>
          </div>
          <nav aria-label="Inventory categories" mix={categoryNav}>
            {partCategories.map((item) => (
              <a
                key={item}
                href={routes.garage.show.href({ carId, category: item })}
                data-rmx-target="inventory"
                data-rmx-reset-scroll="false"
                aria-current={category === item ? "page" : undefined}
                mix={categoryLink}
              >
                {categoryLabels[item]}
              </a>
            ))}
          </nav>
          <PartList
            carId={carId}
            parts={parts}
            installedParts={installedParts}
            compact={compact}
          />
        </section>
      );
    };
  },
);

const inventoryHeader = css({
  minHeight: 82,
  padding: "20px 22px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: 16,
  borderBottom: `1px solid ${colors.line}`,
});
const inventoryTitle = css({
  margin: "4px 0 0",
  fontSize: 24,
  letterSpacing: "-0.04em",
});
const inventoryMeta = css({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: 12,
});
const partCount = css({ color: colors.muted, fontSize: 11, fontWeight: 700 });
const categoryNav = css({
  display: "flex",
  gap: 0,
  overflowX: "auto",
  borderBottom: `1px solid ${colors.line}`,
});
const categoryLink = css({
  minHeight: 44,
  padding: "0 13px",
  display: "inline-flex",
  alignItems: "center",
  flexShrink: 0,
  color: colors.muted,
  borderRight: `1px solid ${colors.line}`,
  fontSize: 10,
  fontWeight: 800,
  textDecoration: "none",
  textTransform: "uppercase",
  '&[aria-current="page"]': { color: "#fff", background: colors.ink },
});

const detailsToggle = css({
  padding: 0,
  color: colors.redDark,
  background: "none",
  border: 0,
  font: "inherit",
  fontSize: 11,
  fontWeight: 700,
  textDecoration: "underline",
  cursor: "pointer",
});
