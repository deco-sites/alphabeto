import { useScriptAsDataURI } from "@deco/deco/hooks";
import { RichText } from "apps/admin/widgets.ts";
import generateJSONLDForFAQ, {
  appendJSONLDToHead,
} from "site/components/ui/FAQ/generateJSONLD.ts";
import Icon from "site/components/ui/Icon.tsx";
import { COMMON_HTML_TAGS_TO_ALLOW } from "site/constants.ts";
import { sanitizeHTMLCode } from "site/sdk/htmlSanitizer.ts";
import { useId } from "site/sdk/useId.ts";
import Spacer from "site/sections/Miscellaneous/Spacer.tsx";

/** @title {{title}} */
export interface Question {
  title: string;
  description: RichText;
}

export interface Props {
  title: string;
  description: RichText;
  questions: Question[];
  enableJSONLD: boolean;
  addSpaceBefore?: boolean;
  addSpaceAfter?: boolean;
}

function loadToogler(id: string) {
  const element = document.getElementById(id);
  if (!element) return;
  const li = element.querySelectorAll("li");
  li.forEach((item) => {
    const button = item.querySelector("button");
    const div = item.querySelector("div");
    const icon = button?.querySelector("use");
    const changeIcon = (iconName: string) => {
      icon?.setAttribute(
        "href",
        icon.getAttribute("href")?.replace(/#.*$/, `#${iconName}`) ?? "",
      );
    };
    button?.addEventListener("click", () => {
      if (div?.style.height === "0px") {
        div.style.height = div.scrollHeight + "px";
        button.classList.remove("text-[#676767]");
        button.classList.add("text-primary");
        changeIcon("minus");
      } else {
        div?.style.setProperty("height", "0px");
        changeIcon("plus");
        button.classList.remove("text-primary");
        button.classList.add("text-[#676767]");
      }
    });
  });
}

export default function FAQ(props: Props) {
  const JSONLD = props.enableJSONLD
    ? generateJSONLDForFAQ(props.questions)
    : null;
  const id = useId();

  return (
    <>
      {props.addSpaceBefore && <Spacer />}
      <div class="container" id={id}>
        <h2 class="font-beccaPerry text-[28px] leading-8 desk:text-[40px] desk:leading-[48px] text-[#676767] mb-2.5">
          {props.title}
        </h2>
        <p
          class="text-xs pb-5 mobile:leading-5 desk:text-sm text-[#7e7f88] [&>a]:text-primary [&>a]:font-bold [&>a]:underline"
          dangerouslySetInnerHTML={{
            __html: sanitizeHTMLCode(props.description, {
              removeEmptyTags: true,
              allowedTags: COMMON_HTML_TAGS_TO_ALLOW,
              removeWrapperTag: true,
            }),
          }}
        />
        <ul>
          {props.questions.map((question) => (
            <li class="py-5 border-b border-dashed border-secondary overflow-hidden">
              <button class="flex justify-between w-full text-xs mobile:leading-[18px] desk:text-sm text-[#676767] font-bold">
                <h3>{question.title}</h3>
                <Icon id="plus" size={22} />
              </button>
              <div style={{ height: "0px" }} class="transition-all">
                <p
                  class="pt-5 desk:pl-5 text-xs leading-5 text-[#7e7f88] [&>a]:text-primary [&>a]:font-bold [&>a]:underline"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHTMLCode(question.description, {
                      removeEmptyTags: true,
                      allowedTags: COMMON_HTML_TAGS_TO_ALLOW,
                      removeWrapperTag: true,
                    }),
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
        <script type="module" src={useScriptAsDataURI(loadToogler, id)} />
        {JSONLD && (
          <script
            type="module"
            src={useScriptAsDataURI(appendJSONLDToHead, JSONLD)}
          />
        )}
      </div>
      {props.addSpaceAfter && <Spacer />}
    </>
  );
}
