"use client";

import { useEffect } from "react";

/**
 * Handles the Android hardware back button in the Capacitor APK.
 * Navigates back in web history instead of closing the app.
 * Only exits the app when there's no history to go back to.
 */
export default function BackButtonHandler() {
  useEffect(() => {
    const cap = (window as any).Capacitor;
    if (!cap?.isNative) return;

    let removeListener: (() => void) | null = null;

    (async () => {
      try {
        const { App } = await import("@capacitor/app");
        const handle = await App.addListener("backButton", ({ canGoBack }: { canGoBack: boolean }) => {
          if (canGoBack) {
            window.history.back();
          } else {
            App.exitApp();
          }
        });
        removeListener = () => { handle.remove(); };
      } catch {
        // Capacitor App plugin not available — nothing to do
      }
    })();

    return () => {
      removeListener?.();
    };
  }, []);

  return null;
}
