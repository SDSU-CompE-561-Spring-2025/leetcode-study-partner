import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      console.log("Middleware is running");
      return !!token;
    },
  },
});


export const config = {
  matcher: ["/dashboard", "/dashboard/:path*", "/matchmaking", "/matchmaking/:path*", 
            "/communcation", "/communcation/:path*", "/review", "/review/:path*"],
};