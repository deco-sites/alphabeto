/**
 * We use a custom route at /s?q= to perform the search. This component
 * redirects the user to /s?q={term} when the user either clicks on the
 * button or submits the form. Make sure this page exists in deco.cx/admin
 * of yout site. If not, create a new page on this route and add the appropriate
 * loader.
 *
 * Note that this is the most performatic way to perform a search, since
 * no JavaScript is shipped to the browser!
 */
import { asResolved, type Resolved } from "@deco/deco";
import { useScript } from "@deco/deco/hooks";
import { ImageWidget } from "apps/admin/widgets.ts";
import { Suggestion } from "apps/commerce/types.ts";
import {
  SEARCHBAR_INPUT_FORM_ID,
  SEARCHBAR_POPUP_ID,
} from "../../../constants.ts";
import { clx } from "../../../sdk/clx.ts";
import { useId } from "../../../sdk/useId.ts";
import { useComponent } from "../../../sections/Component.tsx";
import { IconSearch } from "../../Icons/IconSearch.tsx";
import Icon from "../../ui/Icon.tsx";
import { Props as SuggestionProps } from "./Suggestions.tsx";
import TopSearchs from "./TopSearchs.tsx";
// When user clicks on the search button, navigate it to
export const ACTION = "/s";
// Querystring param used when navigating the user
export const NAME = "q";

export interface SearchbarProps {
  /**
   * @title Placeholder
   * @description Search bar default placeholder message
   * @default What are you looking for?
   */
  placeholder?: string;
  /**
   * @title Most Seller Terms
   * @description List of most searched terms
   */
  mostSellerTerms: string[];
  /**
   *  @title Banner
   * @description Banner image to display on the search bar results
   */
  banner?: ImageWidget;
  /**
   *  @title Banner Mobile
   * @description Banner image to display on the search bar results for mobile screens
   */
  bannerMobile?: ImageWidget;
  /**
   * @title Banner Alternative Text
   * @description Banner image alternative text to people with disabilities
   */
  bannerAlt?: string;
  /** @title SearchBar Loader
   * @description Loader to run when suggesting new elements
   */
  loader: Resolved<Suggestion | null>;
  /**
   * @title Top Search Loader
   * @description Loader to run when most searched items are requested
   */
  topSearch: Resolved<Suggestion>;
}

export interface SearchBarComponentProps
  extends Omit<SearchbarProps, "topSearch"> {
  topSearch: Suggestion;
}

const script = (formId: string, name: string, popupId: string) => {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  const input = form?.elements.namedItem(name) as HTMLInputElement | null;
  form?.addEventListener("submit", () => {
    const search_term = input?.value;
    if (search_term) {
      window.DECO.events.dispatch({
        name: "search",
        params: { search_term },
      });
    }
  });
  // Keyboard event listeners
  addEventListener("keydown", (e: KeyboardEvent) => {
    const isK = e.key === "k" || e.key === "K" || e.keyCode === 75;
    // Open Searchbar on meta+k
    if (e.metaKey === true && isK) {
      const input = document.getElementById(popupId) as HTMLInputElement | null;
      if (input) {
        input.checked = true;
        document.getElementById(formId)?.focus();
      }
    }
  });
};
const Suggestions = import.meta.resolve("./Suggestions.tsx");

export default function Searchbar(
  {
    placeholder,
    loader,
    banner,
    bannerAlt,
    bannerMobile,
    topSearch,
    mostSellerTerms,
  }: SearchBarComponentProps,
) {
  const slot = useId();
  return (
    <div
      class={clx(
        "flex flex-col gap-[22px] px-5 overflow-y-auto max-h-dvh",
        "desk:gap-8 desk:max-w-[95rem] desk:w-full desk:mx-auto desk:px-10",
      )}
    >
      <form
        id={SEARCHBAR_INPUT_FORM_ID}
        action={ACTION}
        class="join bg-primary-content mt-5 rounded-lg"
      >
        <button
          type="submit"
          class="join-item no-animation w-10 flex justify-center items-center"
          aria-label="Search"
          for={SEARCHBAR_INPUT_FORM_ID}
          tabIndex={-1}
        >
          <span class="loading text-primary loading-spinner loading-xs hidden [.htmx-request_&]:inline" />
          <span class="inline [.htmx-request_&]:hidden">
            <IconSearch />
          </span>
        </button>
        <input
          autoFocus
          tabIndex={0}
          class="join-item flex-grow bg-transparent h-10 outline-none text-xs"
          name={NAME}
          placeholder={placeholder}
          autocomplete="off"
          hx-target={`#${slot}`}
          hx-post={loader &&
            useComponent<SuggestionProps>(Suggestions, {
              loader: asResolved(loader),
              banner,
              bannerAlt,
              bannerMobile,
            })}
          hx-trigger={`input changed delay:300ms, ${NAME}`}
          hx-indicator={`#${SEARCHBAR_INPUT_FORM_ID}`}
          hx-swap="innerHTML"
        />
        <label
          type="button"
          class="join-item btn btn-ghost btn-square sm:inline-flex no-animation text-accent min-h-10 h-10 w-10"
          for={SEARCHBAR_POPUP_ID}
          aria-label="Toggle searchbar"
        >
          <Icon id="close-search" />
        </label>
      </form>

      {/* Suggestions slot */}
      <div id={slot}>
        <TopSearchs suggestion={topSearch} mostSellerTerms={mostSellerTerms} />
      </div>

      {/* Send search events as the user types */}
      <script
        type="module"
        dangerouslySetInnerHTML={{
          __html: useScript(
            script,
            SEARCHBAR_INPUT_FORM_ID,
            NAME,
            SEARCHBAR_POPUP_ID,
          ),
        }}
      />
    </div>
  );
}
