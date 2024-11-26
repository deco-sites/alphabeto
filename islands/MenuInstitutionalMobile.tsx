import { useState } from "preact/hooks";
import Icon from "site/components/ui/Icon.tsx";

interface MenuProps {
    links: LinkProps[];
    label: string;
}

interface LinkProps {
    /**@title Rota */
    route: string;
    /**@title Rota */
    label: string;
}

export default function MenuInstitutionalMobile({ links, label }: MenuProps) {
    const [navigation, setNavigation] = useState(false);

    return (
        <div class="hidden z-10 mobile:flex flex-col bg-[#FFFFFF] rounded-[5px]">
            <button
                class="hidden text-left mobile:flex container justify-between items-center h-[44px] py-[13px] font-bold text-[12px] leading-[18px] text-[#676767] rounded-[4px] border border-[#F7E0BF]"
                onClick={() => setNavigation(!navigation)}
            >
                {label}{" "}
                <Icon
                    id="chevron-right-institutional"
                    width="16"
                    height="16"
                    style={{
                        transform: navigation
                            ? "rotate(90deg)"
                            : "rotate(0deg)",
                        transition: "transform 0.3s",
                    }}
                    class="text-[#D6DE23]"
                />
            </button>
            {navigation && (
                <div className="flex flex-col absolute mt-[44px] items-center justify-start text-left w-[100%] bg-[#FFFFFF] py-0 px-[10px] rounded-b-[5px] border-b border-r border-l border-[#F7E0BF]">
                    {links &&
                        links.map((link, index) => (
                            <a
                                className={`text-left text-[12px] text-[#676767] font-medium w-full h-[44px] ${
                                    index === 0 ? "first:mt-[10px]" : ""
                                }`}
                                key={index}
                                href={link.route}
                            >
                                {link.label}
                            </a>
                        ))}
                </div>
            )}
        </div>
    );
}
