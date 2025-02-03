import Icon from "site/components/ui/Icon.tsx";

interface Props {
  onClick: () => void;
}

export default function QuikviewHeader({ onClick }: Props) {
  return (
    <div class="w-full flex items-center justify-between px-6 py-4 bg-secondary-content border-b border-primary border-dashed">
      <p class="text-primary font-bold leading-6 text-[16px]">
        Selecione as opções
      </p>
      <button
        onClick={onClick}
        id="closeQuickview"
        class="text-primary font-bold leading-6"
      >
        <Icon id="close" size={20} />
      </button>
    </div>
  );
}
