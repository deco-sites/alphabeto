import { Product } from "apps/commerce/types.ts";
import { clx } from "site/sdk/clx.ts";
import VTEXImageTag from "site/components/VTEXImageTag.tsx";

interface Props {
  product: Product;
  isOpen: boolean;
}

export default function ProductImages(props: Props) {
  const { product, isOpen } = props;
  const video = product
    .isVariantOf?.hasVariant.find((variant) => variant.video?.[0].contentUrl)
    ?.video?.[0].contentUrl ??
    null;
  return (
    <div
      id="quickviewImages"
      style={{ scrollbarWidth: "none" }}
      class={clx(
        "fixed top-0 z-50 h-screen p-4 overflow-y-auto transition-transform bg-white w-[375px] flex flex-col gap-[10px]",
        isOpen ? "translate-x-0 right-[375px]" : "translate-x-full right-0",
      )}
    >
      {video && (
        <video
          controls={false}
          muted
          autoPlay
          loop
          class="rounded-md w-full aspect-[327/507] object-cover"
        >
          <source src={video} type="video/mp4" />
        </video>
      )}
      {product.image?.map((image, index) => (
        <div key={index} className="">
          <VTEXImageTag
            src={image.url ?? ""}
            width={327}
            height={507}
            alt={image.alternateName || "Image"}
            title={image.name || "Image"}
            className="rounded-md w-full aspect-[327/507] object-cover"
          />
        </div>
      ))}
    </div>
  );
}
