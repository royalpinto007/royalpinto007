export interface MediumPost {
  title: string;
  link: string;
  pubDate: string;
  excerpt: string;
  thumbnail: string | null;
  categories: string[];
  readingTime: number;
}

function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

function extractThumbnail(content: string): string | null {
  const match = content.match(/<img[^>]+src="([^"]+)"/);
  return match ? match[1] : null;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ").trim();
}

function extractExcerpt(content: string, maxLength = 160): string {
  const text = stripHtml(content);
  return text.length > maxLength ? text.slice(0, maxLength).trim() + "..." : text;
}

export async function fetchMediumPosts(feedUrl: string, limit = 6): Promise<MediumPost[]> {
  try {
    const res = await fetch(feedUrl, {
      cache: "force-cache",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; portfolio-bot/1.0)" },
    });

    if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

    const xml = await res.text();

    const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];

    return items.slice(0, limit).map((item) => {
      const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] ||
        item.match(/<title>(.*?)<\/title>/)?.[1] || "Untitled";

      const link = item.match(/<link>(.*?)<\/link>/)?.[1] ||
        item.match(/<guid[^>]*>(.*?)<\/guid>/)?.[1] || "#";

      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || "";

      const contentEncoded = item.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/)?.[1] ||
        item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1] || "";

      const categoriesRaw = [...item.matchAll(/<category><!\[CDATA\[(.*?)\]\]><\/category>/g)];
      const categories = categoriesRaw.map((m) => m[1]).slice(0, 4);

      const thumbnail = extractThumbnail(contentEncoded);
      const excerpt = extractExcerpt(contentEncoded);
      const readingTime = estimateReadingTime(contentEncoded);

      return { title, link, pubDate, excerpt, thumbnail, categories, readingTime };
    });
  } catch (err) {
    console.error("Medium fetch failed:", err);
    return [];
  }
}
