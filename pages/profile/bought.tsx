import type { NextPage } from "next";
import Layout from "@components/layout";
import ProductList from "@components/product-list";

const Bought: NextPage = () => {
  return (
    <Layout title="구매내역" canGoBack backUrl={"/profile"}>
      <div className="flex flex-col space-y-5 divide-y  pb-10">
        <ProductList kind="sales" />
      </div>
    </Layout>
  );
};

export default Bought;
