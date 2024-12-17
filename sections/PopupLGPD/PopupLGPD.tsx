import { RichText } from "apps/admin/widgets.ts";
import LgpdButton from "site/islands/LgpdButton.tsx";

interface Props {
    text: RichText;
    label: string;
}

export default function PopupLGPD({ text, label }: Props) {

    return (
        <>
        <div class="fixed z-[9999] w-full">
            <LgpdButton text={text} label={label}/>
        </div>
        </>
    )
}