import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router";
import gsap from "gsap";
import type { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsVisible(false);

    if (!containerRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsVisible(true);
      },
      defaults: {
        duration: 0.5,
        ease: "power2.inOut",
      }
    });

    tl.to(containerRef.current, {
      opacity: 0,
      y: 20,
      scale: 0.98,
    }).set({}, {
      duration: 0.01,
      onStart: () => setIsVisible(false),
    }).to(containerRef.current, {
      opacity: 1,
      y: 0,
      scale: 1,
    });

    return () => {
      tl.kill();
    };
  }, [location.pathname]);

  return (
    <div
      ref={containerRef}
      key={location.pathname}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.98)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        width: "100%",
        minHeight: "100vh",
      }}
    >
      {children}
    </div>
  );
}