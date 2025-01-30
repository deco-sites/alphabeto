import type { JSX } from "preact";
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
          class="lozad"
          src={undefined}
          data-src={props.src}
        />
      </>
    );
  }

  return <video {...props} />;
}
