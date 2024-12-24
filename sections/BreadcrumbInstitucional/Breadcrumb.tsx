import Icon from "site/components/ui/Icon.tsx";

interface BreadcrumbProps {
  /**@title Raiz*/
  root: string;
  /**@title Habilitar Caminho */
  showText: boolean;
  /**@title Caminho */
  path: string;
  /**@title Rota Final */
  route: string;
}

export default function Breadcrumb(
  { root, showText, path, route }: BreadcrumbProps,
) {
  return (
    <div class="flex justify-between container mt-[20px] mb-[20px]">
      <span class="flex items-center">
        <Icon id="home_icon" width="14px" height="14px" class="text-primary" />
        <div class="flex text-[#353535] text-[12px] font-medium">
          <b class="text-[12px] text-[#FF8300] font-medium ml-[4px] mr-[8px]">
            {root}
          </b>
          {showText &&
            (
              <>
                <p class="text-[#353535] text-[12px]">|</p>
                <p class="text-[#353535] text-[12px] ml-[8px] mr-[8px]">
                  {path}
                </p>
              </>
            )}
          <p class="text-[#353535] text-[12px]">|</p>
          <p class="text-[#353535] text-[12px] ml-[8px]">{route}</p>
        </div>
      </span>
    </div>
  );
}
