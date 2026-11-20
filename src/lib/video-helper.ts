export function getVideoEmbedInfo(url?: string | null): {
  type: "youtube" | "vimeo" | "video" | "none";
  embedUrl?: string;
  originalUrl?: string;
} {
  if (!url || typeof url !== "string") {
    return { type: "none" };
  }

  const trimmed = url.trim();
  if (!trimmed) return { type: "none" };

  // 1. YouTube Matchers
  const ytMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`,
      originalUrl: trimmed,
    };
  }

  // 2. Vimeo Matchers
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      originalUrl: trimmed,
    };
  }

  // 3. Direct video formats or uploaded file URLs
  return {
    type: "video",
    embedUrl: trimmed,
    originalUrl: trimmed,
  };
}
