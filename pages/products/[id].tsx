import type { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import Head from "next/head";
import useSWR, { mutate, useSWRConfig } from "swr";
import { useRouter } from "next/router";
import Link from "next/link";
import { Products, User } from "@prisma/client";
import useMutation from "@libs/client/useMutation";
import { cls } from "@libs/client/utils";
import useUser from "@libs/client/useUser";
import Image from "next/image";
import ImgComponent from "@components/img-component";

interface ProductWithUser extends Products {
  user: User;
}
interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedProducts: Products[];
  isLike: boolean;
}

const ItemDetail: NextPage = () => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  // const { mutate: unboundMutate } = useSWRConfig();
  const { data, mutate: boundMutate } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`);
  const onFavClick = () => {
    if (!data) return;
    boundMutate((prev) => prev && { ...prev, isLike: !prev.isLike }, false);
    // unboundMutate("/api/users/me", (prev: any) => ({ ok: !prev.ok }), false);
    toggleFav({});
  };
  const onChatClick = () => {
    router.push(`/chats/${data?.product.userId}`);
  };
  return (
    <Layout head="캐럿" title="캐럿" canGoBack backUrl={"back"}>
      <div className="px-4 py-4">
        <div className="mb-8">
          <ImgComponent
            isLayout={true}
            layoutHeight="h-96"
            imgAdd={`https://imagedelivery.net/D0zOSDPhfEMFCyc4YdUxfQ/${data?.product?.image}/public`}
            clsProps="object-scale-down"
          />
          <div className="flex cursor-pointer items-center space-x-3 border-t border-b py-3">
            {data?.product?.user?.avatar ? (
              <ImgComponent
                imgAdd={`https://imagedelivery.net/D0zOSDPhfEMFCyc4YdUxfQ/${data?.product?.user?.avatar}/avatar`}
                width={48}
                height={48}
                clsProps="rounded-full"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-slate-300" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-700">
                {data ? data?.product?.user?.name : "Now Loading..."}
              </p>
              <Link href={`/profile/${data?.product?.user?.id}`}>
                <a className="text-xs font-medium text-gray-500">
                  View profile &rarr;
                </a>
              </Link>
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">
              {data ? data?.product?.name : "Now Loading..."}
            </h1>
            <span className="mt-3 block text-3xl text-gray-900">
              ￦{data ? data?.product?.price : "Now Loading..."}
            </span>
            <p className="my-6 text-base text-gray-700">
              {data ? data?.product?.description : "Now Loading..."}
            </p>
            <div className="flex items-center justify-between space-x-2">
              <Button onClick={onChatClick} large text="Talk to seller" />
              <button
                onClick={onFavClick}
                className={cls(
                  data?.isLike
                    ? " text-red-400 hover:text-red-500"
                    : "text-gray-400 hover:text-gray-500",
                  "flex items-center justify-center rounded-md p-3 hover:bg-gray-100 "
                )}
              >
                {data?.isLike ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 "
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar Items</h2>
          <div className="grid grid-cols-2 gap-4">
            {data?.relatedProducts.map((product) => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <div className="cursor-pointer">
                  <ImgComponent
                    imgAdd={`https://imagedelivery.net/D0zOSDPhfEMFCyc4YdUxfQ/${product?.image}/public`}
                    isLayout={true}
                    layoutHeight="h-56"
                    clsProps="mt-6 mb-4 bg-slate-300"
                  />
                  <h3 className="-mb-1 text-base text-gray-700">
                    {product.name}
                  </h3>
                  <span className="text-xs font-medium text-gray-900">
                    ￦{product.price}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ItemDetail;
