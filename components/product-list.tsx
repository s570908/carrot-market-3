import Item from "@components/item";
import PaginationButton from "@components/pagination-button";
import useUser from "@libs/client/useUser";
import { useRouter } from "next/router";
import { ProductWithCount } from "pages";
import { useEffect, useState } from "react";
import useSWR from "swr";

interface ProductListProps {
  kind: "favs" | "sales" | "purchases";
}

interface Record extends ProductListResponse {
  id: number;
  product: ProductWithCount;
}

interface ProductListResponse {
  [key: string]: Record[];
}

export default function ProductList({ kind }: ProductListProps) {
  const { user } = useUser();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data } = useSWR<ProductListResponse>(
    `/api/users/me/${kind}?&page=${page}&limit=${limit}`
  );
  console.log(data);
  const onPrevBtn = () => {
    router.push(`${router.pathname}?page=${page - 1}&limit=${limit}`);
    setPage((prev) => prev - 1);
  };
  const onNextBtn = () => {
    router.push(`${router.pathname}?page=${page + 1}&limit=${limit}`);
    setPage((prev) => prev + 1);
  };
  return data ? (
    <>
      <div className="flex flex-col space-y-5 divide-y">
        {data[kind]?.map((record) => (
          <Item
            id={record.product.id}
            key={record.id}
            title={record.product.name}
            price={record.product.price}
            hearts={record.product._count.fav}
            isLike={record.product.fav
              ?.map((uid) => {
                if (uid.userId === user?.id) return true;
              })
              .includes(true)}
          />
        ))}
      </div>
      <PaginationButton onClick={onPrevBtn} direction="left" page={page}>
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
        direction="right"
        page={page}
        itemLength={data[kind]?.length}
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
    </>
  ) : null;
}
