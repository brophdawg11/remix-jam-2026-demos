import { clientEntry, css, on, type Handle } from "remix/component";

import type { Part, PartCategory } from "../../../data/public/catalog.ts";
import type { Car } from "../../../data/garage-store.ts";
import { routes } from "../../../routes.ts";
import { debounce } from "../../../utils/public/debounce.ts";
import {
  button,
  colors,
  field,
  label,
  panel,
} from "../../../ui/public/styles.ts";
import { PartList } from "./part-list.tsx";

export const InventorySearch = clientEntry(
  import.meta.url,
  function InventorySearch(
    handle: Handle<{
      carId: string;
      category: PartCategory;
      query: string;
      parts: Part[];
      installedParts: Car["parts"];
    }>,
  ) {
    let query = handle.props.query;
    let renderedQuery = query;
    let editing = false;
    let searching = false;
    let focusedInput: HTMLInputElement | undefined;

    let submitSearch = debounce(
      (input: HTMLInputElement) => {
        if (document.activeElement === input) focusedInput = input;
        input.form?.requestSubmit();
      },
      200,
      handle.signal,
    );

    handle.frame.addEventListener(
      "reloadComplete",
      () => {
        searching = false;
        if (query === handle.props.query) editing = false;
        handle.update();
      },
      { signal: handle.signal },
    );

    handle.queueTask(() => {
      window.navigation?.addEventListener(
        "navigatesuccess",
        () => {
          // A top-frame navigation resets focus; keep auto-search ready for the next keystroke.
          if (
            focusedInput?.isConnected &&
            document.activeElement === document.body
          ) {
            focusedInput.focus({ preventScroll: true });
          }
          focusedInput = undefined;
        },
        { signal: handle.signal },
      );
    });

    return () => {
      let { carId, category, parts, installedParts } = handle.props;
      if (handle.props.query !== renderedQuery) {
        renderedQuery = handle.props.query;
        // A response to an earlier keystroke must not overwrite a newer draft.
        if (!editing) query = renderedQuery;
      }

      return (
        <section
          mix={[panel, css({ overflow: "hidden" })]}
          aria-labelledby="inventory-search-title"
        >
          <header mix={searchHeader}>
            <h2
              id="inventory-search-title"
              mix={css({ margin: "4px 0 0", fontSize: 24 })}
            >
              Find a part
            </h2>
          </header>
          <form
            role="search"
            aria-label="Inventory"
            action={routes.garage.show.href({ carId, category })}
            method="get"
            data-rmx-history="replace"
            data-rmx-reset-scroll="false"
            mix={[
              searchForm,
              on("submit", () => {
                submitSearch.cancel();
                searching = true;
                handle.update();
              }),
            ]}
          >
            <label for="inventory-search" mix={label}>
              Search all inventory
            </label>
            <div mix={searchControls}>
              <input
                id="inventory-search"
                type="search"
                name="q"
                value={query}
                placeholder="Name, specs, or description"
                aria-describedby="inventory-search-status"
                mix={[
                  field,
                  css({ minWidth: 0 }),
                  on("input", (event) => {
                    query = event.currentTarget.value;
                    editing = true;
                    submitSearch(event.currentTarget);
                    handle.update();
                  }),
                  on("blur", (event) => {
                    if (event.relatedTarget) focusedInput = undefined;
                  }),
                ]}
              />
              <button type="submit" mix={button}>
                Search
              </button>
            </div>
            <span id="inventory-search-status" role="status" mix={searchStatus}>
              {searching
                ? "Searching…"
                : handle.props.query.trim()
                  ? `${parts.length} ${parts.length === 1 ? "match" : "matches"} across all categories`
                  : "Searches every category as you type"}
            </span>
          </form>
          {parts.length === 0 ? (
            <p mix={emptyResults}>
              {handle.props.query.trim()
                ? `No parts match “${handle.props.query}”. Try another name, specification, or category.`
                : "Find parts by name, specification, or category without leaving the catalog above."}
            </p>
          ) : (
            <PartList parts={parts} installedParts={installedParts} />
          )}
        </section>
      );
    };
  },
);

const searchHeader = css({ padding: "20px 22px 0" });
const emptyResults = css({
  margin: 0,
  padding: "18px 22px",
  color: colors.muted,
  fontSize: 13,
  lineHeight: 1.5,
});

const searchForm = css({
  display: "grid",
  gap: 8,
  padding: "16px 18px",
  borderBottom: `1px solid ${colors.line}`,
});
const searchControls = css({ display: "flex", gap: 8 });
const searchStatus = css({ color: colors.muted, fontSize: 11, minHeight: 14 });
