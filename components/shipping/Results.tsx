/**
 * TODO: support other platforms. Currently only for VTEX
 */
import { AppContext } from "apps/vtex/mod.ts";
import type { SimulationOrderForm, SKU, Sla } from "apps/vtex/utils/types.ts";
import { formatPrice } from "../../sdk/format.ts";

export interface Props {
  items: SKU[];
}

const formatShippingEstimate = (estimate: string) => {
  const [, time, type] = estimate.split(/(\d+)/);

  if (type === "bd") return `${time} dias úteis`;
  if (type === "d") return `${time} dias`;
  if (type === "h") return `${time} horas`;
};

export async function action(props: Props, req: Request, ctx: AppContext) {
  const form = await req.formData();

  try {
    const result = await ctx.invoke("vtex/actions/cart/simulation.ts", {
      items: props.items,
      postalCode: `${form.get("postalCode") ?? ""}`,
      country: "BRA",
    }) as SimulationOrderForm | null;

    return { result };
  } catch {
    return { result: null };
  }
}

const formatShippingName = (method: Sla) => {
  if (method.deliveryChannel === "pickup-in-point") {
    return `Retirada em ${method.pickupStoreInfo?.friendlyName}`;
  } else {
    return method.name;
  }
};

interface ResultsProps {
  result: SimulationOrderForm | null;
}

export default function Results({ result }: ResultsProps) {
  const methods = result?.logisticsInfo?.reduce(
    (initial, { slas }) => [...initial, ...slas],
    [] as Sla[],
  ) ?? [];

  if (!methods.length) {
    return (
      <div class="mt-2.5 text-red-500 text-sm">
        <span>CEP inválido</span>
      </div>
    );
  }

  return (
    <ul class="flex flex-col gap-4 p-4 border border-[#353535] rounded mt-2.5">
      {methods.map((method) => (
        <li class="text-sm grid grid-cols-[200px_1fr_100px] items-center">
          <span class="">
            {formatShippingName(method)}
          </span>
          <span class="">
            Em até {formatShippingEstimate(method.shippingEstimate)}
          </span>
          <span class="text-right font-semibold">
            {method.price === 0 ? "Grátis" : (
              formatPrice(method.price / 100, "BRL", "pt-BR")
            )}
          </span>
        </li>
      ))}
      <span class="text-xs font-thin">
        Os prazos de entrega começam a contar a partir da confirmação do
        pagamento e podem variar de acordo com a quantidade de produtos na
        sacola.
      </span>
    </ul>
  );
}
