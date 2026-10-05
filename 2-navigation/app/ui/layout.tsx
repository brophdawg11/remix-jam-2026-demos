import { css, type Handle, type RemixNode } from "remix/component";

import { routes } from "../routes.ts";
import { colors } from "./public/styles.ts";

export function Layout(handle: Handle<{ children: RemixNode }>) {
  return () => (
    <div mix={pageStyle}>
      <a href="#main" mix={skipLink}>
        Skip to content
      </a>
      <header mix={headerStyle}>
        <a
          href={routes.garage.index.href()}
          mix={brandStyle}
          aria-label="Remix Garage home"
        >
          <span mix={badgeStyle}>R</span>
          <span>
            REMIX <strong>GARAGE</strong>
          </span>
        </a>
        <span mix={demoIdentifierStyle}>Top-frame</span>
        <div
          mix={css({
            display: "flex",
            alignItems: "center",
            justifySelf: "end",
            gap: 12,
          })}
        >
          <span mix={statusStyle}>● SHOP OPEN</span>
          <a href={routes.garage.index.href()} mix={garageLinkStyle}>
            My garage
          </a>
        </div>
      </header>
      <main id="main" mix={mainStyle}>
        {handle.props.children}
      </main>
      <footer mix={footerStyle}>
        <span>Remix Garage · Built from web-standard parts</span>
        <span>Measure twice. Ship once.</span>
      </footer>
    </div>
  );
}

const pageStyle = css({
  minHeight: "100vh",
  color: colors.ink,
  background: `${colors.paper} radial-gradient(#d5d1c5 0.75px, transparent 0.75px)`,
  backgroundSize: "16px 16px",
  fontFamily:
    "'Avenir Next', 'Helvetica Neue', ui-sans-serif, system-ui, sans-serif",
  "& *": { boxSizing: "border-box" },
  "& :focus-visible": {
    outline: `3px solid ${colors.yellow}`,
    outlineOffset: 3,
  },
  "& button, & input, & select, & textarea": { fontFamily: "inherit" },
});

const headerStyle = css({
  minHeight: 74,
  padding: "14px max(20px, calc((100% - 1180px) / 2))",
  display: "grid",
  gridTemplateColumns: "minmax(0, 1fr) auto minmax(0, 1fr)",
  alignItems: "center",
  gap: 20,
  color: "#fff",
  background: colors.ink,
  borderBottom: `4px solid ${colors.red}`,
  "@media (max-width: 600px)": { gridTemplateColumns: "1fr auto", rowGap: 8 },
});

const demoIdentifierStyle = css({
  fontSize: 13,
  fontWeight: 700,
  textAlign: "center",
  whiteSpace: "nowrap",
  "@media (max-width: 600px)": { gridColumn: "1 / -1", gridRow: 2 },
});

const brandStyle = css({
  justifySelf: "start",
  display: "flex",
  alignItems: "center",
  gap: 11,
  color: "#fff",
  fontSize: 15,
  letterSpacing: "0.06em",
  textDecoration: "none",
});

const badgeStyle = css({
  width: 38,
  height: 38,
  display: "grid",
  placeItems: "center",
  color: "#fff",
  background: colors.red,
  border: "2px solid #fff",
  fontSize: 21,
  fontWeight: 900,
  transform: "skew(-7deg)",
});

const statusStyle = css({
  color: "#b8d8c5",
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: "0.1em",
  "@media (max-width: 540px)": { display: "none" },
});

const garageLinkStyle = css({
  minHeight: 44,
  display: "inline-flex",
  alignItems: "center",
  color: "#fff",
  fontSize: 12,
  fontWeight: 700,
  textDecoration: "underline",
  textUnderlineOffset: 4,
});

const mainStyle = css({
  width: "min(1180px, 100%)",
  margin: "0 auto",
  padding: "42px 24px 28px",
  "@media (max-width: 600px)": { padding: "28px 16px 20px" },
});

const footerStyle = css({
  width: "min(1180px, 100%)",
  margin: "0 auto",
  padding: "16px 24px 36px",
  display: "flex",
  justifyContent: "space-between",
  gap: 18,
  color: colors.muted,
  fontSize: 11,
  "@media (max-width: 600px)": {
    padding: "12px 16px 28px",
    flexDirection: "column",
  },
});

const skipLink = css({
  position: "absolute",
  left: 16,
  top: -100,
  zIndex: 10,
  padding: 12,
  color: colors.ink,
  background: "#fff",
  "&:focus": { top: 12 },
});
