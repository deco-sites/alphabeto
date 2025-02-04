interface Props {
    title: string;
    subtitle: string;

    label: string;
}

export default function LetsBuild({ title, subtitle, label }: Props) {
    return (
        <>
        <div class="container flex flex-col items-center mobile:text-center justify-center mb-[100px]">
            <h2 class="font-beccaPerry text-[44px] mobile:text-[28px] font-medium text-[#676767]">{title}</h2>
            <p class="font-Quicksand text-[16px] mobile:text-[12px] text-[#7E7F88] font-bold">{subtitle}</p>
            <button class="w-[100%] max-w-[197px] h-[44px] bg-[#F98300] mt-[30px] font-Quicksand text-[#FFF] text-[14px] font-bold rounded-[8px]"><a href="/almofada-boneca-mini-me-55724/p">{label}</a></button>
        </div>
        </>
    )
}