import { LinksProps } from "../../sections/Header/Header.tsx";

export interface Props {
  links?: LinksProps[];
}

function Links({ links }: Props) {
  return (
    <section class="bg-secondary">
      <div class="container flex justify-end items-center h-full">
        {links &&
          links.map((item) => (
            <a
              class="h-[30px] flex items-center text-xs px-2.5 hover:bg-base-200 hover:text-neutral transition duration-150 ease-in-out"
              key={item.title}
              href={item.href}
            >
              {item.title}
            </a>
          ))}
      </div>
    </section>
  );
}

export default Links;
