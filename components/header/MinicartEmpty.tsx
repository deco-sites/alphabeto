import { MinicartEmptyProps } from "../Session.tsx";

interface Props {
  content: MinicartEmptyProps | null;
}

export function MinicartEmpty({ content }: Props) {
  console.log({ content });
  return (
    <div>
      <div>
        {content?.icon && <img src={content.icon} alt="Sacola" />}
        <h4>{content?.title}</h4>    
      </div>

      <div>
        <h4>{content?.itemsTitle}</h4>

        {
          content?.items.map(item => (
            <a href={item.href}>
              <img src={item.image} alt={item.label} />
              <label>{item.label}</label>
            </a>
          ))
        }
      </div>
    </div>
  )
}
