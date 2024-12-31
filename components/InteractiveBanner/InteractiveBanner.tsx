import { ImageWidget } from "apps/admin/widgets.ts";
import { useDevice } from "@deco/deco/hooks";
import Section from "site/components/ui/Section.tsx";
import Image from "apps/website/components/Image.tsx";
import { clx } from "site/sdk/clx.ts";
import InteractiveBannerProduct, {
  InteractiveBannerProductProps,
} from "site/components/InteractiveBanner/Product.tsx";

interface InteractiveBannerProps {
  interactiveBanner: {
    desktop: ImageWidget;
    mobile: ImageWidget;
    alt: string;
    products: InteractiveBannerProductProps[];
  };
  complementBanner: {
    desktop: ImageWidget;
    mobile: ImageWidget;
    alt: string;
  };
}

export default function InteractiveBanner({
  interactiveBanner,
  complementBanner,
}: InteractiveBannerProps) {
  const device = useDevice();
  const isLargeScreen = device === "desktop" || device === "tablet";

  const interactiveBannerImage = isLargeScreen
    ? interactiveBanner.desktop
    : interactiveBanner.mobile;
  const interactiveBannerSizes = isLargeScreen
    ? { width: 1360, height: 443 }
    : { width: 335, height: 503 };
  const interactiveBannerAspectRatio = isLargeScreen
    ? "aspect-[1360/443]"
    : "aspect-[335/503]";

  const complementBannerImage = isLargeScreen
    ? complementBanner.desktop
    : complementBanner.mobile;
  const complementBannerSizes = isLargeScreen
    ? { width: 1360, height: 112 }
    : { width: 335, height: 131 };
  const complementBannerAspectRatio = isLargeScreen
    ? "aspect-[1360/112]"
    : "aspect-[335/131]";
  return (
    <div class="container mt-20 desk:mt-[100px]">
      <div class={clx("relative", interactiveBannerAspectRatio)}>
        <Image
          src={interactiveBannerImage}
          alt={interactiveBanner.alt}
          width={interactiveBannerSizes.width}
          height={interactiveBannerSizes.height}
          class="w-full"
        />
        {interactiveBanner.products.map((product) => (
          <InteractiveBannerProduct {...product} key={product.label} />
        ))}
      </div>
      <div class={clx("relative", complementBannerAspectRatio)}>
        <Image
          src={complementBannerImage}
          alt={complementBanner.alt}
          width={complementBannerSizes.width}
          height={complementBannerSizes.height}
          class="w-full"
        />
      </div>
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="635px" />;
