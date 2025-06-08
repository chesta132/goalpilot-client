import { useState, useEffect, useRef } from "react";

function useViewportWidth(delay = 500) {
  const [width, setWidth] = useState(window.innerWidth);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      // Clear previous timeout
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Set new timeout
      timerRef.current = setTimeout(() => {
        setWidth(window.innerWidth);
      }, delay);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [delay]);

  return width;
}

const useViewportHeight = () => {
  const [documentHeight, setDocumentHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      // Menggunakan scrollHeight untuk mendapatkan total tinggi dokumen
      const height = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      );
      setDocumentHeight(height);
    };

    // Update height saat pertama kali mount
    updateHeight();

    // Observer untuk mendeteksi perubahan ukuran konten
    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    // Observer untuk mendeteksi perubahan DOM
    const mutationObserver = new MutationObserver(() => {
      updateHeight();
    });

    // Observe perubahan pada body dan html
    resizeObserver.observe(document.body);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    // Event listener untuk resize window (optional, untuk safety)
    window.addEventListener("resize", updateHeight);

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return documentHeight;
};

export { useViewportWidth, useViewportHeight };
