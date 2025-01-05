import { Section } from "@deco/deco/blocks";

interface Props {
  left: Section;
  right?: Section;
}
export default function Policy(
  {
    left: { Component: LeftComponent, props: leftProps },
    right,
  }: Props,
) {
  return (
    <div class="container flex gap-[83px] mobile:flex-col mobile:gap-10">
      <LeftComponent {...leftProps} />
      {right?.Component ? <right.Component {...right.props} /> : null}
    </div>
  );
}
