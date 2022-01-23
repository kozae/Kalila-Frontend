import {NextFetchEvent, NextRequest, NextResponse} from "next/server";
import {NextMiddlewareResult} from "next/dist/server/web/types";
import {getToken} from "next-auth/jwt";


export async function middleware(req: NextRequest, event: NextFetchEvent): Promise<NextMiddlewareResult> {
  if (req.nextUrl.pathname.startsWith('/api')) {
    return;
  }
  if (!(await isAuthenticated(req))) {
    return NextResponse.redirect("/api/auth/signin?" + new URLSearchParams({'callbackUrl': req.url}))
  }
}

async function isAuthenticated(req: NextRequest): Promise<boolean> {
  console.log(req.nextUrl)
  switch (req.nextUrl.pathname) {
    case '/': // unprotected paths
      return true;
    default:
      const session = await getToken({
        //@ts-ignore
        req,
        secret: process.env.NEXTAUTH_SECRET,
        secureCookie: true
      })
      console.log({session})
      console.log(isTokenExpired(session?.exp as number))
      return !!session;
  }
}

function isTokenExpired(exp: number) {
  const currentTime = new Date().getTime() / 1000;
  return currentTime > exp
}
