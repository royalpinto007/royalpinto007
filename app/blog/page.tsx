import type { Metadata } from "next";
import { SectionHeader } from "@/components/SectionHeader";
import { BlogCard } from "@/components/BlogCard";
import { fetchMediumPosts } from "@/lib/medium";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: "Blog",
  description: "Thoughts on engineering, AI, product building, and shipping.",
};

export default async function BlogPage() {
  const posts = await fetchMediumPosts(siteConfig.mediumFeedUrl, 12);

  return (
    <div className="max-w-[1300px] mx-auto px-5 sm:px-8 py-20">
      <SectionHeader
        eyebrow="Writing"
        title="Notes on"
        titleEm="building"
        subtitle="Thoughts on engineering, AI, product building, and shipping — published on Medium."
      />
      {posts.length === 0 ? (
        <div className="text-center py-24 text-mute border border-line rounded-xl bg-panel">
          <p className="text-lg mb-2 text-ink">No posts yet</p>
          <p className="text-sm">
            In the meantime, find me on{" "}
            <a
              href={`https://medium.com/@${siteConfig.mediumUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover"
            >
              Medium
            </a>
            .
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post, i) => (
            <BlogCard key={i} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
