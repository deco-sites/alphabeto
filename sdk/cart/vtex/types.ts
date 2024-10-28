import { OrderForm } from "apps/vtex/utils/types.ts";
export interface Cart extends Omit<OrderForm, "openTextField"> {
  openTextField?: {
    value: string;
  };
}
