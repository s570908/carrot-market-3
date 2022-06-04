import type { NextPage } from "next";
import Layout from "@components/layout";
import ProductList from "@components/product-list";

const Loved: NextPage = () => {
  return (
    <Layout title="찜꽁" canGoBack backUrl={"/profile"} isProfile={true}>
      <ProductList kind="favs" />
    </Layout>
  );
};

export default Loved;
