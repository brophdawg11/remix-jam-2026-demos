import { css, type Handle } from "remix/component";

import { getPart } from "../../data/public/catalog.ts";
import type { Car } from "../../data/garage-store.ts";

export function CarIllustration(
  handle: Handle<{ parts: Car["parts"]; compact?: boolean }>,
) {
  return () => {
    let { parts, compact } = handle.props;
    let paint = parts.paint ? getPart(parts.paint) : undefined;
    let color = paint?.color ?? "#b7b9b8";
    let hasWing = parts.spoiler === "spoiler-wing";
    let hasDucktail = parts.spoiler === "spoiler-ducktail";
    let smoothHood = parts.hood === "hood-smooth";
    let ventedHood = parts.hood === "hood-vented";
    let i4Engine = parts.engine === "engine-i4";
    let v8Engine = parts.engine === "engine-v8";
    let v12Engine = parts.engine === "engine-v12";
    let apexChassis = parts.chassis === "chassis-apex";
    let sprintChassis = parts.chassis === "chassis-sprint";
    let hasTires = parts.tires !== undefined;
    let trackTires = parts.tires === "tires-track";
    let rallyTires = parts.tires === "tires-rally";
    let frontWheelPosition = sprintChassis ? "21%" : "18%";
    let rearWheelPosition = sprintChassis ? "20%" : "17%";

    return (
      <div
        role="img"
        aria-label={`Side view of the car in ${paint?.name ?? "primer"}`}
        mix={[
          carStage,
          compact
            ? css({ minHeight: 140, transform: "scale(0.84)" })
            : undefined,
        ]}
      >
        <div mix={shadowStyle} />
        {hasWing && <div mix={wingStyle} />}
        {hasDucktail && <div mix={ducktailStyle} />}
        <div
          mix={[
            bodyStyle,
            apexChassis ? apexBody : undefined,
            sprintChassis ? sprintBody : undefined,
            css({ background: color }),
          ]}
        >
          <div mix={[windowStyle, sprintChassis ? sprintWindow : undefined]} />
          {i4Engine && <div mix={[engineDetail, i4Scoop]} />}
          {v8Engine && <div mix={[engineDetail, v8Bulge]} />}
          {v12Engine && (
            <div mix={[engineDetail, v12Bulge]}>
              <span />
            </div>
          )}
          {smoothHood && <div mix={hoodCrease} />}
          {ventedHood && (
            <div mix={ventStyle}>
              <span />
              <span />
              <span />
            </div>
          )}
          <div mix={doorLineStyle} />
          {apexChassis && <div mix={apexSill} />}
          {sprintChassis && <div mix={sprintStripe} />}
        </div>
        <div
          mix={[
            wheelStyle,
            css({ left: frontWheelPosition }),
            !hasTires ? bareHub : undefined,
            trackTires ? trackWheel : undefined,
            rallyTires ? rallyWheel : undefined,
          ]}
        >
          <span mix={!hasTires ? bareRim : trackTires ? trackRim : rimStyle} />
        </div>
        <div
          mix={[
            wheelStyle,
            css({ right: rearWheelPosition }),
            !hasTires ? bareHub : undefined,
            trackTires ? trackWheel : undefined,
            rallyTires ? rallyWheel : undefined,
          ]}
        >
          <span mix={!hasTires ? bareRim : trackTires ? trackRim : rimStyle} />
        </div>
      </div>
    );
  };
}

const carStage = css({
  position: "relative",
  minHeight: 220,
  width: "100%",
  overflow: "hidden",
});
const shadowStyle = css({
  position: "absolute",
  left: "14%",
  right: "12%",
  bottom: "21%",
  height: 20,
  background: "rgba(20, 20, 20, 0.24)",
  borderRadius: "50%",
  filter: "blur(9px)",
});
const bodyStyle = css({
  position: "absolute",
  left: "9%",
  right: "8%",
  bottom: "28%",
  height: "39%",
  border: "3px solid #191b1d",
  borderRadius: "48% 16% 15% 12% / 38% 42% 18% 20%",
  boxShadow: "inset 0 -14px rgba(0, 0, 0, 0.14)",
  transform: "skewX(-3deg)",
  "&::before": {
    content: "''",
    position: "absolute",
    left: "32%",
    top: "-58%",
    width: "37%",
    height: "65%",
    background: "#20272b",
    border: "3px solid #191b1d",
    borderBottom: 0,
    borderRadius: "58% 46% 0 0",
    transform: "skewX(18deg)",
  },
});
const apexBody = css({
  left: "6%",
  right: "5%",
  bottom: "27%",
  height: "36%",
  borderRadius: "52% 13% 12% 10% / 42% 38% 15% 18%",
});
const sprintBody = css({
  left: "13%",
  right: "12%",
  bottom: "29%",
  height: "43%",
  borderRadius: "43% 21% 18% 14% / 35% 48% 20% 22%",
});
const windowStyle = css({
  position: "absolute",
  left: "35%",
  top: "-50%",
  width: "29%",
  height: "51%",
  zIndex: 1,
  background: "linear-gradient(145deg, #bde0e4, #46606a)",
  border: "2px solid #191b1d",
  borderRadius: "70% 35% 4px 4px",
  transform: "skewX(18deg)",
});
const sprintWindow = css({
  left: "33%",
  top: "-56%",
  width: "34%",
  height: "57%",
});
const wheelStyle = css({
  position: "absolute",
  bottom: "16%",
  width: 68,
  height: 68,
  display: "grid",
  placeItems: "center",
  zIndex: 2,
  background: "#17191b",
  border: "5px solid #292c2e",
  borderRadius: "50%",
  "@media (max-width: 540px)": { width: 56, height: 56 },
});
const bareHub = css({
  bottom: "20%",
  width: 48,
  height: 48,
  background: "#777d80",
  border: "4px solid #4e5457",
  "@media (max-width: 540px)": { width: 40, height: 40 },
});
const trackWheel = css({
  width: 72,
  height: 72,
  borderWidth: 3,
  boxShadow: "inset 0 0 0 2px #08090a",
  "@media (max-width: 540px)": { width: 60, height: 60 },
});
const rallyWheel = css({
  bottom: "10%",
  width: 86,
  height: 86,
  borderWidth: 10,
  borderStyle: "dashed",
  borderColor: "#0f1112",
  boxShadow: "inset 0 0 0 4px #34383a",
  "@media (max-width: 540px)": { width: 72, height: 72, borderWidth: 8 },
});
const rimStyle = css({
  width: "52%",
  height: "52%",
  display: "block",
  background: "#aeb3b5",
  border: "5px solid #5d6264",
  borderRadius: "50%",
});
const trackRim = css({
  width: "58%",
  height: "58%",
  display: "block",
  background: "#e6e1d5",
  border: "6px double #525759",
  borderRadius: "50%",
});
const bareRim = css({
  width: "50%",
  height: "50%",
  display: "block",
  background: "#303538",
  border: "4px dotted #b6bbbd",
  borderRadius: "50%",
});
const wingStyle = css({
  position: "absolute",
  right: "10%",
  bottom: "66%",
  width: 74,
  height: 8,
  zIndex: 2,
  background: "#1d2022",
  borderRadius: 2,
  transform: "skewX(-12deg)",
  "&::after": {
    content: "''",
    position: "absolute",
    right: 10,
    top: 6,
    width: 5,
    height: 24,
    background: "#1d2022",
  },
});
const ducktailStyle = css({
  position: "absolute",
  right: "8%",
  bottom: "62%",
  width: 48,
  height: 12,
  zIndex: 2,
  background: "#1d2022",
  clipPath: "polygon(0 70%, 100% 0, 100% 100%, 0 100%)",
});
const ventStyle = css({
  position: "absolute",
  left: "16%",
  top: "25%",
  display: "flex",
  gap: 4,
  transform: "skewX(-15deg)",
  "& span": { width: 18, height: 4, background: "#252729", borderRadius: 1 },
});
const hoodCrease = css({
  position: "absolute",
  left: "13%",
  top: "21%",
  width: "27%",
  height: 18,
  borderTop: "2px solid rgba(255, 255, 255, 0.5)",
  borderBottom: "2px solid rgba(25, 27, 29, 0.35)",
  transform: "skewX(-14deg)",
});
const engineDetail = css({ position: "absolute", zIndex: 2 });
const i4Scoop = css({
  left: "22%",
  top: "12%",
  width: 38,
  height: 10,
  background: "#202426",
  border: "2px solid #111315",
  borderRadius: "70% 20% 15% 15%",
  transform: "skewX(-10deg)",
});
const v8Bulge = css({
  left: "16%",
  top: "-8%",
  width: 78,
  height: 29,
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.28), rgba(0, 0, 0, 0.18))",
  border: "2px solid rgba(25, 27, 29, 0.72)",
  borderRadius: "60% 42% 15% 12%",
  transform: "skewX(-10deg)",
});
const v12Bulge = css({
  left: "12%",
  top: "-18%",
  width: 96,
  height: 40,
  background:
    "linear-gradient(180deg, rgba(255, 255, 255, 0.34), rgba(0, 0, 0, 0.2))",
  border: "3px solid #202426",
  borderRadius: "54% 38% 14% 12%",
  transform: "skewX(-9deg)",
  "& span": {
    position: "absolute",
    left: 22,
    right: 19,
    top: 8,
    height: 9,
    background: "#1d2022",
    borderRadius: 2,
  },
});
const apexSill = css({
  position: "absolute",
  left: "35%",
  right: "12%",
  bottom: -2,
  height: 8,
  background: "#202426",
  transform: "skewX(-16deg)",
});
const sprintStripe = css({
  position: "absolute",
  left: "39%",
  right: "12%",
  bottom: 12,
  height: 5,
  background: "rgba(255, 255, 255, 0.72)",
  transform: "skewX(-15deg)",
});
const doorLineStyle = css({
  position: "absolute",
  left: "50%",
  top: 5,
  bottom: 7,
  width: 1,
  background: "rgba(20, 20, 20, 0.48)",
});
