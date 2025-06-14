// utils/youtubeUtils.ts

/**
 * Converts a YouTube watch URL to an embed URL
 * Supports various YouTube URL formats
 */
export const convertToEmbedUrl = (url: string): string => {
  // Handle different YouTube URL formats

  // Standard YouTube watch URL: https://www.youtube.com/watch?v=VIDEO_ID
  if (url.includes("youtube.com/watch?v=")) {
    const videoId = url.split("v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Short YouTube URL: https://youtu.be/VIDEO_ID
  if (url.includes("youtu.be/")) {
    const videoId = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // Mobile YouTube URL: https://m.youtube.com/watch?v=VIDEO_ID
  if (url.includes("m.youtube.com/watch?v=")) {
    const videoId = url.split("v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  // If already an embed URL, return as is
  if (url.includes("youtube.com/embed/")) {
    return url;
  }

  // If none of the above, return the original URL
  return url;
};

/**
 * Extracts video ID from any YouTube URL format
 */
export const extractVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
};
