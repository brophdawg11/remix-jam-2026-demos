import { Frame, css, type Handle } from "remix/component";

import type { PartCategory } from "../../data/public/catalog.ts";
import type { Car } from "../../data/garage-store.ts";
import { routes } from "../../routes.ts";
import { PitNotes } from "./public/pit-notes.tsx";
import { colors, muted } from "../../ui/public/styles.ts";

export function WorkshopPage(
  handle: Handle<{
    car: Car;
    category: PartCategory;
    query: string;
    installError?: string;
  }>,
) {
  return () => {
    let { car, category, query, installError } = handle.props;
    return (
      <>
        <nav aria-label="Breadcrumb" mix={breadcrumbStyle}>
          <a href={routes.garage.index.href()} data-rmx-document>
            Garage
          </a>
          <span aria-hidden="true">/</span>
          <span>{car.name}</span>
        </nav>
        <header mix={workshopHeader}>
          <div>
            <h1 mix={workshopTitle}>{car.name}</h1>
          </div>
          <p mix={[muted, css({ maxWidth: 420, margin: 0 })]}>
            Browse by URL, install with a form, or drag a part onto the car for
            an optimistic fit.
          </p>
        </header>
        <div mix={workshopGrid}>
          <div mix={css({ display: "grid", gap: 22, alignContent: "start" })}>
            <Frame
              name="build"
              src={routes.garage.build.href(
                { carId: car.id },
                { searchParams: installError ? { error: installError } : {} },
              )}
            />
            <PitNotes carId={car.id} />
          </div>
          <div mix={css({ display: "grid", gap: 22, alignContent: "start" })}>
            <Frame
              name="inventory"
              src={routes.garage.show.href({ carId: car.id, category })}
            />
            <Frame
              name="inventory-search"
              src={routes.garage.search.href(
                { carId: car.id },
                { searchParams: { q: query || undefined } },
              )}
            />
          </div>
        </div>
      </>
    );
  };
}

const breadcrumbStyle = css({
  display: "flex",
  gap: 9,
  marginBottom: 26,
  color: colors.muted,
  fontSize: 11,
  "& a": { color: colors.ink, textUnderlineOffset: 3 },
});
const workshopHeader = css({
  minHeight: 120,
  marginBottom: 28,
  paddingBottom: 22,
  display: "flex",
  alignItems: "end",
  justifyContent: "space-between",
  gap: 24,
  borderBottom: `2px solid ${colors.ink}`,
  "@media (max-width: 700px)": { alignItems: "start", flexDirection: "column" },
});
const workshopTitle = css({
  margin: "5px 0 0",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "clamp(38px, 6vw, 64px)",
  fontStyle: "italic",
  fontWeight: 500,
  letterSpacing: "-0.05em",
  lineHeight: 1,
});
const workshopGrid = css({
  display: "grid",
  gridTemplateColumns: "minmax(0, 1.15fr) minmax(360px, 0.85fr)",
  gap: 22,
  alignItems: "start",
  "@media (max-width: 900px)": { gridTemplateColumns: "1fr" },
});
