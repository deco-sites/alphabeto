import { FilterSettings } from "site/components/search/Filters/index.tsx";

/** @title {{name}} */
export interface ColorItem {
    name: string;
    hexadecimals: string[];
}

export interface LoaderFilterSettings {
    colors: ColorItem[];
}

interface Props {
    settings: LoaderFilterSettings;
}
/**@title Saved Colors Loader */
export default function Loader(
    props: Props,
): FilterSettings {
    return props.settings;
}
