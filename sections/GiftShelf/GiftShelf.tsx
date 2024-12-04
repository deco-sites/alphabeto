import { Section } from "@deco/deco/blocks";
import { ImageWidget } from "apps/admin/widgets.ts";

interface GiftShelfProps {
  title: string;
  description: string;
  image?: {
    src: ImageWidget;
    alt?: string;
  }
  section: Section;
}

export default function GiftShelf({ title, description, image, section }: GiftShelfProps) {
  return (
    <div className={"flex flex-col container mt-[100px]"}>
      <span class="flex flex-col gap-4">
        <h2 class="font-['BeccaPerry'] text-[44px] font-medium text-[#676767]">
          {title}
        </h2>
        <p class="text-[#676767] text-base font-medium">{description}</p>
      </span>
      <div className={"flex mt-10"}>
        <div> 
          <img className={"max-w-[608px]"} src={image?.src} alt={image?.alt} />
        </div>
        {<section.Component {...section.props} />}
      </div>
    </div>
  )
}