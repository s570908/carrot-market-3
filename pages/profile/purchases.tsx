import type { NextPage } from "next";
import Layout from "@components/layout";
import ProductList from "@components/product-list";

const Bought: NextPage = () => {
  return (
    <Layout
      head="구매내역"
      title="구매내역"
      canGoBack
      backUrl={"/profile"}
      isProfile={true}
    >
      <ProductList kind="purchases" />
    </Layout>
  );
};

export default Bought;
