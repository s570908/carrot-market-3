import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import useUser from "@libs/client/useUser";
import { useRouter } from "next/router";
import useSWR from "swr";
import { ChatRoom } from "@prisma/client";
import ImgComponent from "@components/img-component";

interface ChatRoomResponse {
  ok: boolean;
  chatRoomList: ChatRoom[];
}

const Chats: NextPage = () => {
  const { user } = useUser();
  const { data } = useSWR<ChatRoomResponse>(`/api/chat`);
  return (
    <Layout head="채팅" title="채팅" hasTabBar>
      <div className="divide-y-[1px] py-10">
        {data?.chatRoomList.map((chatRoom) => (
          <Link href={`/chats/${chatRoom.createdForId}`} key={chatRoom.id}>
            <a className="flex cursor-pointer items-center space-x-3 px-4 py-3">
              {chatRoom.createdById === user?.id ? (
                chatRoom.createFor.avatar ? (
                  <ImgComponent
                    imgAdd={`https://imagedelivery.net/D0zOSDPhfEMFCyc4YdUxfQ/${chatRoom.createFor.avatar}/avatar`}
                    width={48}
                    height={48}
                    clsProps="rounded-full"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-slate-500" />
                )
              ) : chatRoom.createBy.avatar ? (
                <ImgComponent
                  imgAdd={`https://imagedelivery.net/D0zOSDPhfEMFCyc4YdUxfQ/${chatRoom.createBy.avatar}/avatar`}
                  width={48}
                  height={48}
                  clsProps="rounded-full"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-slate-500" />
              )}
              <div>
                <p className="text-gray-700">
                  {chatRoom.createdById === user?.id
                    ? chatRoom.createFor.name
                    : chatRoom.createBy.name}
                </p>
                <p className="text-sm  text-gray-500">
                  {chatRoom.recentMsg.chatMsg}
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
