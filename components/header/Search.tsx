import { SEARCHBAR_POPUP_ID } from "../../constants.ts";
import { IconSearch } from "../Icons/IconSearch.tsx";
import Searchbar, { SearchbarProps } from "../search/Searchbar/Form.tsx";
import Modal from "../ui/Modal.tsx";

interface SearchProps {
  searchbar: SearchbarProps;
  loading?: "eager" | "lazy";
}

export function Search({ searchbar, loading }: SearchProps) {
  return (
    <>
      <Modal id={SEARCHBAR_POPUP_ID}>
        <div class="absolute top-0 bg-base-100 container">
          {loading === "lazy"
            ? (
              <div class="flex justify-center items-center">
                <span class="loading loading-spinner" />
              </div>
            )
            : <Searchbar {...searchbar} />}
        </div>
      </Modal>
      <label
        for={SEARCHBAR_POPUP_ID}
        class="w-[243px] desk-small:w-[150px] bg-primary-content h-10 cursor-pointer rounded-lg flex items-center px-2 justify-between gap-2"
        aria-label="search icon button"
      >
        <span class="text-base-400 truncate text-xs">
          Search products, brands...
        </span>
        <IconSearch />
      </label>
    </>
  );
}