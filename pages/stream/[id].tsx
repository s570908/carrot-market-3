import type { NextPage } from "next";
import Layout from "@components/layout";
import Message from "@components/message";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Stream, User } from "@prisma/client";
import useUser from "@libs/client/useUser";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutation";
import { useEffect } from "react";
import { cls } from "@libs/client/utils";

interface StreamMessage {
  message: string;
  id: number;
  user: {
    avatar?: string;
    id: number;
    name: string;
  };
}

interface StreamWithMessages extends Stream {
  messages: StreamMessage[];
  user: User;
}

interface StreamResponse {
  ok: boolean;
  stream: StreamWithMessages;
  live: boolean;
}

interface MessageForm {
  message: string;
}

const StreamDetail: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const { data, mutate } = useSWR<StreamResponse>(
    router.query.id ? `/api/streams/${router.query.id}` : null,
    { refreshInterval: 1000 }
  );
  const [sendMessage, { loading, data: sendMessageData }] = useMutation(
    `/api/streams/${router.query.id}/messages`
  );
  const onValid = (form: MessageForm) => {
    if (loading) return;
    reset();
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          stream: {
            ...prev.stream,
            messages: [
              ...prev.stream.messages,
              { id: Date.now(), message: form.message, user: { ...user } },
            ],
          },
        } as any),
      false
    );
    sendMessage(form);
  };
  useEffect(() => {
    const msgBox = document.querySelector("#msg") as HTMLElement;
    msgBox.scrollTop = msgBox.scrollHeight;
  }, [sendMessageData]);
  return (
    <Layout
      head={`${data?.stream.name} || 라이브`}
      title={`${data?.stream.user.name}의 라이브`}
      canGoBack
      backUrl={"/stream"}
    >
      <div className="space-y-4 py-10  px-4">
        <div className="relative bg-slate-300">
          {data?.live ? (
            <iframe
              className="aspect-video w-full rounded-md shadow-sm"
              src={`https://iframe.videodelivery.net/${data?.stream.cloudflareId}}`}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen={true}
            ></iframe>
          ) : (
            <iframe
              className="aspect-video w-full rounded-md shadow-sm"
              src={`https://iframe.videodelivery.net/${data?.stream.replayVideoId}}`}
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
              allowFullScreen={true}
            ></iframe>
          )}
          <div className="absolute top-0 right-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={cls(
                data?.live ? "text-red-500" : "text-gray-500",
                "h-6 w-6"
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>
          </div>
        </div>
        <div className="mt-5">
          <h1 className="text-3xl font-bold text-gray-900">
            {data?.stream.name}
          </h1>
          <div className="flex flex-row items-center justify-between">
            <span className="mt-3 text-2xl text-gray-900">
              ￦ {data?.stream.price}
            </span>
            <span className="mt-3 text-base text-gray-900">
              <span className="font-bold">판매자: </span>
              {data?.stream.user.name}
            </span>
          </div>
          <p className=" my-6 text-gray-700">{data?.stream.description}</p>
          {user?.id === data?.stream.userId ? (
            <div className="flex flex-col space-y-3 overflow-x-scroll rounded-md bg-orange-300 p-5">
              <span className="font-medium">Stream Keys (secret)</span>
              <span className="text-gray-600">
                <span className="font-medium text-gray-900">URL:</span>
                {data?.stream.cloudflareUrl}
              </span>
              <span className="text-gray-600">
                <span className="font-medium text-gray-900">Key:</span>
                {data?.stream.cloudflareKey}
              </span>
            </div>
          ) : null}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
          <div
            id="msg"
            className="h-[50vh] space-y-2 overflow-y-scroll py-8  px-4"
          >
            {data?.stream.messages?.map((message) => (
              <Message
                reversed={message.user.id === user?.id}
                key={message.id}
                name={message.user.name}
                message={message.message}
                avatar={message.user.avatar}
              />
            ))}
          </div>
          <div className="fixed inset-x-0 bottom-0 bg-white py-2">
            <form
              onSubmit={handleSubmit(onValid)}
              className="relative mx-auto flex w-full  max-w-md items-center"
            >
              <input
                type="text"
                {...register("message", { required: true })}
                className="w-full rounded-full border-gray-300 pr-12 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
              />
              <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                <button className="flex items-center rounded-full bg-orange-500 px-3 text-sm text-white hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                  &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StreamDetail;
