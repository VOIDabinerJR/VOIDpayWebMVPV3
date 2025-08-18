import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware((auth, req) => {
  // Public routes (no auth required)
  const publicRoutes = [
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/webhook(.*)",
    "/api/public(.*)",
  ];

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some((route) => {
    const regex = new RegExp(`^${route.replace("(.*)", ".*")}$`);
    return regex.test(req.nextUrl.pathname);
  });

  // If NOT public, protect the route
//   if (!isPublicRoute) {
//     auth().protect();
//   }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};