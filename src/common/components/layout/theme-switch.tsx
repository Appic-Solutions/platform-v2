"use client";
import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "../icons";
import { getStorageItem, setStorageItem } from "@/common/helpers/localstorage";
import { cn } from "@/common/helpers/utils";

const ThemeSwitch = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const savedTheme = getStorageItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    setStorageItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <div className="hidden lg:block absolute left-6 bottom-6 z-50">
      <button
        onClick={toggleTheme}
        type="button"
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        className="relative w-14 h-7 rounded-full cursor-pointer bg-gray-200 dark:bg-gray-700 transition-colors duration-300 ease-in-out"
      >
        <div
          className={cn(
            "absolute top-1 w-4 h-4 transition-all duration-300 ease-in-out",
            theme === "dark" ? "left-7" : "left-2"
          )}
        >
          {theme === "dark" ? (
            <MoonIcon width={20} height={20} className="text-white" />
          ) : (
            <SunIcon width={20} height={20} className="text-black" />
          )}
        </div>
      </button>
    </div>
  );
};

export default ThemeSwitch;
