import { RichText } from "apps/admin/widgets.ts";
import { sanitizeHTMLCode } from "site/sdk/htmlSanitizer.ts";
import Icon from "site/components/ui/Icon.tsx";

interface Props {
  title: RichText;
  description: RichText;
  list: string[];
}

export function loader(props: Props, req: Request) {
  const urlObj = new URL(req.url);
  const query = decodeURIComponent(urlObj.searchParams.get("q") || "");
  return {
    ...props,
    query,
  };
}

export default function SearchNotFound(props: ReturnType<typeof loader>) {
  return (
    <div class="max-w-[584px] mx-auto w-full mt-20 mobile:mt-[60px] mobile:max-w-[calc(100vw_-_40px)]">
      <h1
        class="text-[44px] leading-[52px] font-beccaPerry text-[#676767] [&>strong]:text-primary [&>strong]:font-medium font-medium text-center mobile:max-w-[262px] mobile:text-[32px] mobile:leading-[38px] mobile:mx-auto"
        dangerouslySetInnerHTML={{
          __html: sanitizeHTMLCode(props.title, {
            allowedTags: ["strong", "span"],
            removeWrapperTag: true,
          }),
        }}
      />
      <h2 class="text-[#E03020] font-beccaPerry text-xl leading-6 my-10 font-medium text-center mobile:my-[30px]">
        "{props.query}"
      </h2>
      <p
        dangerouslySetInnerHTML={{
          __html: sanitizeHTMLCode(props.description, {
            allowedTags: ["strong", "span", "br"],
            removeWrapperTag: true,
          }),
        }}
        class="text-[16px] leading-6 text-[#7E7F88] mb-9 text-center mobile:max-w-[262px] mobile:text-[14px] mobile:leading-[21px] mobile:mx-auto"
      />
      <ul class="flex flex-col gap-3">
        {props.list.map((item) => (
          <li
            class="text-[16px] leading-6 text-[#7E7F88] mobile:text-[13px] mobile:leading-[18px]"
            key={item}
          >
            <Icon
              id="single-star"
              size={16}
              class="inline-block mr-2.5 mobile:mr-1"
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
