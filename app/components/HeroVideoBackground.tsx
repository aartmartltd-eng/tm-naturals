"use client";

import { useEffect, useRef, useState } from "react";

/** Local hero video: public/videos/tm-naturals-hero.mp4 (1920×1080, 16:9 landscape) */
export const HERO_VIDEO_SRC = "/videos/tm-naturals-hero.mp4";

function HeroBrandedFallback() {
  return (
    <div className="absolute inset-0 bg-tm-black">
      <div className="absolute inset-0 bg-gradient-to-br from-tm-green/10 via-transparent to-tm-orange/6" />
    </div>
  );
}

export default function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoFailed) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      if (mediaQuery.matches) {
        video.pause();
        return;
      }

      video.play().catch(() => {
        setVideoFailed(true);
      });
    };

    syncPlayback();
    mediaQuery.addEventListener("change", syncPlayback);
    return () => mediaQuery.removeEventListener("change", syncPlayback);
  }, [videoFailed]);

  if (videoFailed) {
    return <HeroBrandedFallback />;
  }

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover object-[center_40%] lg:object-center"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      onError={() => setVideoFailed(true)}
      aria-hidden="true"
    >
      <source src={HERO_VIDEO_SRC} type="video/mp4" />
    </video>
  );
}
