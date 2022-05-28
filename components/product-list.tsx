import Item from "@components/item";
import useUser from "@libs/client/useUser";
import { ProductWithCount } from "pages";
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
  const { data } = useSWR<ProductListResponse>(`/api/users/me/${kind}`);
  return data ? (
    <>
      {data[kind]?.map((record) => (
        <Item
          id={record.product.id}
          key={record.id}
          title={record.product.name}
          price={record.product.price}
          hearts={record.product._count.fav}
          isLike={record.product.fav
            .map((uid) => {
              if (uid.userId === user.id) return true;
            })
            .includes(true)}
        />
      ))}
    </>
  ) : null;
}
