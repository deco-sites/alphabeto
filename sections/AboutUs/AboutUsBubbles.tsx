import { ImageWidget, RichText } from "apps/admin/widgets.ts";
import Image from "apps/website/components/Image.tsx";
import { sanitizeHTMLCode } from "site/sdk/htmlSanitizer.ts";
/** @title {{alt}}	*/
interface AdditionalInfoImages {
  image: ImageWidget;
  alt: string;
}
interface Props {
  title: RichText;
  images: AdditionalInfoImages[];
}

export default function AboutUsBubbles({ title, images }: Props) {
  return (
    <div class="container flex flex-col items-center justify-center w-full mb-20 desk:mb-[100px]">
      <h3
        class="font-beccaPerry text-center text-[40px] mobile:text-[28px] text-primary mb-[40px]"
        dangerouslySetInnerHTML={{
          __html: sanitizeHTMLCode(title, {
            allowedTags: ["span", "br"],
            removeWrapperTag: true,
          }),
        }}
      />
      <span class="flex container justify-center w-full">
        {images.map((image) => (
          <Image
            class="mx-[20px] mobile:mx-[8.5px] mobile:w-[100px]"
            src={image.image}
            width={120}
            height={120}
            alt={image.alt}
          />
        ))}
      </span>
    </div>
  );
}
