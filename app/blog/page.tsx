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
    <div className="relative max-w-[1240px] mx-auto px-5 sm:px-8 py-20">
      <div className="glow" aria-hidden />
      <SectionHeader
        eyebrow="Writing"
        title="Notes on"
        titleEm="building"
        subtitle="Thoughts on engineering, AI, product building, and shipping — published on Medium."
      />
      <div className="mt-14">
        {posts.length === 0 ? (
          <div className="text-center py-24 text-mute border border-line rounded-2xl bg-panel">
            <p className="display text-2xl mb-2 text-ink">No posts yet</p>
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post, i) => (
              <div key={i} data-d={String((i % 3) + 1)} className="reveal">
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
