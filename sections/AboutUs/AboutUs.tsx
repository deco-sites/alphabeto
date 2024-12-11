import type { ImageWidget, RichText } from "apps/admin/widgets.ts";

/**@title Parágrafos */
interface AboutUsProps {
  firstText?: RichText;
  secondText?: RichText;
  firstImage?: ImageWidget;
  secondImage?: ImageWidget;
}

/**@title Conteúdo */
interface ItemsAboutUs {
  banner?: ImageWidget;
  title?: string;
  logo?: ImageWidget; 
  items: AboutUsProps[];
}

export default function AboutUs({ items, title, logo, banner }: ItemsAboutUs) {
  return (
    <>
      <div>
        <img src={banner} alt="" />
      </div>
      <div class={`bg-[url('${logo}')] bg-cover bg-center h-64 w-full`}>
        <h2>{title}</h2>
      </div>
      {items.map((items, index) => (
        <div key={index}>
          <div>
            <p
              class="font-regular text-[12px] text-[#ffffff]"
              dangerouslySetInnerHTML={{
                __html: items.firstText ? items.firstText : "",
              }}
            />
            <img src={items.firstImage} />
          </div>
          <div>
            <p
              class="font-regular text-[12px] text-[#ffffff]"
              dangerouslySetInnerHTML={{
                __html: items.secondText ? items.secondText : "",
              }}
            />
            <img src={items.secondImage} />
          </div>
        </div>
      ))}
    </>
  );
}
