import type { NextPage } from "next";
import FloatingButton from "@components/floating-button";
import Item from "@components/item";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import Head from "next/head";
import useSWR from "swr";
import { Fav, Products } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import PaginationButton from "@components/pagination-button";

export interface ProductWithCount extends Products {
  fav: Fav[];
  _count: {
    fav: number;
  };
}

interface ProductsResponse {
  ok: boolean;
  products: ProductWithCount[];
}

const Home: NextPage = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data } = useSWR<ProductsResponse>(
    `/api/products?page=${page}&limit=${limit}`
  );
  const onPrevBtn = () => {
    router.push(`${router.pathname}?page=${page - 1}&limit=${limit}`);
    setPage((prev) => prev - 1);
  };
  const onNextBtn = () => {
    router.push(`${router.pathname}?page=${page + 1}&limit=${limit}`);
    setPage((prev) => prev + 1);
  };
  return (
    <Layout title="홈" hasTabBar>
      <Head>
        <title>Home</title>
      </Head>
      <div className="flex flex-col space-y-5 divide-y px-4">
        {data?.products?.map((product) => (
          <Item
            id={product.id}
            key={product.id}
            title={product.name}
            price={product.price}
            hearts={product._count.fav}
            isLike={product.fav
              .map((uid) => {
                if (uid.userId === user?.id) return true;
              })
              .includes(true)}
          />
        ))}
      </div>
      {data ? (
        <>
          <PaginationButton
            onClick={onPrevBtn}
            direction="prev"
            page={page}
            isLoading={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
              />
            </svg>
          </PaginationButton>
          <PaginationButton
            onClick={onNextBtn}
            direction="next"
            page={page}
            itemLength={data?.products.length}
            isLoading={isLoading}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </PaginationButton>
          <FloatingButton href="/products/upload">
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </FloatingButton>
        </>
      ) : null}
    </Layout>
  );
};

export default Home;
