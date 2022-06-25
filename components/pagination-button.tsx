import { cls } from "@libs/client/utils";
import React from "react";

interface PaginationButton {
  children: React.ReactNode;
  rOpt?: number;
  direction?: "prev" | "next";
  page: number;
  itemLength?: any;
  isProfile?: boolean;
  [key: string]: any;
}

export default function PaginationButton({
  children,
  direction,
  page,
  itemLength,
  onClick,
  rest,
  isProfile,
}: PaginationButton) {
  return (
    <button
      {...rest}
      onClick={onClick}
      className={cls(
        isProfile
          ? "bottom-24"
          : direction === "next" || (direction === "prev" && page <= 1)
          ? "bottom-40"
          : "bottom-56",
        direction === "prev" && page <= 1 ? "hidden" : "",
        (direction === "next" || isProfile) && itemLength < 10
          ? "bg-gray-500 text-gray-800 hover:bg-gray-500"
          : "",
        `fixed right-5 flex aspect-square w-14 cursor-pointer items-center justify-center rounded-full  border-0 border-transparent bg-orange-400 text-white shadow-xl transition-all hover:bg-orange-500 sm:sticky sm:translate-x-[32rem]`
      )}
      disabled={
        (direction === "next" || isProfile) && itemLength < 10 ? true : false
      }
    >
      {children}
    </button>
  );
}
