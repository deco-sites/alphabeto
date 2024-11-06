import { Picture, Source } from "apps/website/components/Picture.tsx";
import { Card as CardProps } from "site/components/footer/types.ts";
import { ButtonAnchor, ButtonType } from "site/components/ui/Button.tsx";

export function Card(props: CardProps) {
  const { image } = props;

  return (
    <article class="bg-primary flex text-white gap-[10px] items-center p-[10px] desk:p-5 rounded-2xl">
      <Picture>
        <Source
          media="(max-width: 1023px)"
          src={image.mobile}
          width={147}
          height={165}
        />
        <Source
          media="(min-width: 1024px)"
          src={image.desktop}
          width={186}
          height={171}
        />
        <img
          src={image.mobile}
          alt={image.alt}
          class="rounded-md"
        />
      </Picture>
      <div>
        {props.badge && (
          <span class="text-xs leading-[18px] font-bold">
            {props.badge}
          </span>
        )}
        <h3 class="font-beccaPerry text-xl leading-6 font-medium">
          {props.title}
        </h3>
        <p class="text-xs leading-[18px] max-w-[158px] desk:max-w-[187px] mt-[10px]  mb-[14px]">
          {props.description}
        </p>
        <ButtonAnchor
          styleType={ButtonType.Secondary}
          href={props.button.href}
          disableHover
          class="text-xs leading-[18px] mobile:px-3 min-h-[35px] h-[35px]"
        >
          {props.button.text}
        </ButtonAnchor>
      </div>
    </article>
  );
}
