import { ImageWidget } from "apps/admin/widgets.ts";
import { Picture, Source } from "apps/website/components/Picture.tsx";
import { AppContext } from "site/apps/site.ts";
import Icon from "site/components/ui/Icon.tsx";

interface Props {
  title: string;
  description: string;
  cta: {
    label: string;
    url: string;
  };
  image: {
    desktop: ImageWidget;
    mobile: ImageWidget;
  };
}

export function loader(
  props: Props,
  _req: Request,
  ctx: AppContext,
): Props {
  ctx.response.status = 404;
  return props;
}

export default function NotFound(props: Props) {
  return (
    <div class="relative">
      <Picture>
        <Source
          media="(min-width: 768px)"
          src={props.image.desktop}
          width={1440}
        />
        <Source
          media="(max-width: 767px)"
          src={props.image.mobile}
          width={767}
        />
        <img
          class="w-screen"
          src={props.image.desktop}
          alt="404"
        />
      </Picture>
      <div class="absolute top-[30px] mobile:top-[60px] left-1/2 -translate-x-1/2 max-w-[436px] w-full mobile:max-w-[calc(100vw_-_40px)]">
        <div class="relative">
          <h1 class="font-medium text-[300px] leading-[360px] font-beccaPerry text-center text-secondary mobile:text-[250px] mobile:leading-[300px]">
            404
          </h1>
          <div class="relative -top-[49px]">
            <h2 class="text-[44px] leading-[53px] font-beccaPerry text-center mb-[14px] text-[#676767] mobile:text-[32px]d mobile:leading-[38px]">
              {props.title}
            </h2>
            <p class="text-[#7E7F88] text-base mb-10 text-center mobile:text-[13px] mobile:leading-[18px]">
              {props.description}
            </p>
            <a
              class="text-primary font-bold text-xl leading-6 mobile:text-[14px] mobile:leading-[16px] flex gap-4 mobile:gap-2.5 justify-center"
              href={props.cta.url}
            >
              {props.cta.label}
              <Icon id="arrow-right" class="mobile:hidden" size={24} />
              <Icon id="arrow-right" class="desk:hidden" size={18} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
