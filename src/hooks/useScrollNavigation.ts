import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Custom hook for managing navigation visibility based on scroll direction
 * Hides navigation when scrolling down and shows it when scrolling up
 *
 * @returns {Object} Object containing navRef and timeline status
 * @returns {React.RefObject} navRef - Reference to attach to the navigation element
 * @returns {boolean} timelineStatus - Current animation state (true when nav is hidden)
 */
const useScrollNavigation = () => {
  // Reference to track if navigation is currently being animated/hidden
  const isScrollingRef = useRef(false);

  // Reference to store the last recorded scroll position
  const lastScrollYRef = useRef(0);

  // Reference for the navigation element that will be animated
  const navRef = useRef(null);

  // State to track timeline status - true when nav is hidden, false when visible
  const [timelineStatus, setTimelineStatus] = useState(false);

  useEffect(() => {
    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Initialize with current window scroll position
    lastScrollYRef.current = window.scrollY;

    /**
     * Handles scroll events and manages navigation visibility
     * Shows/hides navigation based on scroll direction with 50px threshold
     */
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // If scrolling down more than 50px from previous scroll position
      if (currentScrollY > lastScrollYRef.current + 50) {
        // Only animate if navigation is not already being hidden
        if (!isScrollingRef.current && navRef.current) {
          isScrollingRef.current = true;

          // Animation to hide navigation by moving it up
          gsap.to(navRef.current, {
            y: -100, // Move 100px up (hidden)
            duration: 0.5,
            ease: "power2.inOut",
          });
        }
        // Update last scroll position
        lastScrollYRef.current = currentScrollY;
        // Set timeline status to indicate nav is hidden
        setTimelineStatus(true);
      }
      // If scrolling up more than 50px from previous scroll position
      else if (currentScrollY < lastScrollYRef.current - 50) {
        // Only animate if navigation is currently hidden
        if (isScrollingRef.current && navRef.current) {
          isScrollingRef.current = false;

          // Animation to show navigation by moving it back to original position
          gsap.to(navRef.current, {
            y: 0, // Move back to original position (visible)
            duration: 0.5,
            ease: "power2.inOut",
          });
        }
        // Update last scroll position
        lastScrollYRef.current = currentScrollY;
        // Set timeline status to indicate nav is visible
        setTimelineStatus(false);
      }
    };

    // Attach scroll event listener to window
    window.addEventListener("scroll", handleScroll);

    // Cleanup function to remove event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  // Return the navigation reference and current timeline status
  return {
    navRef,
    timelineStatus,
  };
};

export default useScrollNavigation;
