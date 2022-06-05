import type { NextPage } from "next";
import Layout from "@components/layout";
import ProductList from "@components/product-list";

const Loved: NextPage = () => {
  return (
    <Layout
      head="관심목록"
      title="관심목록"
      canGoBack
      backUrl={"/profile"}
      isProfile={true}
    >
      <ProductList kind="favs" />
    </Layout>
  );
};

export default Loved;
