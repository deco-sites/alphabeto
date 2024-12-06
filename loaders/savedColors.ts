/** @title {{name}} */
export interface ColorItemProps {
  name: string;
  hexadecimals: string[];
}

export interface LoaderFilterSettings {
  colors: ColorItemProps[];
}

export interface ExportedColorItem {
  name: string;
  hexadecimals: string[];
}

/**@title Saved Colors Loader */
export default function Loader(
  props: LoaderFilterSettings,
): ExportedColorItem[] {
  return props.colors;
}
