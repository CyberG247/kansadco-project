import { useEffect, useState } from "react";
import logoTransparent from "@/assets/logo-transparent.png";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setFadeOut(true), 200);
          setTimeout(() => onComplete(), 800);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-all duration-500 ${
        fadeOut ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse animation-delay-400" />
      </div>

      {/* Logo with animation */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="animate-scale-in">
          <img
            src={logoTransparent}
            alt="KANSADCO Logo"
            className="h-32 md:h-40 w-auto object-contain animate-pulse"
          />
        </div>

        {/* Welcome text */}
        <div className="mt-8 text-center animate-fade-up animation-delay-200">
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-2">
            Welcome to
          </p>
          <h1 className="text-xl md:text-2xl font-display font-semibold text-foreground tracking-wide">
            KANSADCO ENGINEERING NIG. LTD.
          </h1>
        </div>

        {/* Progress bar */}
        <div className="mt-10 w-64 animate-fade-up animation-delay-400">
          <div className="h-1 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-100 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-center text-xs text-muted-foreground mt-3 tracking-widest">
            {progress}%
          </p>
        </div>

        {/* Decorative elements */}
        <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-48 h-48 border border-accent/20 rounded-full animate-ping opacity-20" />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
