import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import useSWR from "swr";
import ImgComponent from "@components/img-component";
import { ChatRoom, SellerChat, User } from "@prisma/client";
import { useEffect } from "react";

interface ChatRoomWithUser extends ChatRoom {
  buyer: User;
  seller: User;
  recentMsg: SellerChat;
}

interface ChatRoomResponse {
  ok: boolean;
  chatRoomList: ChatRoomWithUser[];
}

const Chats: NextPage = () => {
  const { user } = useUser();
  const { data } = useSWR<ChatRoomResponse>(`/api/chat`, {
    refreshInterval: 1000,
  });
  useEffect(() => {
    if (data && data.ok) {
      data.chatRoomList.map((room) => {
        if (!room.recentMsgId) {
          fetch(`/api/chat?roomId=${room.id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
      });
    }
  }, [data]);
  return (
    <Layout head="채팅" title="채팅" hasTabBar>
      <div className="divide-y-[1px] py-10">
        {data?.chatRoomList.map((chatRoom) => (
          <Link href={`/chats/${chatRoom.id}`} key={chatRoom.id}>
            <a className="flex cursor-pointer items-center space-x-3 px-4 py-3">
              {chatRoom.buyerId === user?.id ? (
                chatRoom.seller.avatar ? (
                  <ImgComponent
                    imgAdd={`https://imagedelivery.net/D0zOSDPhfEMFCyc4YdUxfQ/${chatRoom.seller.avatar}/avatar`}
                    width={48}
                    height={48}
                    clsProps="rounded-full"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-slate-500" />
                )
              ) : chatRoom.buyer.avatar ? (
                <ImgComponent
                  imgAdd={`https://imagedelivery.net/D0zOSDPhfEMFCyc4YdUxfQ/${chatRoom.buyer.avatar}/avatar`}
                  width={48}
                  height={48}
                  clsProps="rounded-full"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-slate-500" />
              )}
              <div>
                <p className="text-gray-700">
                  {chatRoom.buyerId === user?.id
                    ? chatRoom.seller.name
                    : chatRoom.buyer.name}
                </p>
                <p className="text-sm  text-gray-500">
                  {chatRoom.recentMsg?.chatMsg}
                </p>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Chats;
