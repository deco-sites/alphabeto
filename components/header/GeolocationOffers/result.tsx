import { ComponentProps } from "../../../sections/Component.tsx";
import { ButtonLabel, ButtonType } from "../../ui/Button.tsx";

export interface ResultProps {
  result: "Success" | "Failure";
}

export const action = async (props: ResultProps) => {
  console.log("Resultado da Federal: ", props.result);
  return { ...props };
};

type Props = ComponentProps<typeof action>;

export default function GeolocationOffersResult(props: Props) {
  return (
    <div>
      <h2>Bem vindo a VTEX</h2>
      <p>Resultado: {props.result}</p>
      <ButtonLabel styleType={ButtonType.Tertiary} type="button" for={ids.GEOLOCATION_OFFERS_MODAL_ID} className="h-11" aria-label="Close Geolocation Offer Modal">
        Fechar Modal
      </ButtonLabel>
    </div>
  );
}
