import { MinicartEmptyProps } from "../Session.tsx";

interface Props {
  content: MinicartEmptyProps | null;
}

export function MinicartEmpty(props: Props) {
  console.log({ props });
  return <h1>Empty</h1>;
}
