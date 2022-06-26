import Layout from "@components/layout";
import { readdirSync, readFileSync } from "fs";
import matter from "gray-matter";
import { NextPage } from "next";

interface Post {
  title: string;
  date: string;
  category: string;
}

const Blog: NextPage<{ posts: Post[] }> = ({ posts }) => {
  return (
    <Layout head="Blog" title="Blog">
      <h1 className="mb-10 mt-5 text-center text-lg font-semibold">
        Latest Posts:
      </h1>
      {posts?.map((item, idx) => (
        <div key={idx} className="mb-5">
          <span className="text-lg text-red-500">{item.title}</span>
          <div>
            <span>
              {item.date} / {item.category}
            </span>
          </div>
        </div>
      ))}
    </Layout>
  );
};

export default Blog;

export async function getStaticProps() {
  const posts = readdirSync("./posts").map((file) => {
    const content = readFileSync(`./posts/${file}`, "utf-8");
    return matter(content).data;
  });
  return {
    props: { posts },
  };
}
