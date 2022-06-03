import type { NextPage } from "next";
import Layout from "@components/layout";
import ProductList from "@components/product-list";

const Sold: NextPage = () => {
  return (
    <Layout
      title="판매내역"
      canGoBack
      backUrl={"/profile"}
      hasTabBar
      isProfile={true}
    >
      <ProductList kind="sales" />
    </Layout>
  );
};

export default Sold;
