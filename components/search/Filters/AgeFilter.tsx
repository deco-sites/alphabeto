import { FilterToggle, FilterToggleValue } from "apps/commerce/types.ts";
import { clx } from "site/sdk/clx.ts";
import { isEvenStringNumber, strToNumber } from "site/sdk/stringUtils.ts";

interface BabyAgeValue extends FilterToggleValue {
  min: number;
  max: number;
}

function getFilterValues(
  { values }: FilterToggle,
  url: string,
): FilterToggle["values"] {
  const ageValues = values.filter((value) => isEvenStringNumber(value.label))
    .sort((a, b) => strToNumber(a.label) - strToNumber(b.label))
    .map((value) => ({ ...value, label: `${value.label}<br>anos` }));
  if (ageValues.length > 0) return ageValues;
  const babyAgeValues = values
    .filter((value) => {
      const BabyRegex = /(\d+)\s*(?:A|-)\s*(\d+)\s*M/g;
      const isBabyAgeValue = (label: string) => BabyRegex.test(label);
      const testValue = isBabyAgeValue(value.label);
      return testValue;
    })
    .map<BabyAgeValue>((value) => {
      const BabyRegex = /(\d+)\s*(?:A|-)\s*(\d+)\s*M/g;
      const match = BabyRegex.exec(value.label);
      const min = match?.at(1);
      const max = match?.at(2);
      return {
        ...value,
        min: strToNumber(min ?? ""),
        max: strToNumber(max ?? ""),
      };
    })
    .reduce<BabyAgeValue[]>((acc, value) => {
      const { min, max, url: currentUrl, selected } = value;
      const hasOtherSame = acc.findIndex((v) => v.min === min && v.max === max);

      if (hasOtherSame !== -1) {
        const otherUrl = acc[hasOtherSame].url;

        const mergeUrlSizeParam = (urlA: string, urlB: string) => {
          const urlAO = new URL(urlA, url);
          const urlBO = new URL(urlB, url);
          const sizeA = urlAO.searchParams.get("filter.tamanho");
          console.log(urlA, urlB);
          if (selected) {
            const sizeB = urlBO.searchParams.get("filter.tamanho");
            urlBO.searchParams.delete("filter.tamanho", sizeA ?? "");
            urlBO.searchParams.delete("filter.tamanho", sizeB ?? "");
          } else {
            urlBO.searchParams.append("filter.tamanho", sizeA ?? "");
          }
          return urlBO.href;
        };
        acc[hasOtherSame].url = mergeUrlSizeParam(otherUrl, currentUrl);
      } else {
        acc.push(value);
      }
      return acc;
    }, [])
    .map((value) => ({
      ...value,
      label: `${value.min} a ${value.max}<br>meses`,
    }))
    .sort((a, b) => a.min - b.min);

  return babyAgeValues;
}

interface Props {
  url: string;
  filterToogle: FilterToggle;
}

export default function AgeFilter({ filterToogle, url }: Props) {
  const filterValues = getFilterValues(filterToogle, url);
  return (
    <div class="carousel flex gap-12 w-fit max-w-[calc(100vw_-_40px)] mx-auto">
      {filterValues.map((value) => (
        <a
          href={value.url}
          class={clx(
            "rounded-full font-bold w-20 h-20 flex items-center justify-center text-primary break-all text-center carousel-item text-[20px] leading-[24px] box-border",
            value.selected
              ? "border border-primary bg-secondary"
              : "bg-secondary-content",
          )}
          dangerouslySetInnerHTML={{ __html: value.label }}
        />
      ))}
    </div>
  );
}
