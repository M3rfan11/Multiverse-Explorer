import { act, renderHook } from "@testing-library/react";
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

import {
  toCharacterFilters,
  useDashboardFilters,
} from "./use-dashboard-filters";

describe("useDashboardFilters", () => {
  beforeEach(() => {
    mocks.replace.mockClear();
    mocks.push.mockClear();
    mocks.search.value = "";
  });

  it("parses valid params from the URL", () => {
    mocks.search.value = "name=rick&status=alive&species=Human&page=2";
    const { result } = renderHook(() => useDashboardFilters());

    expect(result.current.filters).toEqual({
      name: "rick",
      status: "Alive",
      species: "Human",
      page: 2,
    });
  });

  it("sanitizes garbage params to defaults", () => {
    mocks.search.value = "status=banana&species=Dragon&page=-5";
    const { result } = renderHook(() => useDashboardFilters());

    expect(result.current.filters).toEqual({
      name: "",
      status: undefined,
      species: "",
      page: 1,
    });
  });

  it("resets to page 1 and uses replace when a filter changes", () => {
    mocks.search.value = "page=5";
    const { result } = renderHook(() => useDashboardFilters());

    act(() => result.current.setFilters({ name: "rick" }));

    expect(mocks.replace).toHaveBeenCalledWith("/?name=rick", {
      scroll: false,
    });
    expect(mocks.push).not.toHaveBeenCalled();
  });

  it("uses push for page changes so the back button steps through pages", () => {
    mocks.search.value = "name=rick";
    const { result } = renderHook(() => useDashboardFilters());

    act(() => result.current.setPage(3));

    expect(mocks.push).toHaveBeenCalledWith("/?name=rick&page=3", {
      scroll: false,
    });
  });
});

describe("toCharacterFilters", () => {
  it("maps empty strings to undefined so they never reach the query string", () => {
    expect(
      toCharacterFilters({ name: "", status: undefined, species: "", page: 1 }),
    ).toEqual({ name: undefined, status: undefined, species: undefined, page: 1 });
  });
});
