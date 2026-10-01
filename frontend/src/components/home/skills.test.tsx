import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Skills } from "./skills";
import { SkillCategory } from "@/services/api.types";

const mockCategories: SkillCategory[] = [
  {
    id: 1,
    name: "Frontend",
    order: 1,
    skills: [
      { id: 1, name: "React", proficiency: 95, order: 1, category: 1, icon_url: "" },
      { id: 2, name: "TypeScript", proficiency: 90, order: 2, category: 1, icon_url: "" },
    ],
  },
  {
    id: 2,
    name: "Backend",
    order: 2,
    skills: [{ id: 3, name: "Django", proficiency: 92, order: 1, category: 2, icon_url: "" }],
  },
];

describe("Skills Component", () => {
  it("renders skill categories and skills with proficiency", () => {
    render(<Skills categories={mockCategories} />);

    expect(screen.getByText("Technical Expertise")).toBeInTheDocument();
    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Django")).toBeInTheDocument();
    expect(screen.getByText("95%")).toBeInTheDocument();
    expect(screen.getByText("90%")).toBeInTheDocument();
  });

  it("returns null when categories list is empty", () => {
    const { container } = render(<Skills categories={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
