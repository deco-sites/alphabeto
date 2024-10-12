import { MinicartEmptyProps } from "../Session.tsx";
import { IconArrowMinicart } from "../Icons/IconArrowMinicart.tsx"; 

interface Props {
  content: MinicartEmptyProps | null;
}

export function MinicartEmpty({ content }: Props) {
  console.log({ content });
  return (
    <div class="relative h-full w-full flex justify-center">
      <div class="pt-[130px] flex items-center flex-col gap-5">
        {content?.icon && <img src={content.icon} alt="Sacola" />}
        <h4 class="font-['BeccaPerry'] text-[2rem] text-accent">{content?.title}</h4>    
      </div>

      <div class="absolute bottom-0 w-[calc(100%-48px)] bg-secondary-content">
        <h4>{content?.itemsTitle}</h4>

        {
          content?.items.map(item => (
            <a href={item.href} class="flex justify-between">
              <div>
                <img src={item.image} alt={item.label} />
                <label>{item.label}</label>
              </div>
              <IconArrowMinicart />
            </a>
          ))
        }
      </div>
    </div>
  )
}
