import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Services } from "./services";
import { Service } from "@/services/api.types";

const mockServices: Service[] = [
  {
    id: 1,
    title: "Full-Stack Development",
    description: "End-to-end custom web applications.",
    icon_url: "",
    price_range: "Contact for quote",
    order: 1,
    is_active: true,
  },
  {
    id: 2,
    title: "Technical Consulting",
    description: "System architecture and code reviews.",
    icon_url: "",
    price_range: "$150/hr",
    order: 2,
    is_active: true,
  },
];

describe("Services Component", () => {
  it("renders service items with descriptions, pricing, and enquire action", () => {
    render(<Services items={mockServices} profileEmail="john@example.com" />);

    expect(screen.getByText("What I Offer")).toBeInTheDocument();
    expect(screen.getByText("Full-Stack Development")).toBeInTheDocument();
    expect(screen.getByText("Technical Consulting")).toBeInTheDocument();
    expect(screen.getByText("Contact for quote")).toBeInTheDocument();
    expect(screen.getByText("$150/hr")).toBeInTheDocument();

    const enquireButton = screen.getByLabelText("Enquire about Full-Stack Development");
    expect(enquireButton).toHaveAttribute(
      "href",
      "mailto:john@example.com?subject=Enquiry regarding: Full-Stack%20Development",
    );
  });

  it("returns null when items list is empty", () => {
    const { container } = render(<Services items={[]} profileEmail="john@example.com" />);
    expect(container.firstChild).toBeNull();
  });
});
