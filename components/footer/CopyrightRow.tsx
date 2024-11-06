import Image from "apps/website/components/Image.tsx";
import { CardFlag, TecnologiesLogo } from "site/components/footer/types.ts";

interface Props {
    copyright: string;
    cardFlags: CardFlag[];
    tecnologiesLogo: TecnologiesLogo;
}
export default function CopyrightRow(props: Props) {
    const copyText = props.copyright.replace(
        "{{year}}",
        new Date().getFullYear().toString(),
    );
    return (
        <div class="bg-[#F6F6F6] desk:bg-[#F5F4F1] ">
            <div class="container flex justify-between desktop:gap-7 items-center mobile:flex-col-reverse py-[14px] desk:py-4">
                <p class="text-[#676767] text-[12px] leading-[18px] mobile:text-center">
                    {copyText}
                </p>
                <div class="flex gap-3 desk:hidden pt-[46px] pb-4">
                    <a
                        href={props.tecnologiesLogo.econverse.url}
                        target="_blank"
                    >
                        <Image
                            src={props.tecnologiesLogo.econverse.image}
                            width={46.86}
                            height={14.01}
                            alt="Logo da Econverse"
                        />
                    </a>
                    <a href={props.tecnologiesLogo.vtex.url} target="_blank">
                        <Image
                            src={props.tecnologiesLogo.vtex.image}
                            width={34.73}
                            height={12.46}
                            alt="Logo da VTEX"
                        />
                    </a>
                </div>
                <ul class="flex gap-1">
                    {props.cardFlags.map((flag) => (
                        <li key={flag.title}>
                            <Image
                                src={flag.image}
                                width={34}
                                height={29}
                                alt={`Logo da bandeira ou meio de pagamento: ${flag.title}`}
                            />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
