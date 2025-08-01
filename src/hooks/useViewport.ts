import { useState, useEffect } from "react";
import { useDebounce } from "./useDebounce";

function useViewportWidth(delay = 500) {
  const [width, setWidth] = useState(window.innerWidth);
  const debounce = useDebounce(() => setWidth(window.innerWidth), delay);

  useEffect(() => {
    window.addEventListener("resize", debounce);

    return () => {
      window.removeEventListener("resize", debounce);
    };
  }, [debounce]);

  return width;
}

const useViewportHeight = (delay = 500) => {
  const [documentHeight, setDocumentHeight] = useState(window.innerHeight);
  const debounce = useDebounce(() => setDocumentHeight(window.innerHeight), delay);

  useEffect(() => {
    window.addEventListener("resize", debounce);

    return () => {
      window.removeEventListener("resize", debounce);
    };
  }, [debounce]);

  return documentHeight;
};

export { useViewportWidth, useViewportHeight };
