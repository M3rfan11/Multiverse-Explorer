import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  replace: vi.fn(),
  push: vi.fn(),
  search: { value: "" },
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: mocks.replace, push: mocks.push }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(mocks.search.value),
}));

import { CharacterDetail } from "./character-detail";
import { Dashboard } from "./dashboard";

function renderWithQuery(ui: ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

describe("dashboard → detail integration", () => {
  beforeEach(() => {
    mocks.replace.mockClear();
    mocks.push.mockClear();
    mocks.search.value = "";
  });

  it("renders characters and result count from the (mocked) API", async () => {
    renderWithQuery(<Dashboard />);

    expect(await screen.findByText("Character page 1")).toBeInTheDocument();
    expect(screen.getByText(/2 characters found/)).toBeInTheDocument();
  });

  it("flows a preset URL filter through fetch to the empty state", async () => {
    // ?name=nothing makes the mock API answer 404, mirroring the real one.
    mocks.search.value = "name=nothing";
    renderWithQuery(<Dashboard />);

    expect(
      await screen.findByText("No characters found in this dimension"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Clear filters" }),
    ).toBeInTheDocument();
  });

  it("debounces typed search into a URL replace", async () => {
    renderWithQuery(<Dashboard />);
    await screen.findByText("Character page 1");

    fireEvent.change(screen.getByLabelText("Search characters by name"), {
      target: { value: "rick" },
    });

    await waitFor(() =>
      expect(mocks.replace).toHaveBeenCalledWith("/?name=rick", {
        scroll: false,
      }),
    );
  });

  it("pushes history when changing pages", async () => {
    renderWithQuery(<Dashboard />);
    await screen.findByText("Character page 1");

    fireEvent.click(screen.getByRole("button", { name: "Next →" }));

    expect(mocks.push).toHaveBeenCalledWith("/?page=2", { scroll: false });
  });

  it("renders the selected character's detail with episodes (GraphQL)", async () => {
    renderWithQuery(<CharacterDetail id={1} />);

    expect(
      await screen.findByRole("heading", { name: "Rick Sanchez" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Earth (C-137)")).toBeInTheDocument();
    expect(screen.getByText(/Episodes/)).toBeInTheDocument();
    expect(screen.getByText("S01E01")).toBeInTheDocument();
    expect(screen.getByText("Pilot")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /all characters/i }),
    ).toBeInTheDocument();
  });
});
