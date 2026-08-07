import { Image } from "expo-image";

const MODULE_ICONS_BASE_URL =
  "https://pueoumkuxzosxrzqoefw.supabase.co/storage/v1/object/public/module-icons";

export function getModulePosterImageUrl(poster: string | null | undefined) {
  if (!poster) return null;
  return `${MODULE_ICONS_BASE_URL}/${poster}.png`;
}

export function getModulePosterVideoUrl(poster: string | null | undefined) {
  if (!poster) return null;
  return `${MODULE_ICONS_BASE_URL}/${poster}.mp4`;
}

export function getModulePosterAssets(poster: string | null | undefined) {
  const image = getModulePosterImageUrl(poster);
  const video = getModulePosterVideoUrl(poster);
  if (!image && !video) return null;
  return { image, video };
}

export async function prefetchModulePosterImage(
  poster: string | null | undefined,
) {
  const url = getModulePosterImageUrl(poster);
  if (!url) return false;
  return Image.prefetch(url, "memory-disk");
}

export function prefetchModulePosterImages(modules: { poster: string | null }[]) {
  modules.forEach((module) => {
    void prefetchModulePosterImage(module.poster);
  });
}
