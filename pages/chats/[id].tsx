import type { NextPage } from "next";
import Layout from "@components/layout";
import Chat from "@components/Chat";
import useUser from "@libs/client/useUser";
import { useRouter } from "next/router";
import useSWR from "swr";
import { ChatRoom, SellerChat } from "@prisma/client";
import RegDate from "@components/regDate";
import { useForm } from "react-hook-form";

interface SellerChatResponse {
  ok: boolean;
  sellerChat: SellerChat[];
  seller: {
    createFor: {
      name: string;
    };
  };
}
interface ChatFormResponse {
  chatMsg: string;
}

const ChatDetail: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { data } = useSWR<SellerChatResponse>(
    router.query.id ? `/api/chat/${router.query.id}` : null
  );
  const { register, handleSubmit, reset } = useForm<ChatFormResponse>();
  const [sendChat, { loading, data: sendChatData }] = useMutation(
    `/api/streams/${router.query.id}/chats`
  );
  const onValid = (chatForm: ChatFormResponse) => {
    reset();
  };
  return (
    <Layout
      head={`${data?.seller?.createFor.name} || 채팅`}
      title={`${data?.seller?.createFor.name}`}
      canGoBack
      backUrl={"/chats"}
    >
      <div className="space-y-4 py-10 px-4 pb-16">
        <div className="flex flex-col space-y-2">
          {data?.sellerChat?.map((Chat) => (
            <Chat
              reversed={Chat.createdById === user?.id}
              key={Chat.id}
              name={Chat.createBy.name}
              Chat={Chat.chatMsg}
              avatar={Chat.createBy.avatar}
              date={Chat.created}
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
