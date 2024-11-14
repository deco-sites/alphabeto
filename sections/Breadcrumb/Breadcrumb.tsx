import Icon from "site/components/ui/Icon.tsx";

/**@title Breadcrumb */
interface BreadcrumbProps {
    /**@title Raiz*/
    root: string;
    /**@title Rota */
    route: string;
}

export default function Breadcrumb({ root, route }: BreadcrumbProps) {
    return(
        <div class="flex justify-between w-[20%] mt-[20px] ml-[40px] mb-[40px]">
            <span class="flex items-center">
                <Icon id="home_icon" width="14px" height="14px"/>
                <p><b class="text-[#FF8300] font-medium ml-[4px]">{root}</b> | {route}</p>
            </span>
        </div>
    )
}