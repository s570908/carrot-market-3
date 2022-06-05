import type { NextPage } from "next";
import Layout from "@components/layout";
import ProductList from "@components/product-list";

const Sold: NextPage = () => {
  return (
    <Layout
      head="판매내역"
      title="판매내역"
      canGoBack
      backUrl={"/profile"}
      isProfile={true}
    >
      <ProductList kind="sales" />
    </Layout>
  );
};

export default Sold;
