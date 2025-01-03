import { clx } from "site/sdk/clx.ts";
const colors: Record<string, string | string[] | undefined> = {
  "AMARELO": "#f8ce49",
  "ANIS": "#484848",
  "AZUL": "#38BBD2",
  "AZUL CEU": "#87ceeb",
  "AZUL E BEGE": ["#38bbd2", "#F2DCBD"],
  "AZUL E PINK": ["#38bbd2", "#E56688"],
  "AZUL E VERDE": ["#38bbd2", "#CDE539"],
  "AMARELO E ROSA CLARO": ["#38bbd2", "#e97796"],
  "AZUL E LARANJA": ["#38bbd2", "#ff8300"],
  "AZUL E ROXO": ["#38bbd2", "#C5A6CD"],
  "BCO E AZUL": ["#F6F6F6", "#38bbd2"],
  "BCO E LILAS": ["#F6F6F6", "#DF8BF1"],
  "BCO E PRETO E ROSA": ["#F6F6F6", "#000", "#E56688"],
  "BRANCO E AZUL": ["#F6F6F6", "#38bbd2"],
  "BRANCO E ESMERALDA": ["#F6F6F6", "#007e61"],
  "BRANCO E JEANS": ["#F6F6F6", "#244f9c"],
  "BRANCO E MARINHO": ["#F6F6F6", "#003366"],
  "BRANCO E PRETO": ["#F6F6F6", "#000"],
  "BRANCO E ROSA": ["#F6F6F6", "#E56688"],
  "BRANCO E VERDE": ["#F6F6F6", "#CDE539"],
  "CHUMBO": "#5b5b58",
  "CINZA": "#7E7F88",
  "CORAL": "#FF8300",
  "ESMERALDA E OFF WHITE": ["#007e61", "#FAF9F6"],
  "ESMERALDA E SALMON": ["#007e61", "#FF859A"],
  "JADE": "#00a86b",
  "JEANS": "#244f9c",
  "LARANJA BB": "#FF8300",
  "LARANJA": "#FF8300",
  "MOSTARDA": "#f8ce49",
  "LILAS": "#DF8BF1",
  "LILAS E ESMERALDA": ["#DF8BF1", "#007e61"],
  "MARROM": "#A88A69",
  "OFF WHITE": "#FAF9F6",
  "OFF WHITE E LILAS": ["#FAF9F6", "#DF8BF1"],
  "OFF WHITE E VERDE": ["#FAF9F6", "#DF8BF1"],
  "OLIVA": "#808000",
  "NOZ MOSCADA": "#dbb695",
  "PESSEGO": "#ffdab9",
  "PINK": "#E56688",
  "PRETO E AZUL": ["#000", "#38BBD2"],
  "PRETO E BCO": ["#000", "#F6F6F6"],
  "PRETO E CEREJA": ["#000", "#8d1c38"],
  "PRETO E ESMERALDA": ["#000", "#007e61"],
  "PRETO E OFF WHITE": ["#000", "#FAF9F6"],
  "PRETO E ROSA": ["#000", "#E56688"],
  "PRETO E ROSA FORTE": ["#000", "#e45078"],
  "PRETO E ROXO": ["#000", "#C5A6CD"],
  "ROSA": "#E56688",
  "ROSA CLARO": "#e27894",
  "ROSA E VERDE": ["#E56688", "#CDE539"],
  "ROSA E OFF WHITE": ["#E56688", "#FAF9F6"],
  "ROSA FORTE": "#e45078",
  "ROXO": "#C5A6CD",
  "ROYAL": "#6b3fa0",
  "SALMON": "#FF859A",
  "VERDE": "#CDE539",
  "VERDE E AZUL": ["#CDE539", "#38BBD2"],
  "VERDE E ROXO": ["#CDE539", "#C5A6CD"],
  "VERMELHO": "#E35027",
  "AZUL BB": "#38BBD2",
  "ESMERALDA BB": "#007e61",
  "CRISTAL": "#d5d5d5",
  "AMARELO E PINK": ["#f8ce49", "#E56688"],
  "CEREJA E AMARELO": ["#8d1c38", "#f8ce49"],
  "ROXO CLARO": "#6b3fa0",
  "ROXO E AMARELO": ["#C5A6CD", "#f8ce49"],
  "CORAL E VERDE": ["#FF8300", "#CDE539"],
  "KIWI E JEANS": ["#a7ab9a", "#244f9c"],
  "BRANCO E SALMON": ["#F6F6F6", "#FF859A"],
  "GRAFITE": "#2e2e2e",
  "BRANCO E ROXO BB": ["#F6F6F6", "#6b3fa0"],
  "VIOLACIO E AMARELO": ["#ee82ee", "#f8ce49"],
  "ROSA E MARROM": ["#E56688", "#A07244"],
  "BCO AZUL E ROXO": ["#F6F6F6", "#38BBD2", "#C5A6CD"],
  "TANGERINA": "#f0974c",
  "PRETO E VERDE": ["#000", "#CDE539"],
  "MESCLA E ROSA": ["#d3d3d3", "#E56688"],
  "CHICLETE": "#ff007f",
};
const useStyles = (value: string, checked: boolean) => {
  if (colors[value]) {
    return clx(
      "border border-base-300 rounded-full",
      "w-5 h-5 block",
      "border border-[#C9CFCF] rounded-full",
      "ring-2 ring-offset-2",
      checked ? "ring-primary" : "ring-transparent",
    );
  }
  return clx(
    "btn btn-ghost border-[#C9CFCF] hover:bg-base-200 hover:border-[#C9CFCF] w-12 h-12",
    "ring-2 ring-offset-2",
    checked ? "ring-primary" : "ring-transparent border-[#C9CFCF]",
  );
};
const ProductCardRing = ({ value, checked = false, class: _class }: {
  value: string;
  checked?: boolean;
  class?: string;
}) => {
  const color = Array.isArray(colors[value])
    ? colors[value]?.join(", ") // Ou escolha apenas a primeira cor: colors[value][0]
    : colors[value];
  const styles = clx(useStyles(value, checked), _class);

  return (
    <span
      style={{ backgroundColor: color }}
      class={styles}
    >
      {color ? null : value}
    </span>
  );
};

export default ProductCardRing;
