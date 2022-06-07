import { cls } from "@libs/client/utils";
import ImgComponent from "@components/img-component";

interface MessageProps {
  message: string;
  reversed?: boolean;
  name: string;
  avatar?: string;
}

export default function Message({
  message,
  reversed,
  name,
  avatar,
}: MessageProps) {
  return (
    <div
      className={cls(
        "flex items-start",
        reversed ? "flex-row-reverse space-x-2 space-x-reverse" : "space-x-2"
      )}
    >
      <div>
        {avatar ? (
          <ImgComponent
            imgAdd={`https://imagedelivery.net/D0zOSDPhfEMFCyc4YdUxfQ/${avatar}/avatar`}
            width={32}
            height={32}
            clsProps="rounded-full"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-slate-400" />
        )}
        <span className="m-0 -translate-y-1 text-center text-[8px]">
          {name}
        </span>
      </div>
      <div className="w-1/2 rounded-md border border-gray-300 p-2 text-sm text-gray-700">
        <p>{message}</p>
      </div>
    </div>
  );
}
