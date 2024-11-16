"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "../icons";

const ThemeSwitch = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full cursor-pointer bg-gray-200 dark:bg-gray-700 transition-colors duration-300 ease-in-out"
    >
      <div
        className={`absolute top-1 ${theme === "dark" ? "left-7" : "left-2"
          } w-4 h-4 transition-all duration-300 ease-in-out`}
      >
        {theme === "dark" ? (
          <MoonIcon width={20} height={20} className="text-white" />
        ) : (
          <SunIcon width={20} height={20} className="text-black" />
        )}
      </div>
    </div>
  );
};

export default ThemeSwitch;
