import { css, type Handle } from "remix/component";

import { getPart } from "../../data/public/catalog.ts";
import type { Car } from "../../data/garage-store.ts";
import { routes } from "../../routes.ts";
import { CarIllustration } from "../../ui/public/car-illustration.tsx";
import { button, colors, muted, panel } from "../../ui/public/styles.ts";

export function CarList(handle: Handle<{ cars: Car[] }>) {
  return () => (
    <section aria-labelledby="saved-builds-title">
      <div mix={sectionHeader}>
        <div>
          <h2 id="saved-builds-title" mix={sectionTitle}>
            On the shop floor
          </h2>
        </div>
        <span role="status" mix={muted}>
          {handle.props.cars.length}{" "}
          {handle.props.cars.length === 1 ? "build" : "builds"}
        </span>
      </div>
      {handle.props.cars.length === 0 ? (
        <div mix={[panel, emptyStyle]}>
          <h3>No cars yet</h3>
          <p mix={muted}>
            Name your first build and choose a chassis to get started.
          </p>
        </div>
      ) : (
        <ul mix={carList}>
          {handle.props.cars.map((car) => {
            let engine = car.parts.engine
              ? getPart(car.parts.engine)
              : undefined;
            return (
              <li key={car.id} mix={panel}>
                <a
                  href={routes.garage.show.href({
                    carId: car.id,
                    category: "engine",
                  })}
                  mix={carCardLink}
                >
                  <CarIllustration parts={car.parts} compact />
                  <div mix={carCardFooter}>
                    <div>
                      <h3 mix={css({ margin: 0, fontSize: 18 })}>{car.name}</h3>
                      <span mix={css({ color: colors.muted, fontSize: 12 })}>
                        {engine?.name ?? "Engine bay waiting"}
                      </span>
                    </div>
                    <span aria-hidden="true" mix={cardArrow}>
                      →
                    </span>
                  </div>
                </a>
                <form
                  action={routes.garage.destroy.href()}
                  method="post"
                  data-rmx-history="replace"
                  data-rmx-reset-scroll="false"
                  mix={sellForm}
                >
                  <input type="hidden" name="_method" value="DELETE" />
                  <input type="hidden" name="carId" value={car.id} />
                  <button
                    type="submit"
                    aria-label={`Sell ${car.name}`}
                    mix={[button, sellButton]}
                  >
                    Sell
                  </button>
                </form>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

const sectionTitle = css({
  margin: "6px 0 22px",
  fontSize: 24,
  letterSpacing: "-0.035em",
});
const sectionHeader = css({
  minHeight: 68,
  display: "flex",
  alignItems: "start",
  justifyContent: "space-between",
  gap: 16,
});
const emptyStyle = css({
  padding: 36,
  textAlign: "center",
  "& h3": { margin: "0 0 8px" },
});
const carList = css({
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: 16,
  margin: 0,
  padding: 0,
  listStyle: "none",
  "@media (max-width: 560px)": { gridTemplateColumns: "1fr" },
});
const carCardLink = css({
  display: "block",
  color: colors.ink,
  textDecoration: "none",
});
const carCardFooter = css({
  minHeight: 74,
  padding: "14px 16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 14,
  borderTop: `1px solid ${colors.line}`,
});
const cardArrow = css({
  width: 36,
  height: 36,
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
  color: "#fff",
  background: colors.ink,
  borderRadius: "50%",
});
const sellForm = css({
  padding: "0 16px 14px",
  display: "flex",
  justifyContent: "end",
});
const sellButton = css({
  color: colors.redDark,
  borderColor: colors.line,
  minHeight: 36,
});
