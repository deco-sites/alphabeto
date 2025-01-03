import { useSignal } from "@preact/signals";

function Notify() {
  const isMobile = useSignal<boolean>(false);

  const innerWidth = window.innerWidth;

  if (innerWidth < 1024) {
    isMobile.value = true;
  }

  return { isMobile: isMobile.value };
}

export default Notify;
