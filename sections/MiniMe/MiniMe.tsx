import { Section } from "@deco/deco/blocks";

interface MiniMeProps {
  components: Section[];
}

export default function MiniMe(
  { components }: MiniMeProps,
) {
  return (
    <>
      {components.map(({ Component, props }, index) => (
        <div key={index}>
          <Component {...props} />
        </div>
      ))}
    </>
  );
}
