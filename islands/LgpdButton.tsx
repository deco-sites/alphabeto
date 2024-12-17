import { useEffect, useState } from "preact/hooks";
import { RichText } from "apps/admin/widgets.ts";

interface Props {
    text: RichText;
    label: string;
}

export default function LgpdButton({ text, label }: Props) {
    const [isAccepted, setIsAccepted] = useState(true)

    const handleClick = () => {
        localStorage.setItem('aceito', JSON.stringify(isAccepted))
        setIsAccepted(false)
    }

    const verify = localStorage.getItem('aceito')

    useEffect(() => {
        setIsAccepted(false)
        verify === 'true' ? setIsAccepted(false) : setIsAccepted(true)
    }, [])

    if(isAccepted === false) return null

    return (
        <>
            {isAccepted && (
                <>
                    <div class="fixed bg-[#000] opacity-40 top-0 w-full mobile:w-[100%] h-[100vh] mobile:h-[100%]"></div>
                    <div
                        class="fixed bottom-5 mobile:bottom-10 left-[50%] -translate-x-1/2 mobile:flex-col flex items-center justify-between bg-[#F6F6F6] rounded-[8px] p-[20px] w-full max-w-[1117px] mobile:max-w-[335px] h-[74px] mobile:h-[153px]">
                        <p
                            class="text-[14px] mobile:text-center text-[#808080]"
                            dangerouslySetInnerHTML={{ __html: text ? text : '' }} />
                        <button
                            class="max-w-[220px] mobile:max-w-[295px] w-full h-[44px] bg-[#ff8300] pointer text-[#fff] rounded-[8px] font-bold hover:bg-[#F7E0BF] hover:text-[#FF8300] transition duration-200"
                            onClick={handleClick}>{label}</button>
                    </div>
                </>
            )}
        </>
    )
}