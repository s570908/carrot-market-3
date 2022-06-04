import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import useSWR from "swr";
import { Review, User } from "@prisma/client";
import { cls } from "@libs/client/utils";

interface ReviewWithUser extends Review {
  createBy: User;
}
interface ReviewsResponse {
  ok: boolean;
  reviews: ReviewWithUser[];
}

const Profile: NextPage = () => {
  return (
    <Layout hasTabBar title="나의 캐럿" isProfile={true}>
      <h1>Hello</h1>
    </Layout>
  );
};
export default Profile;
