import type { NextPage } from "next";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import { useRouter } from "next/router";
import useSWR from "swr";
import { SellerChat, User } from "@prisma/client";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import Message from "@components/message";

interface ChatWithUser extends SellerChat {
  user: User;
}
interface SellerChatResponse {
  ok: boolean;
  sellerChat: ChatWithUser[];
  seller: {
    buyerId: number;
    sellerId: number;
    buyer: User;
    seller: User;
  };
}
interface ChatFormResponse {
  chatMsg: string;
}

const ChatDetail: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { data, mutate } = useSWR<SellerChatResponse>(
    router.query.id ? `/api/chat/${router.query.id}` : null,
    { refreshInterval: 1000 }
  );
  const { register, handleSubmit, reset } = useForm<ChatFormResponse>();
  const [sendChat, { loading, data: sendChatData }] = useMutation(
    `/api/chat/${router.query.id}/chats`
  );
  const onValid = (chatForm: ChatFormResponse) => {
    if (loading) return;
    reset();
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          sellerChat: [
            ...prev.sellerChat,
            {
              id: Date.now(),
              chatMsg: chatForm.chatMsg,
              user: { ...user },
              userId: user?.id,
            },
          ],
        } as any),
      false
    );
    sendChat(chatForm);
  };
  return (
    <Layout
      head={`${
        data?.seller?.buyerId === user?.id
          ? data?.seller?.seller.name
          : data?.seller?.buyer.name
      } || 채팅`}
      title={`${
        data?.seller?.buyerId === user?.id
          ? data?.seller?.seller.name
          : data?.seller?.buyer.name
      }`}
      canGoBack
      backUrl={"/chats"}
    >
      <div className="space-y-4 py-10 px-4 pb-16">
        <div className="flex flex-col space-y-2">
          {data?.sellerChat?.map((message) => (
            <Message
              reversed={message.userId === user?.id}
              key={message.id}
              name={message.user.name}
              message={message.chatMsg}
              avatar={message.user.avatar}
              date={message.created}
            />
          ))}
        </div>
        <form
          onSubmit={handleSubmit(onValid)}
          className="fixed inset-x-0 bottom-0  bg-white py-2"
        >
          <div className="relative mx-auto flex w-full  max-w-md items-center">
            <input
              {...register("chatMsg", { required: true })}
              type="text"
              className="w-full rounded-full border-gray-300 pr-12 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            />
            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
              <button className="flex items-center rounded-full bg-orange-500 px-3 text-sm text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                &rarr;
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ChatDetail;
