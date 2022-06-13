import { cls } from "@libs/client/utils";
import ImgComponent from "@components/img-component";
import RegDate from "@components/regDate";
import Image from "next/image";

interface MessageProps {
  message: string;
  reversed?: boolean;
  name: string;
  avatar?: string | null;
  date?: any;
}

export default function Message({
  message,
  reversed,
  name,
  avatar,
  date,
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
          {name.length > 5 ? name.slice(0, 5) + "..." : name}
        </span>
      </div>
      <div className="w-1/2 rounded-md border border-gray-300 p-2 text-sm text-gray-700">
        <p>{message}</p>
      </div>
      {date && (
        <span>
          <RegDate className="translate-y-5 text-xs" regDate={date} />
        </span>
      )}
    </div>
  );
}
