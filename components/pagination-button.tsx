import { cls } from "@libs/client/utils";
import Link from "next/link";
import React from "react";

interface PaginationButton {
  children: React.ReactNode;
  rOpt?: number;
  direction: "left" | "right";
  page: number;
  [key: string]: any;
}

export default function PaginationButton({
  children,
  direction,
  page,
  onClick,
  rest,
}: PaginationButton) {
  return (
    <button
      {...rest}
      className={cls(
        direction === "left" || (direction === "right" && page <= 1)
          ? "bottom-40"
          : "bottom-56",
        direction === "left" && page <= 1 ? "hidden" : "",
        `fixed right-5 flex aspect-square w-14 cursor-pointer items-center justify-center rounded-full  border-0 border-transparent bg-orange-400 text-white shadow-xl transition-colors hover:bg-orange-500 sm:sticky sm:translate-x-[32rem]`
      )}
    >
      {children}
    </button>
  );
}
