import type { JSX } from "preact";
import { clx } from "site/sdk/clx.ts";
type Props =
  & JSX.IntrinsicElements["video"]
  & {
    lozad?: boolean;
  };

export default function Video({ lozad, ...props }: Props) {
  if (lozad) {
    return (
      <>
        <video
          {...props}
          class={clx(
            "lozad",
            props.class?.toString(),
            props.className?.toString(),
          )}
          src={undefined}
          data-src={props.src}
        />
      </>
    );
  }

  return <video {...props} />;
}
