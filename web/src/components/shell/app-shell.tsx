"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin } from "lucide-react";
import { cn } from "cn";
import { CitySearch } from "@/components/settings/city-search";

const NAV = [
  { href: "/", label: "Today" },
  { href: "/wardrobe", label: "Wardrobe" },
  { href: "/schedule", label: "Schedule" },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // The sky lives inside /weather's hero panel, so the chrome stays linen
  // everywhere; the route only decides whether picking a city navigates.
  const onWeather = pathname.startsWith("/weather");

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-30 border-b border-linen-2 bg-paper"
        )}
      >
        <div className="mx-auto flex w-full max-w-[1120px] flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2.5 sm:h-16 sm:flex-nowrap sm:gap-8 sm:px-7 sm:py-0">
          <Link
            href="/"
            className="relative shrink-0 rounded-[3px] bg-ink/90 px-2.5 py-1.5 text-[10.5px] font-bold tracking-[0.12em] text-paper whitespace-nowrap sm:px-3 sm:text-[11.5px] sm:tracking-[0.15em] sm:before:absolute sm:before:top-1/2 sm:before:-left-2.5 sm:before:h-px sm:before:w-2.5 sm:before:bg-stitch sm:after:absolute sm:after:top-1/2 sm:after:-right-2.5 sm:after:h-px sm:after:w-2.5 sm:after:bg-stitch"
          >
            OUTFITTER AI
          </Link>
          <nav className="order-3 flex w-full gap-1 sm:order-none sm:ml-1 sm:w-auto">
            {NAV.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-[13.5px] whitespace-nowrap transition-colors sm:px-3.5 sm:py-2 sm:text-[14.5px]",
                    active
                      ? "bg-linen font-semibold text-ink"
                      : "text-ink-soft hover:bg-linen"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex min-w-0 items-center gap-3">
            {/* One control, not two: the location is the search. Typing in it
                offers cities, and picking one sets the forecast — the same
                field Settings shows, rather than a search box beside a label
                that only looked editable. */}
            <div className="flex min-w-0 items-center gap-1.5 text-ink-soft">
              <MapPin className="size-3.5 shrink-0" strokeWidth={1.7} aria-hidden />
              {/* On the forecast page the pick has to navigate: that page is
                  server-rendered per city. */}
              <CitySearch variant="header" navigate={onWeather} />
            </div>
            <Link
              href="/settings"
              title="Settings"
              aria-label="Settings"
              className="grid size-9 place-items-center rounded-full bg-indigo text-[13px] font-semibold text-white"
            >
              A
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1120px] px-5 pt-7 pb-20 sm:px-7 sm:pt-8">
        {children}
      </main>
    </>
  );
}
