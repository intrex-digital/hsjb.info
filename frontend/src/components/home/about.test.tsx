import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { About } from "./about";
import { Profile } from "@/services/api.types";

const mockProfile: Profile = {
  name: "John Doe",
  headline: "Full Stack Developer",
  short_bio: "Short bio",
  hero_image_url: "",
  about_text: "First paragraph of about me.\n\nSecond paragraph with more details.",
  about_image_url: "https://example.com/about.jpg",
  email: "john@example.com",
  github_url: "",
  linkedin_url: "",
  twitter_url: "",
  resume_url: "",
  updated_at: "2026-10-01T00:00:00Z",
};

describe("About Component", () => {
  it("renders about paragraphs and image correctly", () => {
    render(<About profile={mockProfile} />);

    expect(screen.getByText("Get to know me")).toBeInTheDocument();
    expect(screen.getByText("First paragraph of about me.")).toBeInTheDocument();
    expect(screen.getByText("Second paragraph with more details.")).toBeInTheDocument();
    expect(screen.getByAltText("About me")).toHaveAttribute("src", "https://example.com/about.jpg");
  });

  it("returns null when about_text is empty", () => {
    const { container } = render(<About profile={{ ...mockProfile, about_text: "" }} />);
    expect(container.firstChild).toBeNull();
  });
});
