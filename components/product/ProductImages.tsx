import { useDevice, useScriptAsDataURI } from "@deco/deco/hooks";
import { ProductDetailsPage } from "apps/commerce/types.ts";
import Image from "apps/website/components/Image.tsx";
import Slider from "site/components/ui/Slider.tsx";
import { useId } from "site/sdk/useId.ts";

export interface Props {
  /** @title Integration */
  page: ProductDetailsPage | null;
}

function handleImageZoom(id: string) {
  const images = document.querySelectorAll<HTMLImageElement>(`#${id} img`);
  images.forEach((image) => {
    image.addEventListener("click", (event) => {
      const applyZoom = image.style.transform !== "scale(1.5)";
      images.forEach((img) => img.style.transform = "scale(1)");
      if (applyZoom) {
        const rect = image.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100 + "%";
        const y = ((event.clientY - rect.top) / rect.height) * 100 + "%";

        image.style.transform = "scale(1.5)";
        image.style.transformOrigin = `${x} ${y}`;
      }
    });
  });
}

export default function ProductImages({ page }: Props) {
  const images = page?.product.image ?? [];
  const device = useDevice();
  const id = useId();
  const video = page?.product
    .isVariantOf?.hasVariant.find((variant) => variant.video?.[0].contentUrl)
    ?.video?.[0].contentUrl ??
    null;
  const dotClassNames =
    "disabled:bg-primary bg-secondary h-2 disabled:w-[30px] rounded-lg w-2 transition-all";
  const dots = images.map((_, index) => (
    <Slider.Dot
      index={index}
      class={dotClassNames}
    />
  ));

  if (video) {
    dots.push(
      <Slider.Dot
        index={images.length}
        class={dotClassNames}
      />,
    );
  }

  if (images.length === 0) {
    return null;
  }
  return (
    <div id={id} class="relative">
      <Slider class="mobile:carousel mobile:carousel-center desk:grid grid-cols-2 desk:gap-3">
        {video && (
          <Slider.Item
            class="mobile:carousel-item mobile:w-full"
            index={0}
          >
            <video
              src={video}
              class="desk:max-h-[min(44.68vw,658px)] max-h-[126.67vw] w-full object-cover rounded-lg"
              controls={false}
              autoplay
              muted
              loop
            />
          </Slider.Item>
        )}
        {images.map((image, index) => (
          <Slider.Item
            index={video ? index + 1 : index}
            class="mobile:carousel-item mobile:w-full overflow-hidden"
          >
            <Image
              width={427}
              class="desk:max-h-[min(44.68vw,658px)] max-h-[126.67vw] w-full object-cover rounded-lg relative transition-all"
              height={658}
              src={image.url ?? ""}
              alt={image.alternateName}
            />
          </Slider.Item>
        ))}
      </Slider>
      <div class="absolute bottom-2.5 flex gap-1 left-1/2 -translate-x-1/2 desk:hidden">
        {dots}
      </div>
      <script src={useScriptAsDataURI(handleImageZoom, id)} />
      {device !== "desktop" && <Slider.JS rootId={id} />}
    </div>
  );
}
