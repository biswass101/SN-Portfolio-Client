import { Outlet, Link, createRootRoute, HeadContent, useRouterState } from "@tanstack/react-router";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { AnimatedBackground } from "../components/AnimatedBackground";

import nayeemFavicon from "../assets/nayeem.jpeg?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { title: "Syed Nayeem Hossain — IT Manager & Infrastructure Expert" },
      {
        name: "description",
        content:
          "IT Manager with 10+ years leading infrastructure, cloud adoption, and digital transformation. PMP, RedHat, Cisco certified.",
      },
      { name: "author", content: "Syed Nayeem Hossain" },
      { property: "og:title", content: "Syed Nayeem Hossain — IT Manager" },
      {
        property: "og:description",
        content: "Infrastructure Expert. PMP, RedHat, Cisco certified. 10+ years of IT leadership.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "icon", type: "image/jpeg", href: nayeemFavicon },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  const location = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = location.startsWith("/admin");

  if (isAdmin) {
    return (
      <>
        <HeadContent />
        <Outlet />
      </>
    );
  }

  return (
    <>
      <HeadContent />
      <AnimatedBackground />
      <Navbar />
      <main className="pt-24">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
