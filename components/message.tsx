import { cls } from "@libs/client/utils";

interface MessageProps {
  message: string;
  reversed?: boolean;
  avatarUrl?: string;
  name: string;
}

export default function Message({
  message,
  avatarUrl,
  reversed,
  name,
}: MessageProps) {
  return (
    <div
      className={cls(
        "flex  items-start",
        reversed ? "flex-row-reverse space-x-reverse" : "space-x-2"
      )}
    >
      <div>
        <div className="h-8 w-8 rounded-full bg-slate-400" />
        <span className="mb-0 text-left text-xs">{name}</span>
      </div>
      <div className="w-1/2 rounded-md border border-gray-300 p-2 text-sm text-gray-700">
        <p>{message}</p>
      </div>
    </div>
  );
}
