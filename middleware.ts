import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isAuth = !!req.auth;
  const isLogin = req.nextUrl.pathname === "/login";
  if (!isAuth && !isLogin) {
    return Response.redirect(new URL("/login", req.nextUrl));
  }
  if (isAuth && isLogin) {
    return Response.redirect(new URL("/today", req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|.*\\.png$).*)"],
};
