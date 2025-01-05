import { RichText } from "apps/admin/widgets.ts";
import Icon from "site/components/ui/Icon.tsx";
import { sanitizeHTMLCode } from "site/sdk/htmlSanitizer.ts";

interface Props {
  /**@title Titulo */
  title: string;
  /**@title Texto */
  text: RichText;
  /**
   * @title Id do Video do Youtube
   * @description Id do video do youtube, pode colocar o link que ele pega o id automaticamente
   * @format icon-select
   * @options site/loaders/youtubeVideo.ts
   */
  videoId: string;
}

export default function AboutUSVideo(props: Props) {
  const { title, text, videoId } = props;
  return (
    <article class="relative  bg-secondary mt-[144px] w-full">
      <Icon
        id="star"
        width="47"
        height="50"
        class="absolute top-[35px] left-[20px] z-10"
      />
      <Icon
        id="minor-star"
        width="28"
        height="30"
        class="absolute top-[20px] left-[55px] z-10"
      />
      <Icon
        id="star"
        width="47"
        height="50"
        class="absolute bottom-[35px] right-[20px] z-10"
      />
      <Icon
        id="minor-star"
        width="28"
        height="30"
        class="absolute bottom-[70px] right-[55px] z-10"
      />
      <div class="container py-[30px] desk:py-[42px] flex mobile:flex-col-reverse gap-[60px] desk:gap-11 justify-around items-center z-10 relative">
        <iframe
          class="w-[626px] mobile:w-[345px] h-[356px] mobile:h-[230px] rounded-lg"
          src={`https://www.youtube.com/embed/${videoId}`}
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        >
        </iframe>
        <div class="flex flex-col items-center">
          <Icon id="castle" />
          <h3 class="font-beccaPerry mb-[20px] text-[40px] mobile:text-[28px] text-accent text-center p-2.5">
            {title}
          </h3>
          <p
            class="font-regular text-xs mobile:leading-[18px] desk:text-sm text-[#7E7F88] max-w-[689px] text-center"
            dangerouslySetInnerHTML={{
              __html: sanitizeHTMLCode(text, {
                allowedTags: ["strong", "em", "a", "br"],
                removeWrapperTag: true,
              }),
            }}
          >
          </p>
        </div>
      </div>
    </article>
  );
}
