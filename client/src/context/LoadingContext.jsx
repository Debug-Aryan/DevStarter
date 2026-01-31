import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [loadingCount, setLoadingCount] = useState(0);
  const [transientLoading, setTransientLoading] = useState(false);

  const transientTimerRef = useRef(null);
  const delayedActionTimerRef = useRef(null);
  const skipNextClickRef = useRef(new WeakSet());

  const MIN_LOADER_MS = 1000;

  const startTransientLoading = (durationMs = MIN_LOADER_MS) => {
    setTransientLoading(true);

    if (transientTimerRef.current) {
      clearTimeout(transientTimerRef.current);
    }

    transientTimerRef.current = setTimeout(() => {
      setTransientLoading(false);
      transientTimerRef.current = null;
    }, durationMs);
  };

  useEffect(() => {
    const requestId = axios.interceptors.request.use(
      (config) => {
        setLoadingCount((count) => count + 1);
        return config;
      },
      (error) => {
        setLoadingCount((count) => Math.max(0, count - 1));
        return Promise.reject(error);
      }
    );

    const responseId = axios.interceptors.response.use(
      (response) => {
        setLoadingCount((count) => Math.max(0, count - 1));
        return response;
      },
      (error) => {
        setLoadingCount((count) => Math.max(0, count - 1));
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestId);
      axios.interceptors.response.eject(responseId);
    };
  }, []);

  useEffect(() => {
    const onClickCapture = (event) => {
      // Left-click only
      if (typeof event.button === "number" && event.button !== 0) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const clickable = target.closest("button, [role='button'], a");
      if (!clickable) return;

      // Let the delayed click through without delaying again.
      if (skipNextClickRef.current.has(clickable)) {
        skipNextClickRef.current.delete(clickable);
        return;
      }

      const isDisabled =
        clickable.hasAttribute("disabled") ||
        clickable.getAttribute("aria-disabled") === "true";

      const optedOut =
        clickable.getAttribute("data-no-loader") === "true" ||
        clickable.closest("[data-no-loader='true']") ||
        clickable.getAttribute("data-no-delay") === "true" ||
        clickable.closest("[data-no-delay='true']");

      if (isDisabled || optedOut) return;

      // Block the current click so the page/action doesn't change behind the loader.
      event.preventDefault();
      event.stopPropagation();
      if (typeof event.stopImmediatePropagation === "function") {
        event.stopImmediatePropagation();
      }

      const bufferMs = 300;
      startTransientLoading(MIN_LOADER_MS + bufferMs);

      if (delayedActionTimerRef.current) {
        clearTimeout(delayedActionTimerRef.current);
      }

      delayedActionTimerRef.current = setTimeout(() => {
        delayedActionTimerRef.current = null;

        if (!document.contains(clickable)) return;
        skipNextClickRef.current.add(clickable);
        clickable.click();
      }, MIN_LOADER_MS);
    };

    document.addEventListener("click", onClickCapture, true);

    return () => {
      document.removeEventListener("click", onClickCapture, true);

      if (delayedActionTimerRef.current) {
        clearTimeout(delayedActionTimerRef.current);
        delayedActionTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (transientTimerRef.current) {
        clearTimeout(transientTimerRef.current);
      }
    };
  }, []);

  const value = useMemo(() => {
    return {
      isLoading: loadingCount > 0 || transientLoading,
      loadingCount,
      startTransientLoading,
      setTransientLoading,
    };
  }, [loadingCount, transientLoading]);

  return <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>;
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return ctx;
}
