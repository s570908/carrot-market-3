import type { NextPage } from "next";
import Layout from "@components/layout";
import ProductList from "@components/product-list";

const Loved: NextPage = () => {
  return (
    <Layout title="찜꽁" canGoBack backUrl={"/profile"}>
      <div className="flex flex-col space-y-5 divide-y  pb-10">
        <ProductList kind="sales" />
      </div>
    </Layout>
  );
};

export default Loved;
