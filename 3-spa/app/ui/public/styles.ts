import { css } from "remix/component";

export const colors = {
  ink: "#191b1d",
  muted: "#6d706f",
  paper: "#f2f0e9",
  surface: "#fffdf7",
  line: "#d8d4c8",
  red: "#db3a2e",
  redDark: "#a92620",
  yellow: "#f3c94f",
  green: "#296351",
};

export const muted = css({ color: colors.muted, lineHeight: 1.55 });

export const panel = css({
  background: colors.surface,
  border: `1px solid ${colors.line}`,
  borderRadius: 6,
});

export const label = css({
  display: "grid",
  gap: 7,
  color: "#4e504f",
  fontSize: 12,
  fontWeight: 700,
});

export const field = css({
  width: "100%",
  minHeight: 44,
  padding: "10px 12px",
  color: colors.ink,
  background: "#fff",
  border: `1px solid ${colors.line}`,
  borderRadius: 4,
  font: "inherit",
  "&:focus": { borderColor: colors.red },
});

export const button = css({
  minHeight: 44,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  padding: "9px 15px",
  color: colors.ink,
  background: "#fff",
  border: `1px solid ${colors.ink}`,
  borderRadius: 4,
  fontSize: 12,
  fontWeight: 800,
  textDecoration: "none",
  cursor: "pointer",
  "&:hover": { background: "#f8f4e8" },
  "&:disabled": { cursor: "wait", opacity: 0.55 },
});

export const primaryButton = css({
  color: "#fff",
  background: colors.red,
  borderColor: colors.red,
  "&:hover": { background: colors.redDark },
});
