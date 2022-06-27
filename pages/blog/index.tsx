import Layout from "@components/layout";
import { readdirSync, readFileSync } from "fs";
import matter from "gray-matter";
import { NextPage } from "next";
import Link from "next/link";

interface Post {
  title: string;
  date: string;
  category: string;
  slug: string;
}

const Blog: NextPage<{ posts: Post[] }> = ({ posts }) => {
  return (
    <Layout head="Blog" title="Blog">
      <h1 className="mb-10 mt-5 text-center text-lg font-semibold">
        Latest Posts:
      </h1>
      {posts?.map((item, idx) => (
        <div key={idx} className="mb-5 px-10">
          <Link href={`/blog/${item.slug}`}>
            <a>
              <span className="text-lg text-red-500">{item.title}</span>
              <div>
                <span>
                  {item.date} / {item.category}
                </span>
              </div>
            </a>
          </Link>
        </div>
      ))}
    </Layout>
  );
};

export default Blog;

export async function getStaticProps() {
  const blogPosts = readdirSync("./posts").map((file) => {
    const content = readFileSync(`./posts/${file}`, "utf-8");
    const [slug, _] = file.split(".");
    return { ...matter(content).data, slug };
  });
  return {
    props: { posts: blogPosts.reverse() },
  };
}
