import { useEffect, useState } from "react";

/*  Note that output returned false initially,
    then return query result after the screen size is changed
*/
type UseMediaQueryOptions = {
  defaultValue?: boolean;
  initializeWithValue?: boolean;
};

const IS_SERVER = typeof window === "undefined";

const useMediaQuery = (
  query: string,
  {
    defaultValue = false,
    initializeWithValue = true,
  }: UseMediaQueryOptions = {}
): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (initializeWithValue) {
      if (IS_SERVER) {
        setMatches(defaultValue);
        return;
      }
      setMatches(window.matchMedia(query).matches);
    }
  }, [initializeWithValue, defaultValue, query]);

  useEffect(() => {
    const matchMedia = window.matchMedia(query);

    // Triggered at the first client-side load and if query changes
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    matchMedia.addEventListener("change", handleChange);
    return () => {
      matchMedia.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
};
export { useMediaQuery };
// Copy from https://usehooks-ts.com/react-hook/use-media-query
