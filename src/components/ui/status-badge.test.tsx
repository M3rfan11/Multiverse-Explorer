import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "./status-badge";

describe("StatusBadge", () => {
  it("renders Alive with the green treatment", () => {
    render(<StatusBadge status="Alive" />);
    const badge = screen.getByText("Alive");
    expect(badge).toHaveClass("text-emerald-300");
  });

  it("renders Dead with the red treatment", () => {
    render(<StatusBadge status="Dead" />);
    expect(screen.getByText("Dead")).toHaveClass("text-red-300");
  });

  it("renders unknown with the gray treatment", () => {
    render(<StatusBadge status="unknown" />);
    expect(screen.getByText("unknown")).toHaveClass("text-slate-300");
  });
});
