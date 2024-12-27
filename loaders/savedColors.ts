import { Color } from "apps/admin/widgets.ts";
/** @title {{name}} */
export interface ColorItemProps {
  name: string;
  hexadecimals: Color[];
}

export interface LoaderFilterSettings {
  colors: ColorItemProps[];
}

export interface ExportedColorItem {
  name: string;
  hexadecimals: Color[];
}

/**@title Saved Colors Loader */
export default function Loader(
  props: LoaderFilterSettings,
): ExportedColorItem[] {
  return props.colors;
}
