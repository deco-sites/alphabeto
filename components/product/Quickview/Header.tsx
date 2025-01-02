interface Props {
  modalId: string;
}

export default function QuikviewHeader({ modalId }: Props) {
  return (
    <div class="w-full flex items-center justify-between px-6 py-4 bg-[#FDF6ED] border-b border-primary border-dashed">
      <p class="text-primary font-bold leading-6">
        Selecione as opções
      </p>
      <label
        id={"closeModalId"}
        class="text-primary font-bold leading-6"
        htmlFor={modalId}
      >
        X
      </label>
    </div>
  );
}
