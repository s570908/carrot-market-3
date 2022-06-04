import Item from "@components/item";
import PaginationButton from "@components/pagination-button";
import useUser from "@libs/client/useUser";
import { ProductWithCount } from "pages";
import useSWRInfinite from "swr/infinite";

interface ProductListProps {
  kind: "favs" | "sales" | "purchases";
}

interface Record extends ProductListResponse {
  id: number;
  product: ProductWithCount;
  pages: number;
}

interface ProductListResponse {
  [key: string]: Record[];
}

const getKey = (pageIndex: number, previousPageData: ProductListResponse) => {
  const kind = document.location.href.split("/").pop();
  if (pageIndex === 0) return `/api/users/me/${kind}?&page=1&limit=10`;
  if (pageIndex + 1 > +previousPageData.pages) return null;
  return `/api/users/me/${kind}?&page=${pageIndex + 1}&limit=10`;
};
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProductList({ kind }: ProductListProps) {
  const { user } = useUser();
  const { data, setSize, size } = useSWRInfinite<ProductListResponse>(
    getKey,
    fetcher
  );
  const products = data ? data.map((item) => item[kind]).flat() : [];
  const nextData = data ? data.map((item) => item.next) : [];
  const onNextBtn = () => {
    setSize((prev) => prev + 1);
  };
  return data ? (
    <>
      <div className="flex flex-col space-y-5 divide-y">
        {products?.map((record) => (
          <Item
            id={record.id}
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
      <PaginationButton
        onClick={onNextBtn}
        page={size}
        itemLength={nextData[nextData.length - 1].length}
        isProfile={true}
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
            d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"
          />
        </svg>
      </PaginationButton>
    </>
  ) : null;
}
