import type { NextRequest, NextFetchEvent } from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  console.log("profile에서만 작동하는 미들웨어입니다.");
}
