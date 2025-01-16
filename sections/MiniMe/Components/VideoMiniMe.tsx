import { ImageWidget } from "apps/admin/widgets.ts";

interface Props {
  backgroundImage?: ImageWidget;
}

export default function VideoMiniMe({ backgroundImage }: Props) {
  return (
    <>
      <section
        style={{ backgroundImage: `url(${backgroundImage})` }}
        class="bg-center h-[800px] w-full"
      >
      </section>
    </>
  );
}
