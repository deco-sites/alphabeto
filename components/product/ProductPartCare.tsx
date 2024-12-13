import { Product } from "apps/commerce/types.ts";
import Icon, { AvailableIcons } from "site/components/ui/Icon.tsx";
import { clx } from "site/sdk/clx.ts";

interface Care {
  name: string;
  icon: AvailableIcons;
  propertyName: string;
  color: string;
}

const cares: Care[] = [
  {
    name: "Lavar",
    icon: "product_care_wash",
    propertyName: "Cuidado com a Peça - Lavar",
    color: "hover:bg-[#FF859A] hover:border-[#FF859A]",
  },
  {
    name: "Alvejar",
    icon: "product_care_bleach",
    propertyName: "Cuidado com a Peça - Alvejar",
    color: "hover:bg-[#D6DE23] hover:border-[#D6DE23]",
  },
  {
    name: "Centrifugar",
    icon: "product_care_spin",
    propertyName: "Cuidado com a Peça - Centrifugar",
    color: "hover:bg-[#70D1E8] hover:border-[#70D1E8]",
  },
  {
    name: "Passar",
    icon: "product_care_iron",
    propertyName: "Cuidado com a Peça - Passar",
    color: "hover:bg-[#FF8300] hover:border-[#FF8300]",
  },
  {
    name: "Solventes",
    icon: "product_care_dry_cleaning",
    propertyName: "Cuidado com a Peça - Solventes",
    color: "hover:bg-[#B3B5C3] hover:border-[#B3B5C3]",
  },
];

interface ProductPartCareProps {
  product: Product;
}

export default function ProductPartCare(props: ProductPartCareProps) {
  const properties = props.product.isVariantOf?.additionalProperty;
  if (!properties) return null;
  const caresVisible = cares
    .map((care) => {
      const property = properties.find((p) => p.name === care.propertyName);
      return {
        ...care,
        value: property?.value || "",
      };
    })
    .filter((care) => care.value);
  return (
    <div class="flex flex-col mt-5 relative">
      <div class="flex justify-between w-full">
        {caresVisible.map((care) => (
          <div
            key={care.name}
            class={clx(
              "flex items-center gap-2 flex-col justify-center group cursor-pointer",
              "w-[58px] h-[58px] desk:w-[73px] desk:h-[55px]",
              "rounded desk:rounded-lg border border-primary border-dashed",
              "text-primary hover:text-white",
              `bg-secondary-content group`,
              care.color
            )}
          >
            <Icon id={care.icon} size={24} />
            <span class="text-[10px] leading-3 group-hover:font-bold">
              {care.name}
            </span>
            <span class="absolute left-0 -bottom-[15px] hidden group-hover:block text-xs leading-[14px] font-medium text-[#353535]">
              {care.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
