import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define which routes are public
const isPublicRoute = createRouteMatcher([
  "/",
  "/api/webhooks/stripe",
  "/sign-in(.*)",  // Add these if you have auth pages
  "/sign-up(.*)",  // Add these if you have auth pages
]);

export default clerkMiddleware(async (auth, request) => {
  // Protect all routes EXCEPT public ones
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!.*\\..*|_next).*)",
    "/",
    "/(api|trpc)(.*)"
  ],
};

