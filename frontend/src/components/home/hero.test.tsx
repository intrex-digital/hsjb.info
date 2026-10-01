import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Hero } from "./hero";
import { Profile } from "@/services/api.types";

const mockProfile: Profile = {
  name: "John Doe",
  headline: "Full Stack Developer & Technical Trainer",
  short_bio: "Building robust systems and mentoring teams.",
  hero_image_url: "https://example.com/avatar.jpg",
  about_text: "About text",
  about_image_url: "https://example.com/about.jpg",
  email: "john@example.com",
  github_url: "https://github.com/johndoe",
  linkedin_url: "https://linkedin.com/in/johndoe",
  twitter_url: "https://twitter.com/johndoe",
  resume_url: "https://example.com/resume.pdf",
  updated_at: "2026-10-01T00:00:00Z",
};

describe("Hero Component", () => {
  it("renders profile name, headline, bio, and hero image", () => {
    render(<Hero profile={mockProfile} />);

    expect(screen.getByText("Hi, I'm John Doe")).toBeInTheDocument();
    expect(screen.getByText("Full Stack Developer & Technical Trainer")).toBeInTheDocument();
    expect(screen.getByText("Building robust systems and mentoring teams.")).toBeInTheDocument();
    expect(screen.getByAltText("John Doe")).toHaveAttribute(
      "src",
      "https://example.com/avatar.jpg",
    );
  });

  it("renders CTA button and external profile links", () => {
    render(<Hero profile={mockProfile} />);

    const ctaButton = screen.getByRole("link", { name: /View My Work/i });
    expect(ctaButton).toHaveAttribute("href", "#resume");

    expect(screen.getByLabelText("GitHub")).toHaveAttribute("href", "https://github.com/johndoe");
    expect(screen.getByLabelText("LinkedIn")).toHaveAttribute(
      "href",
      "https://linkedin.com/in/johndoe",
    );
    expect(screen.getByLabelText("Twitter")).toHaveAttribute("href", "https://twitter.com/johndoe");
    expect(screen.getByLabelText("Resume")).toHaveAttribute(
      "href",
      "https://example.com/resume.pdf",
    );
  });
});
