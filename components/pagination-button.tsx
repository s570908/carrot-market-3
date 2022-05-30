import { cls } from "@libs/client/utils";
import Link from "next/link";
import React from "react";

interface PaginationButton {
  children: React.ReactNode;
  href: string;
  rOpt?: number;
}

export default function PaginationButton({
  children,
  href,
  rOpt,
}: PaginationButton) {
  return (
    <Link href={href}>
      <a
        className={cls(
          `fixed bottom-40 right-5 flex aspect-square w-14 cursor-pointer items-center justify-center rounded-full  border-0 border-transparent bg-orange-400 text-white shadow-xl transition-colors hover:bg-orange-500 sm:sticky sm:translate-x-[32rem]`
        )}
      >
        {children}
      </a>
    </Link>
  );
}
