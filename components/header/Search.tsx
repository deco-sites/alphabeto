import { SEARCHBAR_POPUP_ID } from "../../constants.ts";
import Searchbar, { SearchbarProps } from "../search/Searchbar/Form.tsx";
import Icon from "../ui/Icon.tsx";
import Modal from "../ui/Modal.tsx";

interface SearchProps {
    searchbar: SearchbarProps;
    loading?: "eager" | "lazy";
}

export function Search({searchbar, loading}: SearchProps) {
  return (
    <>
      <Modal id={SEARCHBAR_POPUP_ID}>
        <div class="absolute top-0 bg-base-100 container">
          {loading === "lazy" ? (
            <div class="flex justify-center items-center">
              <span class="loading loading-spinner" />
            </div>
          ) : (
            <Searchbar {...searchbar} />
          )}
        </div>
      </Modal>
      <label
        for={SEARCHBAR_POPUP_ID}
        class="max-w-[243px] bg-primary-content flex items-center gap-2 w-full"
        aria-label="search icon button"
      >
        <span class="text-base-400 truncate">Search products, brands...</span>
        <Icon id="search" />
      </label>
    </>
  );
}
