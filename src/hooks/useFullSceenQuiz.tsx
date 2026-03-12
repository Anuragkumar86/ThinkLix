"use client";

import { useEffect, useState } from "react";

export function useFullscreenQuiz(
  quizSubmitted: boolean,
  onForceSubmit: () => void
) {
  const [fullscreenExited, setFullscreenExited] = useState(false);
  const [violationCount, setViolationCount] = useState(0);

  useEffect(() => {
    
    const enterFullscreen = async () => {
      if (!document.fullscreenElement) {
        try {
          await document.documentElement.requestFullscreen();
        } catch (err) {
          console.warn("Failed to enter fullscreen:", err);
        }
      }
    };
    enterFullscreen();

    
    const handleFullscreenChange = () => {
      const isFullscreen = !!document.fullscreenElement;
      if (!isFullscreen && !quizSubmitted) {
        setFullscreenExited(true);
        setViolationCount((count) => count + 1);
      } else {
        setFullscreenExited(false);
      }
    };

   
    const handleVisibilityChange = () => {
      if (document.hidden && !quizSubmitted) {
        setViolationCount((count) => Math.min(count + 1, 3));
      }
    };

    
    const handlePopState = () => {
      if (!quizSubmitted) {
        onForceSubmit();
      }
    };

    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!quizSubmitted) {
        e.preventDefault();
        e.returnValue = "Are you sure you want to leave?";
      }
    };


    // Attach listeners
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [quizSubmitted, onForceSubmit]);


  useEffect(() => {
    if (violationCount >= 3 && !quizSubmitted) {
      onForceSubmit();
    }
  }, [violationCount, quizSubmitted, onForceSubmit]);

  return { fullscreenExited, setFullscreenExited, violationCount };
}
