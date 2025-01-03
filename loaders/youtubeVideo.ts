import { allowCorsFor } from "@deco/deco";
import * as yt from "npm:youtube-search-without-api-key";
import ytdl from "npm:ytdl-core";
import { AppContext } from "site/apps/site.ts";
interface Props {
  term?: string;
}
interface LoaderResponse {
  image?: string;
  value: string;
  label: string;
}

export default async function loader(
  props: Props,
  req: Request,
  ctx: AppContext,
): Promise<LoaderResponse[]> {
  Object.entries(allowCorsFor(req)).map(([name, value]) => {
    ctx.response.headers.set(name, value);
  });
  const { term } = props;
  if (!term) {
    return [{
      label: "Digite algo para pesquisar",
      value: "no-results",
    }];
  }
  const isUrl = ytdl.validateURL(term);
  const findTerm = isUrl ? ytdl.getVideoID(term) : term;
  const videos = await yt.search(findTerm);
  if (videos.length === 0) {
    return [{
      label: "Sem resultados",
      value: "no-results",
    }];
  }

  const results = videos.map((video) => ({
    image: video.snippet.thumbnails.url,
    label: `Id: ${video.id.videoId}, Title: ${video.title}`,
    value: video.id.videoId,
  }));
  results.push({
    image:
      "https://i.ytimg.com/vi/4y2iszVANb4/hq720_2.jpg?sqp=-oaymwExCNAFEJQDSFryq4qpAyMIARUAAIhCGADwAQH4Ac4FgAKACooCDAgAEAEYfyBDKDEwDw==&rs=AOn4CLAi1Y9vvxd_9opDqxcQFCP3jFujkA",
    label: "Usar o termo digitado",
    value: term,
  });
  return results;
}
