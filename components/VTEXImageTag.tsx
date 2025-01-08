/*
 * This is a custom component used to load the product image in VTEX adequate the format and size.
 */
import { Head } from "$fresh/runtime.ts";
import type { JSX } from "preact";
import { forwardRef } from "preact/compat";

type Props =
  & Omit<
    JSX.IntrinsicElements["img"],
    "width" | "preload" | "fetchPriority" | "height"
  >
  & {
    src: string;
    /** @description Improves Web Vitals (CLS|LCP) */
    width: number;
    /** @description Improves Web Vitals (CLS|LCP) */
    height?: number;
    /** @description Web Vitals (LCP). Adds a link[rel="preload"] tag in head. Use one preload per page for better performance */
    preload?: boolean;
    /** @description Improves Web Vitals (LCP). Use high for LCP image. Auto for other images */
    fetchPriority?: "high" | "low" | "auto";
    /** @description Object-fit */
    fit?: "contain" | "cover";
  };

interface VtexImg {
  account: string;
  cdnDomain: string;
  id: string;
  fileName: string;
}

const readVtexImg = (url: string) => {
  const urlObjc = new URL(url);
  const account = urlObjc.host.split(".")[0];
  const cdnDomain = urlObjc.host.split(".").slice(1).join(".");
  const id = urlObjc.pathname.split("/")[3].split("-")[0];
  const fileName = urlObjc.pathname.split("/")[4];
  return {
    account,
    cdnDomain,
    id,
    fileName,
  };
};

const changeExtension = (fileName: string, extension: string) => {
  const parts = fileName.split(".");
  parts.pop();
  return `${parts.join(".")}.${extension}`;
};

const makeUrlSize = (vtexImg: VtexImg, width: number) => {
  const {
    account,
    cdnDomain,
    id,
    fileName,
  } = vtexImg;
  return `https://${account}.${cdnDomain}/arquivos/ids/${id}-${width}-auto/${
    changeExtension(fileName, "webp")
  }`;
};

const VTEXImageTag = forwardRef<HTMLImageElement, Props>((props, ref) => {
  const { width, src, loading = "lazy", preload } = props;
  const vtexImg = readVtexImg(src);
  const srcSetOne = makeUrlSize(vtexImg, width);
  const srcSetOneW = `${width}w`;
  const srcSetTwo = makeUrlSize(vtexImg, width * 2);
  const srcSetTwoW = `${width * 2}w`;
  const finalSrcSet = `${srcSetOne} ${srcSetOneW}, ${srcSetTwo} ${srcSetTwoW}`;
  const linkProps = {
    imagesrcset: finalSrcSet,
    imagesizes: props.sizes,
    fetchpriority: props.fetchPriority,
    media: props.media,
  };
  return (
    <>
      {preload && (
        <Head>
          <link as="image" rel="preload" href={props.src} {...linkProps} />
        </Head>
      )}
      <img
        {...props}
        data-fresh-disable-lock={true}
        preload={undefined}
        src={src}
        srcSet={finalSrcSet}
        loading={loading}
        ref={ref}
      />
    </>
  );
});

export default VTEXImageTag;