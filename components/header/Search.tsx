import { SEARCHBAR_POPUP_ID } from "../../constants.ts";
import { IconSearch } from "../Icons/IconSearch.tsx";
import Searchbar, {
  SearchBarComponentProps,
} from "../search/Searchbar/Form.tsx";
import Modal from "../ui/Modal.tsx";

interface SearchProps {
  searchbar: SearchBarComponentProps;
  loading?: "eager" | "lazy";
}

export function SearchDesktop({ searchbar, loading }: SearchProps) {
  return (
    <>
      <Modal id={SEARCHBAR_POPUP_ID} class="!bg-transparent">
        <div class="absolute top-[30px] bg-base-100 w-full">
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
        <span class="text-[#353535] truncate text-xs">
          {searchbar.placeholder}
        </span>
        <IconSearch />
      </label>
    </>
  );
}

export function SearchMobile({ searchbar, loading }: SearchProps) {
  return (
    <>
      <Modal id={SEARCHBAR_POPUP_ID} class="!bg-transparent">
        <div class="absolute top-0 bg-base-100 w-full">
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
        class="btn btn-square btn-sm btn-ghost w-fit"
        aria-label="search icon button"
      >
        <IconSearch />
      </label>
    </>
  );
}
