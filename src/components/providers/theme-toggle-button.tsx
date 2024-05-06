"use client";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";

import { useEffect, useState } from "react";
import { Toggle } from "../ui/toggle";
const ThemeToggleButton = () => {
  const { setTheme, theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Toggle
      onPressedChange={() => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
      }}
    >
      {theme === "dark" ? <MoonIcon className="h-5 w-5" /> : null}
      {theme === "light" ? <SunIcon className="h-5 w-5" /> : null}
      {theme === "system" ? <SunIcon className="h-5 w-5" /> : null}
    </Toggle>
  );
};

export default ThemeToggleButton;
