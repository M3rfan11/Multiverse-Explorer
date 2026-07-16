import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { CHARACTERS_URL, server } from "@/test/msw";
import { useCharacters } from "./use-characters";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useCharacters", () => {
  it("returns characters on success", async () => {
    const { result } = renderHook(() => useCharacters({ page: 1 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.results).toHaveLength(1);
    expect(result.current.data?.results[0]?.name).toBe("Character page 1");
    expect(result.current.data?.info.pages).toBe(2);
  });

  it("treats a filter miss (API 404) as an empty result, not an error", async () => {
    const { result } = renderHook(
      () => useCharacters({ name: "nothing", page: 1 }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.isError).toBe(false);
    expect(result.current.data?.results).toHaveLength(0);
    expect(result.current.data?.info.count).toBe(0);
  });

  it("surfaces server failures as errors", async () => {
    server.use(
      http.get(CHARACTERS_URL, () =>
        HttpResponse.json({ error: "boom" }, { status: 500 }),
      ),
    );

    const { result } = renderHook(() => useCharacters({ page: 1 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("keeps previous page data visible while the next page loads", async () => {
    const wrapper = createWrapper();
    const { result, rerender } = renderHook(
      ({ page }: { page: number }) => useCharacters({ page }),
      { wrapper, initialProps: { page: 1 } },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.results[0]?.name).toBe("Character page 1");

    rerender({ page: 2 });

    // Immediately after the page change, the old data is still there.
    expect(result.current.data?.results[0]?.name).toBe("Character page 1");
    expect(result.current.isPlaceholderData).toBe(true);

    await waitFor(() => expect(result.current.isPlaceholderData).toBe(false));
    expect(result.current.data?.results[0]?.name).toBe("Character page 2");
  });
});
