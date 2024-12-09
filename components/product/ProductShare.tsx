import { Product } from "apps/commerce/types.ts";
import Icon, { AvailableIcons } from "site/components/ui/Icon.tsx";

interface Props {
  product: Product;
}
interface SocialNewtork {
  name: string;
  icon: AvailableIcons;
  color: string;
  getUrl: (productUrl: string) => string;
}
const socialNetworks: SocialNewtork[] = [
  {
    name: "Facebook",
    icon: "share_facebook",
    color: "#7561F0",
    getUrl: (productUrl: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        productUrl
      )}`,
  },
  {
    name: "Email",
    icon: "share_email",
    color: "#FD0303",
    getUrl: (productUrl: string) =>
      `mailto:?body=${encodeURIComponent(productUrl)}`,
  },
  {
    name: "WhatsApp",
    icon: "share_whatsapp",
    color: "#00D964",
    getUrl: (productUrl: string) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(productUrl)}`,
  },
];

export default function ProductShare(props: Props) {
  const productUrl = props.product.url;
  if (!productUrl) return null;

  return (
    <div class="flex gap-4 items-center mt-[30px]">
      <span class="text-sm text-[#676767] font-bold">Compartilhe:</span>
      <div class="flex gap-4">
        {socialNetworks.map((network) => (
          <a
            key={network.name}
            href={network.getUrl(productUrl)}
            target="_blank"
            rel="noreferrer"
          >
            <Icon
              id={network.icon}
              size={25}
              style={{ color: network.color }}
            />
          </a>
        ))}
      </div>
    </div>
  );
}
