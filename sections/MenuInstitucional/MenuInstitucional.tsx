import Icon from "site/components/ui/Icon.tsx";

/**@title Menu */
interface MenuProps {
    /**@title Menu Institucional*/
    institutionalTitle: string;
    /**@title Menu Suporte*/
    supportTitle: string;
    /**@title Rotas institucionais*/
    institutionalLinks: LinkProps[];
    /**@title Rotas suporte*/
    supportLinks: LinkProps[];
}

/**@title Rota: {{ label }}*/
interface LinkProps {
    /**@title Rota*/
    route?: string;
    /**@title Etiqueta*/
    label?: string;
}

export const loader = (menu: MenuProps, req: Request) => {
    const currentPath = new URL(req.url).pathname;
    return {
        ...menu,
        currentPath,
    };
};

export default function MenuInstitucional(
    {
        institutionalTitle,
        supportTitle,
        institutionalLinks,
        supportLinks,
        currentPath,
    }: ReturnType<typeof loader>,
) {
    return (
        <div class="mobile:hidden block absolute top-[220px] left-[40px] mobile:left-[20px] list-none">
            <section>
                <div class="mb-[20px]">
                    <h3 class="font-bold text-[#FF8300] text-[14px]">{institutionalTitle}</h3>
                </div>
                <section>
                    {institutionalLinks &&
                        institutionalLinks.map(({ route, label }, index) => (
                            <li key={index} class={`flex items-center justify-between w-[197px] p-[10px] ${currentPath === route ? "bg-[#FDF6ED] text-[#FF8300] font-bold border-2 border-dashed border-[#FF8300]" : ""}`}>
                                <a 
                                href={route} 
                                class="text-[12px] font-regular">
                                    {label}
                                </a>
                                <Icon 
                                id="chevron-right-institutional" 
                                width="16" 
                                height="16"
                                class={`${currentPath === route ? "text-[#FF8300]" : "text-[#7E7F88]"}`}
                                />
                            </li>
                        ))}
                </section>
            </section>
            <hr class="bg-[#F7E0BF] w-[100%] h-[1px] my-[20px] border-0"/>
            <section>
                <div class="mb-[20px]">
                    <h3 class="font-bold text-[#FF8300] text-[14px]">{supportTitle}</h3>
                </div>
                <section>
                    {supportLinks &&
                        supportLinks.map(({ route, label }, index) => (
                            <li key={index} class={`flex items-center justify-between w-[197px] p-[10px] ${currentPath === route ? "bg-[#FDF6ED] text-[#FF8300] font-bold border-2 border-dashed border-[#FF8300]" : ""}`}>
                                <a href={route}
                                class="text-[12px] font-regular">
                                {label}</a>
                                <Icon 
                                id="chevron-right-institutional" 
                                width="16" 
                                height="16"
                                class={`${currentPath === route ? "text-[#FF8300]" : "text-[#7E7F88]"}`}
                                />
                            </li>
                        ))}
                </section>
            </section>
        </div>
    );
}
