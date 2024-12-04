import { useDevice, useScriptAsDataURI } from "@deco/deco/hooks";
import Button, { ButtonType, TextStyles } from "site/components/ui/Button.tsx";

export interface FilterMobileLogics {
  expectedFinalUrl: URL;
  device: ReturnType<typeof useDevice>;
  filterChange: (
    key: string,
    value: string,
    url: string,
    selected: boolean,
  ) => void;
  updatePriceFilter: (min: number, max: number, url: string) => void;
  categoryMistake: (url: string) => void;
  clearAllFilters: () => void;
  finishFiltering: () => void;
}

declare global {
  interface Window {
    FILTER_LOGICS: FilterMobileLogics;
  }
}

function createFilterMobileLogics(device: ReturnType<typeof useDevice>) {
  window.FILTER_LOGICS = {
    device: device,
    expectedFinalUrl: new URL(window.location.href),
    clearAllFilters() {
      const searchParamsKeys = Array.from(
        this.expectedFinalUrl.searchParams.keys(),
      );
      for (const key of searchParamsKeys) {
        if (key.startsWith("filter.") || key === "page") {
          this.expectedFinalUrl.searchParams.delete(key);
        }
      }
      this.finishFiltering();
    },
    finishFiltering() {
      window.location.href = this.expectedFinalUrl.toString();
    },
    filterChange(key, value, url: string, selected) {
      const makerFilterParam = (key: string) => `filter.${key}`;
      if (selected) {
        this.expectedFinalUrl.searchParams.delete(
          makerFilterParam(key),
          value,
        );
      } else {
        this.expectedFinalUrl.searchParams.append(
          makerFilterParam(key),
          value,
        );
        this.categoryMistake(url);
      }

      if (this.device === "desktop") this.finishFiltering();
    },
    categoryMistake(url) {
      const urlData = new URL(url, window.location.href);
      const categoryOne = urlData.searchParams.get("filter.category-1");
      if (categoryOne) {
        this.expectedFinalUrl.searchParams.set(
          "filter.category-1",
          categoryOne,
        );
      }
    },
    updatePriceFilter(min, max, url) {
      this.expectedFinalUrl.searchParams.set(
        "filter.price",
        `${min}:${max}`,
      );
      this.categoryMistake(url);
      if (this.device === "desktop") this.finishFiltering();
    },
  };
}

export default function BottomFilterBar() {
  const device = useDevice();
  return (
    <div class="grid grid-cols-2 desk:hidden bg-secondary-content px-6 py-3 gap-3 w-full">
      <Button
        styleType={ButtonType.Secondary}
        textStyles={TextStyles.Small}
        class="border border-primary w-full h-11"
        hx-on:click="FILTER_LOGICS.clearAllFilters()"
      >
        Limpar filtros
      </Button>
      <Button
        styleType={ButtonType.Primary}
        textStyles={TextStyles.Small}
        class="w-full h-11"
        hx-on:click="FILTER_LOGICS.finishFiltering()"
      >
        Filtrar
      </Button>
      <script
        src={useScriptAsDataURI(createFilterMobileLogics, device)}
      />
    </div>
  );
}
