import { useEffect, useRef, useState } from "react";
import { FilterOption } from "@/lib/types";

const TABS: { name: string; value: FilterOption | null }[] = [
  { name: "All Venues", value: null },
  { name: "Cabins", value: "cabins" },
  { name: "Sunny Beaches", value: "sunny-beaches" },
  { name: "Mountain Views", value: "mountain-views" },
];

interface TabsBarProps {
  filter: string | null;
  handleFilterChange: (newFilter: FilterOption | null) => void;
}

export default function TabsBar({ filter, handleFilterChange }: TabsBarProps) {
  const [activeTab, setActiveTab] = useState(
    TABS.find((tab) => tab.value === filter)?.name || TABS[0].name,
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const activeTabElementRef = useRef<HTMLButtonElement>(null);

  // When filter changes in the URL, update the active tab
  useEffect(() => {
    const matchedTab = TABS.find((tab) => tab.value === filter);
    if (matchedTab) {
      setActiveTab(matchedTab.name);
    } else {
      setActiveTab(TABS[0].name); // Default to "All Venues"
    }
  }, [filter]);

  useEffect(() => {
    const container = containerRef.current;

    if (activeTab && container) {
      const activeTabElement = activeTabElementRef.current;

      if (activeTabElement) {
        const { offsetLeft, offsetWidth } = activeTabElement;
        const clipLeft = offsetLeft;
        const clipRight = offsetLeft + offsetWidth;
        container.style.clipPath = `inset(0 ${Number(
          100 - (clipRight / container.offsetWidth) * 100,
        ).toFixed()}% 0 ${Number(
          (clipLeft / container.offsetWidth) * 100,
        ).toFixed()}% round 17px)`;
      }
    }
  }, [activeTab, activeTabElementRef, containerRef]);

  return (
    <div className="mx-auto mt-14 flex w-fit items-center gap-x-2 rounded-full bg-stone-200/90 p-1.5 md:gap-x-4 lg:gap-x-6 xl:gap-x-12">
      <div className="relative flex flex-col">
        <ul className="flex w-full justify-center gap-x-2 md:gap-x-4 lg:gap-x-6 xl:gap-x-12">
          {TABS.map((tab) => (
            <li key={tab.name}>
              <button
                ref={activeTab === tab.name ? activeTabElementRef : null}
                data-tab={tab.name}
                onClick={() => handleFilterChange(tab.value)}
                className={`flex h-9 items-center whitespace-nowrap rounded-full px-6 py-2 font-medium text-gray-600 ${
                  activeTab === tab.name ? "text-primary" : ""
                }`}
              >
                {tab.name}
              </button>
            </li>
          ))}
        </ul>

        <div
          aria-hidden
          className="absolute z-10 w-full overflow-hidden transition-[clip-path] duration-300"
          ref={containerRef}
          style={{ clipPath: "inset(0 75% 0 0 round 17px)" }}
        >
          <ul className="flex w-full justify-center gap-x-2 bg-white shadow-sm md:gap-x-4 lg:gap-x-6 xl:gap-x-12">
            {TABS.map((tab) => (
              <li key={tab.name}>
                <button
                  data-tab={tab.name}
                  onClick={() => handleFilterChange(tab.value)}
                  className="flex h-9 items-center whitespace-nowrap rounded-full px-6 py-2 font-medium opacity-100"
                  tabIndex={-1}
                >
                  {tab.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}