import * as yt from "npm:youtube-search-without-api-key";
import ytdl from "npm:ytdl-core";
interface Props {
  term?: string;
}
interface LoaderResponse {
  value: string;
  label: string;
}

export default async function loader(props: Props): Promise<LoaderResponse[]> {
  console.log("Olha O loader");
  const { term } = props;
  if (!term) return [];
  const isUrl = ytdl.validateURL(term);
  if (isUrl) {
    const id = ytdl.getVideoID(term);
    const data = await ytdl.getBasicInfo(id);
    if (data) {
      return [{
        label: `Id: ${id}, Title: ${data.videoDetails.title}`,
        value: id,
      }];
    }
  }
  const videos = await yt.search(term);

  return videos.map((video) => ({
    label: `Id: ${video.id.videoId}, Title: ${video.title}`,
    value: video.id.videoId,
  }));
}
