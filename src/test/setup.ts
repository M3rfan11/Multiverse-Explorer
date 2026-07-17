import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import { server } from "./msw";

// RTL's automatic cleanup needs vitest globals; we don't use them,
// so unmount rendered trees between tests explicitly.
afterEach(() => cleanup());

// jsdom lacks matchMedia (framer-motion's useReducedMotion needs it)
// and throws on scrollTo.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false,
  }),
});
Object.defineProperty(window, "scrollTo", {
  writable: true,
  value: () => undefined,
});

// Fail loudly if a test hits an endpoint without a handler —
// no test should ever reach the real network.
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
