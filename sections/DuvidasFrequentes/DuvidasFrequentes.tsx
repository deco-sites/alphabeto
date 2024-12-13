import { Section } from "@deco/deco/blocks";

interface Questions {
    Question: Section;
    Menu: Section;
} 

export default function DuvidasFrequentes({ Menu: { Component: MenuInstitucional, props }, Question: { Component: FAQ, props:faqProps }}: Questions){
    return(
        <div class="container flex mobile:flex-col">
            <MenuInstitucional {...props}/>
            <div class="mobile:mt-[24px] mobile:mb-[48px]">
            <FAQ {...faqProps} />
            </div>
        </div>
    )
}