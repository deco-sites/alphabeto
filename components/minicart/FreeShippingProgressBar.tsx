import { formatPrice } from "../../sdk/format.ts";
import { useId } from "../../sdk/useId.ts";
import Icon from "../ui/Icon.tsx";

export interface FreeShippingSettings {
  target?: number;
  messageRemain?: string;
  messageTotal?: string;
}

interface Props extends FreeShippingSettings {
  total: number;
  locale: string;
  currency: string;
  settings?: FreeShippingSettings;
}

const defaultMessageRemain = "Fala {{price}} e ganhe frete grátis!";
const defaultMessageTotal = "Você ganhou frete grátis!";

function FreeShippingProgressBar({ total, currency, locale, settings }: Props) {
  const id = useId();
  if (!settings) return null;
  const {
    messageRemain = defaultMessageRemain,
    messageTotal = defaultMessageTotal,
    target = 0,
  } = settings;

  const remaining = target - total;
  const percent = Math.floor((total / target) * 100);

  const formatMessage = (message: string, price: string) => {
    return message.replace("{{price}}", price);
  };
  const formatedMessageRemain = formatMessage(
    messageRemain,
    formatPrice(remaining, currency, locale) ?? "",
  );
  const formatedMessageTotal = formatMessage(
    messageTotal,
    formatPrice(total, currency, locale) ?? "",
  );
  if (target === 0) return null;
  return (
    <div class="flex flex-col w-full gap-2">
      <div class="flex justify-center items-center gap-2 text-primary">
        <Icon id="local_shipping" size={24} />
        {remaining > 0
          ? <label for={id}>{formatedMessageRemain}</label>
          : <label for={id}>{formatedMessageTotal}</label>}
      </div>
      <progress
        id={id}
        class="progress progress-primary w-full"
        value={percent}
        max={100}
      />
    </div>
  );
}

export default FreeShippingProgressBar;
