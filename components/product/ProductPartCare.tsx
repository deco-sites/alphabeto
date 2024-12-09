import Icon, { AvailableIcons } from "site/components/ui/Icon.tsx";
import { clx } from "site/sdk/clx.ts";

interface Care {
  name: string;
  icon: AvailableIcons;
}

const cares: Care[] = [
  {
    name: "Lavar",
    icon: "product_care_wash",
  },
  {
    name: "Alvejar",
    icon: "product_care_bleach",
  },
  {
    name: "Centrifugar",
    icon: "product_care_spin",
  },
  {
    name: "Passar",
    icon: "product_care_iron",
  },
  {
    name: "Solventes",
    icon: "product_care_dry_cleaning",
  },
];
export default function ProductPartCare() {
  return (
    <div class="flex justify-between mt-5">
      {cares.map((care) => (
        <div
          key={care.name}
          class={clx(
            "flex items-center gap-2 flex-col justify-center group cursor-pointer",
            "w-[58px] h-[58px] desk:w-[73px] desk:h-[55px]",
            "rounded desk:rounded-lg border border-primary border-dashed hover:mobile:border-[#FF859A] hover:border-solid",
            "text-primary hover:text-white",
            "bg-secondary-content hover:bg-[#FF859A] hover:desk:bg-primary"
          )}
        >
          <Icon id={care.icon} size={24} />
          <span class="text-[10px] leading-3 group-hover:font-bold">
            {care.name}
          </span>
        </div>
      ))}
    </div>
  );
}
