import Slider from "../ui/Slider.tsx";
import { useId } from "../../sdk/useId.ts";
import { LinksProps } from "../../sections/Header/Header.tsx";

export interface Props {
  links?: LinksProps[];
  /**
   * @title Autoplay interval
   * @description time (in seconds) to start the carousel autoplay
   */
  interval?: number;
}

function Links({ links = [], interval = 5 }: Props) {
  const id = useId();

  console.log({id, links})

  return (
    <div id={id}>
      <Slider class="carousel carousel-center w-screen gap-6 bg-secondary text-secondary-content text-sm/4">
        {links.map((alert, index) => (
          <Slider.Item index={index} class="carousel-item">
            <span
              class="px-5 py-4 w-screen text-center"
              dangerouslySetInnerHTML={{ __html: alert.title }}
            />
          </Slider.Item>
        ))}
      </Slider>

      <Slider.JS rootId={id} interval={interval && interval * 1e3} />
    </div>
  );
}

export default Links;
