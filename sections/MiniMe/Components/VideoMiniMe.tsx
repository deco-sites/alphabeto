import { ImageWidget, RichText } from "apps/admin/widgets.ts";
import Icon from "site/components/ui/Icon.tsx";

interface Props {
  backgroundImage?: ImageWidget;

  title: string;
  description: RichText;

  label: string;

  /**
   * @title Id do Video do Youtube
   * @description Id do video do youtube, pode colocar o link que ele pega o id automaticamente
   * @format icon-select
   * @options site/loaders/youtubeVideo.ts
   */
  videoId: string;
}

export default function VideoMiniMe(
  { backgroundImage, title, description, label, videoId }: Props,
) {
  return (
    <>
      <section
        style={{ backgroundImage: `url(${backgroundImage})` }}
        class="bg-center h-[800px] mobile:h-[850px] w-full flex items-center justify-center relative"
      >
      <Icon
        id="white-star"
        width="90"
        height="165"
        class="absolute top-[35px] right-[0] z-10"
      />
      <Icon
        id="white-star"
        width="90"
        height="165"
        class="absolute bottom-[35px] left-[0] z-10 mobile:hidden"
      />
      <Icon
        id="curved-lines"
        width="245"
        height="238"
        class="absolute top-[120px] right-[45%] mobile:top-[550px] mobile:right-0 mobile:left-[-80px]"
      />
        <div class="flex mobile:flex-col items-center justify-center my-[40px] mobile:my-[85px] container mobile:p-0 relative">
          <div class="bg-[#fff] rounded-[20px] max-w-[731px] mobile:max-w-[335px] w-[100%] mr-[50%] mobile:mr-[0%] mobile:mt-[64px] px-[60px] py-[30px] mobile:p-[20px]">
            <div>
              <h2 class="font-beccaPerry text-[40px] mobile:text-[28px] mobile:text-center font-medium text-[#676767]">
                {title}
              </h2>
            </div>
            <div>
              <p
                class="font-Quicksand mt-[20px] "
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
            <button class="w-[100%] max-w-[197px] mobile:max-w-[286px] h-[44px] bg-[#F98300] mt-[30px] font-Quicksand text-[#FFF] text-[14px] font-bold rounded-[8px]">
            <a href="/almofada-boneca-mini-me-55724/p">{label}</a>
            </button>
          </div>
          <iframe
          class="absolute top-[60px] left-[48%] mobile:relative mobile:left-[0] w-[626px] mobile:w-[345px] h-[356px] mobile:h-[230px] rounded-lg"
          src={`https://www.youtube.com/embed/${videoId}`}
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        >
        </iframe>
        </div>
      </section>
    </>
  );
}
