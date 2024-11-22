import MenuInstitutionalMobile from "site/islands/MenuInstitutionalMobile.tsx";

interface Menu {
    links: Link[]
}

interface Link {
    /** @title Rota */
    route: string;
    /** @title Etiqueta */
    label: string;
}

export const loader = ({ links }: Menu, req: Request) => {
    const currentPath = new URL(req.url).pathname;
    const matchingLink = links?.find((link) => link.route === currentPath)
    return {
        label: matchingLink ? matchingLink.label : "Menu",
        links
    }
}

export default function MenuMobile({ links, label }: ReturnType<typeof loader>) {
    return <MenuInstitutionalMobile links={links} label={label}/>
}