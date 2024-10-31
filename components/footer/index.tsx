import { useDevice } from "@deco/deco/hooks";
import MenusAndCardDesktop from "site/components/footer/MenusAndCardDesktop.tsx";
import MenusAndCardMobile from "site/components/footer/MenusAndCardMobile.tsx";
import Newsletter from "site/components/footer/Newsletter.tsx";
import { Props } from "site/components/footer/types.ts";
import Section from "site/components/ui/Section.tsx";

export default function Footer(props: Props) {
  const device = useDevice();
  return (
    <div>
      <Newsletter {...props.newsletter} />
      {device === "desktop"
        ? (
          <MenusAndCardDesktop
            card={props.card}
            columns={props.columns}
            tecnologiesLogo={props.tecnologiesLogo}
          />
        )
        : (
          <MenusAndCardMobile
            card={props.card}
            columns={props.columns}
          />
        )}
    </div>
  );
}

export const LoadingFallback = () => <Section.Placeholder height="1145px" />;
