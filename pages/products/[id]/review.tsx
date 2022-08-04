import type { NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import TextArea from "@components/textarea";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import useUser from "@libs/client/useUser";
import useSWR from "swr";
import { Products, User } from "@prisma/client";
import ImgComponent from "@components/img-component";
import Link from "next/link";

interface ProductWithUser extends Products {
  user: User;
}

interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUser;
}

interface ReviewForm {
  [key: string]: string;
}

const Review: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { data, mutate: boundMutate } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  const { register, handleSubmit, watch } = useForm<ReviewForm>({
    mode: "onChange",
  });
  const [starScore, setStarScore] = useState(0);
  const [writeReview, { loading: writeReviewLoading, data: writeReviewData }] =
    useMutation(
      `/api/products/${router.query.id}/review?seller=${data?.product.userId}`
    );
  const onValid = ({ review }: ReviewForm) => {
    if (writeReviewLoading) return;
    writeReview({ review, score: starScore });
  };
  useEffect(() => {
    if (writeReviewData?.ok) {
      router.back();
    }
  }, [writeReviewData, router]);
  return (
    <Layout head="리뷰" canGoBack title="리뷰 쓰기" backUrl="back">
      <div className="px-4 py-2">
        <div className="mb-8">
          <ImgComponent
            isLayout={true}
            layoutHeight="h-72"
            imgAdd={`https://raw.githubusercontent.com/Real-Bird/pb/master/rose.jpg`}
            clsProps="object-scale-down"
            imgName={data?.product?.name}
          />
          <div className="flex cursor-pointer items-center space-x-3 border-t border-b py-3">
            {data?.product?.user?.avatar ? (
              <ImgComponent
                imgAdd={`https://raw.githubusercontent.com/Real-Bird/pb/master/rose.jpg`}
                width={48}
                height={48}
                clsProps="rounded-full"
                imgName={data?.product?.user?.name}
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
          <div className="flex flex-col items-start space-x-3 border-t border-b py-3">
            <h1 className="text-3xl font-bold text-gray-900">
              {data ? data?.product?.name : "Now Loading..."}
            </h1>
            <span className="mt-3 block text-3xl text-gray-900">
              ￦{data ? data?.product?.price : "Now Loading..."}
            </span>
          </div>
          <form className="space-y-4 p-4" onSubmit={handleSubmit(onValid)}>
            <div className="flex flex-col items-start justify-start">
              <span className="text-sm font-bold">몇 점짜리 물건인고?</span>
              <div className="my-2 flex flex-row-reverse items-center justify-around">
                {[5, 4, 3, 2, 1].map((val, key) => (
                  <>
                    <input
                      key={Date.now() + key}
                      type="radio"
                      {...register(`score${val}`)}
                      value={val}
                      checked={val === starScore}
                      id={`score${val}`}
                      className="peer hidden"
                      name="score"
                    />
                    <label
                      htmlFor={`score${val}`}
                      onClick={(e) => setStarScore(val)}
                      className="cursor-pointer text-gray-300 peer-checked:text-orange-400 peer-hover:text-orange-300"
                    >
                      <svg
                        className="h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </label>
                  </>
                ))}
              </div>
            </div>
            <TextArea
              register={register("review", { required: true })}
              name="review"
              label="Review"
            />
            <Button text={"Upload Review"} />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Review;
