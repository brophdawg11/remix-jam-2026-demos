import { Frame, css, type Handle } from "remix/component";

import { getParts } from "../../data/public/catalog.ts";
import { routes } from "../../routes.ts";
import { Layout } from "../../ui/layout.tsx";
import {
  button,
  colors,
  field,
  label,
  muted,
  panel,
  primaryButton,
} from "../../ui/public/styles.ts";

export function GaragePage(handle: Handle<{ error?: string; name?: string }>) {
  return () => (
    <Layout>
      <section mix={heroStyle}>
        <div>
          <h1 mix={heroTitle}>Your garage. Your rules.</h1>
          <p
            mix={[
              muted,
              css({ maxWidth: 620, margin: "10px 0 0", fontSize: 16 }),
            ]}
          >
            Start with a chassis, then tune every visible detail in the
            workshop.
          </p>
        </div>
      </section>

      <div mix={garageGrid}>
        <section
          mix={[panel, css({ padding: 24 })]}
          aria-labelledby="new-build-title"
        >
          <h2 id="new-build-title" mix={sectionTitle}>
            Roll in a blank canvas
          </h2>
          <form
            action={routes.garage.create.href()}
            method="post"
            data-rmx-document
            mix={css({ display: "grid", gap: 18 })}
          >
            <label mix={label}>
              Build name
              <input
                name="name"
                required
                minLength={2}
                maxLength={40}
                defaultValue={handle.props.name ?? ""}
                placeholder="e.g. Sunday Special"
                mix={field}
              />
            </label>
            <fieldset mix={chassisFieldset}>
              <legend>Starting chassis</legend>
              {getParts("chassis").map((chassis, index) => (
                <label key={chassis.id} mix={chassisOption}>
                  <input
                    type="radio"
                    name="chassisId"
                    value={chassis.id}
                    defaultChecked={index === 0}
                  />
                  <span>
                    <strong>{chassis.name}</strong>
                    <small>{chassis.description}</small>
                  </span>
                </label>
              ))}
            </fieldset>
            {handle.props.error && (
              <p role="alert" mix={errorStyle}>
                {handle.props.error}
              </p>
            )}
            <button type="submit" mix={[button, primaryButton]}>
              Start this build →
            </button>
          </form>
        </section>

        <Frame name="car-list" src={routes.garage.index.href()} />
      </div>
    </Layout>
  );
}

const heroStyle = css({
  minHeight: 190,
  display: "flex",
  alignItems: "end",
  justifyContent: "space-between",
  gap: 24,
  marginBottom: 34,
  paddingBottom: 28,
  borderBottom: `2px solid ${colors.ink}`,
});
const heroTitle = css({
  margin: "8px 0 0",
  fontFamily: "Georgia, 'Times New Roman', serif",
  fontSize: "clamp(40px, 7vw, 76px)",
  fontStyle: "italic",
  fontWeight: 500,
  letterSpacing: "-0.055em",
  lineHeight: 0.98,
});
const garageGrid = css({
  display: "grid",
  gridTemplateColumns: "minmax(280px, 0.7fr) minmax(0, 1.3fr)",
  gap: 28,
  alignItems: "start",
  "@media (max-width: 820px)": { gridTemplateColumns: "1fr" },
});
const sectionTitle = css({
  margin: "6px 0 22px",
  fontSize: 24,
  letterSpacing: "-0.035em",
});
const chassisFieldset = css({
  margin: 0,
  padding: 0,
  display: "grid",
  gap: 8,
  border: 0,
  "& legend": {
    marginBottom: 8,
    color: "#4e504f",
    fontSize: 12,
    fontWeight: 700,
  },
});
const chassisOption = css({
  minHeight: 62,
  padding: 11,
  display: "flex",
  alignItems: "center",
  gap: 11,
  background: "#f7f4eb",
  border: `1px solid ${colors.line}`,
  borderRadius: 4,
  cursor: "pointer",
  "&:has(input:checked)": {
    borderColor: colors.red,
    boxShadow: `inset 4px 0 ${colors.red}`,
  },
  "& strong, & small": { display: "block" },
  "& strong": { marginBottom: 3, fontSize: 13 },
  "& small": { color: colors.muted, lineHeight: 1.35 },
});
const errorStyle = css({
  margin: 0,
  color: colors.redDark,
  fontSize: 13,
  fontWeight: 700,
});
