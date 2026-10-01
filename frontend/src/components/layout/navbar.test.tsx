import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Navbar, NAV_LINKS } from "./navbar";

describe("Navbar Component with Scroll-Spy", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollY = 0;
  });

  it("renders logo and all navigation links", () => {
    render(<Navbar />);

    expect(screen.getByText("HSJB")).toBeInTheDocument();
    NAV_LINKS.forEach((link) => {
      expect(screen.getByRole("link", { name: link.label })).toBeInTheDocument();
    });
  });

  it("toggles mobile menu when clicking the mobile menu button", () => {
    render(<Navbar />);

    const toggleButton = screen.getByLabelText(/Open menu/i);
    expect(toggleButton).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(toggleButton);

    expect(screen.getByLabelText(/Close menu/i)).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("navigation", { name: "Mobile Navigation" })).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/Close menu/i));
    expect(screen.queryByRole("navigation", { name: "Mobile Navigation" })).not.toBeInTheDocument();
  });

  it("updates active section on scroll", () => {
    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: 3000,
      configurable: true,
    });
    Object.defineProperty(window, "innerHeight", { value: 768, configurable: true });

    // Mock section elements on document
    const aboutSection = document.createElement("section");
    aboutSection.id = "about";
    Object.defineProperty(aboutSection, "offsetTop", { value: 200, configurable: true });

    const skillsSection = document.createElement("section");
    skillsSection.id = "skills";
    Object.defineProperty(skillsSection, "offsetTop", { value: 800, configurable: true });

    document.body.appendChild(aboutSection);
    document.body.appendChild(skillsSection);

    render(<Navbar />);

    // Simulate scrolling past about section
    act(() => {
      Object.defineProperty(window, "scrollY", { value: 300, writable: true, configurable: true });
      window.dispatchEvent(new Event("scroll"));
    });

    const aboutLink = screen.getByRole("link", { name: "About" });
    expect(aboutLink).toHaveAttribute("aria-current", "page");

    // Simulate scrolling to skills section
    act(() => {
      Object.defineProperty(window, "scrollY", { value: 900, writable: true, configurable: true });
      window.dispatchEvent(new Event("scroll"));
    });

    const skillsLink = screen.getByRole("link", { name: "Skills" });
    expect(skillsLink).toHaveAttribute("aria-current", "page");

    // Cleanup
    document.body.removeChild(aboutSection);
    document.body.removeChild(skillsSection);
  });

  it("smoothly scrolls to section on link click", () => {
    const contactSection = document.createElement("section");
    contactSection.id = "contact";
    const scrollIntoViewMock = vi.fn();
    contactSection.scrollIntoView = scrollIntoViewMock;
    document.body.appendChild(contactSection);

    render(<Navbar />);

    const contactLink = screen.getByRole("link", { name: "Contact" });
    fireEvent.click(contactLink);

    expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: "smooth" });

    document.body.removeChild(contactSection);
  });
});
