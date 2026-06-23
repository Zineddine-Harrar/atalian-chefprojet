import { auth } from "@/lib/auth";

export default auth((req) => {
  const isAuth = !!req.auth;
  const isLogin = req.nextUrl.pathname === "/login";
  if (!isAuth && !isLogin) {
    const url = new URL("/login", req.nextUrl);
    return Response.redirect(url);
  }
  if (isAuth && isLogin) {
    return Response.redirect(new URL("/today", req.nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|.*\\.png$).*)"],
};
