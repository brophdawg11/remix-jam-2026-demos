import { clientEntry, css, on, type Handle } from "remix/component";

import { colors, field, panel } from "../../../ui/public/styles.ts";

export const PitNotes = clientEntry(
  import.meta.url,
  function PitNotes(handle: Handle<{ carId: string }>) {
    let key = `remix-garage:notes:${handle.props.carId}`;
    let value = "";
    let saved = false;
    if (typeof window !== "undefined") {
      queueMicrotask(() => {
        value = window.localStorage.getItem(key) ?? "";
        saved = value.length > 0;
        if (!handle.signal.aborted) handle.update();
      });
    }

    return () => (
      <section
        mix={[panel, css({ padding: 18 })]}
        aria-labelledby="pit-notes-title"
      >
        <div mix={notesHeader}>
          <div>
            <h2
              id="pit-notes-title"
              mix={css({ margin: "4px 0 0", fontSize: 18 })}
            >
              Pit notes
            </h2>
          </div>
          <span role="status" aria-live="polite" mix={savedStyle}>
            {saved ? "Saved locally" : "Not saved"}
          </span>
        </div>
        <label
          mix={css({
            display: "grid",
            gap: 8,
            color: colors.muted,
            fontSize: 11,
          })}
        >
          Notes for this build
          <textarea
            rows={5}
            value={value}
            placeholder="Alignment, lap setup, parts to try…"
            mix={[
              field,
              css({ resize: "vertical", lineHeight: 1.45 }),
              on("input", (event) => {
                value = event.currentTarget.value;
                window.localStorage.setItem(key, value);
                saved = true;
                handle.update();
              }),
            ]}
          />
        </label>
      </section>
    );
  },
);

const notesHeader = css({
  display: "flex",
  alignItems: "start",
  justifyContent: "space-between",
  gap: 14,
  marginBottom: 14,
});
const savedStyle = css({
  color: colors.green,
  fontSize: 10,
  fontWeight: 800,
  textTransform: "uppercase",
});
