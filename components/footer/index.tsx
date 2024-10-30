import Newsletter from "site/components/footer/Newsletter.tsx";
import { Props } from "site/components/footer/types.ts";
import Section from "site/components/ui/Section.tsx";
export default function Footer(props: Props) {
  return (
    <div>
      <Newsletter {...props.newsletter} />
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="1145px" />;
