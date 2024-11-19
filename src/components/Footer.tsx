import { useMatches, useNavigate } from "@tanstack/react-router";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export default function Footer() {
  const navigate = useNavigate();
  const matches = useMatches();

  const hideFooter = matches.some(
    (match) => match.routeId === "/_authenticated",
  );

  return (
    <footer className="relative mx-auto flex h-[440px] w-full max-w-[1920px] flex-col justify-end">
      <div
        className={cn(
          "mx-auto flex w-full max-w-3xl items-start justify-between px-4 pt-10",
          { hidden: hideFooter },
        )}
      >
        <div className="space-y-6">
          <img src="/Logo.png" alt="logo" className="h-12 w-auto" />
          <span className="flex flex-col">
            <span className="text-muted-foreground">Email</span>
            <span className="text-lg">info@holidaze.com</span>
          </span>
          <span className="flex flex-col">
            <span className="text-muted-foreground">Phone</span>
            <span className="text-left">(123) 456 789</span>
          </span>
          <div className="flex gap-4 pb-4">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/assets/icons/instagram.svg" alt="instagram" />
            </a>
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/assets/icons/facebook.svg" alt="facebook" />
            </a>
            <a
              href="https://x.com/home"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/assets/icons/x.svg" alt="x" />
            </a>
          </div>
        </div>
        <div className="">
          <div className="space-y-6">
            <h2 className="mt-4 text-2xl font-semibold">Destinations</h2>
            <div className="flex flex-col">
              <Button
                variant={"linkHover2"}
                onClick={() =>
                  navigate({
                    to: "/by-continent",
                    search: { filter: "europe" },
                  })
                }
                className="w-fit justify-start px-0 text-lg font-normal after:w-full"
              >
                Europe
              </Button>
              <Button
                variant={"linkHover2"}
                onClick={() =>
                  navigate({
                    to: "/by-continent",
                    search: { filter: "asia" },
                  })
                }
                className="w-fit justify-start px-0 text-lg font-normal after:w-full"
              >
                Asia
              </Button>
              <Button
                variant={"linkHover2"}
                onClick={() =>
                  navigate({
                    to: "/by-continent",
                    search: { filter: "north-america" },
                  })
                }
                className="w-fit justify-start px-0 text-lg font-normal after:w-full"
              >
                North America
              </Button>
              <Button
                variant={"linkHover2"}
                onClick={() =>
                  navigate({
                    to: "/by-continent",
                    search: { filter: "south-america" },
                  })
                }
                className="w-fit justify-start px-0 text-lg font-normal after:w-full"
              >
                South America
              </Button>
              <Button
                variant={"linkHover2"}
                onClick={() =>
                  navigate({
                    to: "/by-continent",
                    search: { filter: "africa" },
                  })
                }
                className="w-fit justify-start px-0 text-lg font-normal after:w-full"
              >
                Africa
              </Button>
              <Button
                variant={"linkHover2"}
                onClick={() =>
                  navigate({
                    to: "/by-continent",
                    search: { filter: "oceania" },
                  })
                }
                className="w-fit justify-start px-0 text-lg font-normal after:w-full"
              >
                Oceania
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-10">
        <Separator className="bg-primary/40" />
        <p className="p-4 text-center text-sm text-muted-foreground">
          2024 © designed & developed by devmarty.com
        </p>
      </div>

      <div
        className="absolute bottom-0 left-0 -z-20 h-full w-full bg-cover bg-bottom"
        style={{
          backgroundImage: `url(${"../../mountain-cropped.webp"})`,
        }}
      />
      <div className="absolute bottom-0 left-0 -z-10 h-full w-full bg-gradient-to-b from-white to-white/80" />
    </footer>
  );
}
