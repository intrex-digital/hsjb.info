import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Contact } from "./contact";
import * as contactService from "@/services/contact";
import { Profile, ApiError } from "@/services";

vi.mock("@/services/contact", () => ({
  sendContactMessage: vi.fn(),
}));

const mockProfile: Profile = {
  name: "John Doe",
  headline: "Full Stack Architect",
  short_bio: "Building scalable systems.",
  hero_image_url: "https://example.com/hero.jpg",
  about_text: "About me content.",
  about_image_url: "https://example.com/about.jpg",
  email: "john@example.com",
  github_url: "https://github.com/johndoe",
  linkedin_url: "https://linkedin.com/in/johndoe",
  twitter_url: "https://twitter.com/johndoe",
  resume_url: "https://example.com/resume.pdf",
  updated_at: "2026-10-01T00:00:00Z",
};

describe("Contact Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders contact information and form inputs correctly", () => {
    render(<Contact profile={mockProfile} />);

    expect(screen.getByText("Let's Work Together")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByLabelText(/Your Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send Message/i })).toBeInTheDocument();
  });

  it("shows validation errors when submitting an empty form", async () => {
    render(<Contact profile={mockProfile} />);

    const submitButton = screen.getByRole("button", { name: /Send Message/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Please enter your name.")).toBeInTheDocument();
      expect(screen.getByText("Please enter your email address.")).toBeInTheDocument();
      expect(screen.getByText("Please enter a subject.")).toBeInTheDocument();
      expect(screen.getByText("Please enter your message.")).toBeInTheDocument();
    });

    expect(contactService.sendContactMessage).not.toHaveBeenCalled();
  });

  it("shows error for invalid email format", async () => {
    const user = userEvent.setup();
    render(<Contact profile={mockProfile} />);

    const emailInput = screen.getByLabelText(/Email Address/i);
    await user.type(emailInput, "not-an-email");
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText("Please enter a valid email address.")).toBeInTheDocument();
    });
  });

  it("successfully submits the form and displays confirmation message", async () => {
    const user = userEvent.setup();
    vi.mocked(contactService.sendContactMessage).mockResolvedValueOnce({
      id: 1,
      name: "Alice Smith",
      email: "alice@example.com",
      subject: "Project Inquiry",
      message: "I would like to discuss a project with you.",
      created_at: "2026-10-01T12:00:00Z",
    });

    render(<Contact profile={mockProfile} />);

    await user.type(screen.getByLabelText(/Your Name/i), "Alice Smith");
    await user.type(screen.getByLabelText(/Email Address/i), "alice@example.com");
    await user.type(screen.getByLabelText(/Subject/i), "Project Inquiry");
    await user.type(
      screen.getByLabelText(/Message/i),
      "I would like to discuss a project with you.",
    );

    const submitButton = screen.getByRole("button", { name: /Send Message/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(contactService.sendContactMessage).toHaveBeenCalledWith({
        name: "Alice Smith",
        email: "alice@example.com",
        subject: "Project Inquiry",
        message: "I would like to discuss a project with you.",
      });
      expect(screen.getByText("Message Sent!")).toBeInTheDocument();
    });

    // Test sending another message
    const sendAnotherBtn = screen.getByRole("button", { name: /Send Another Message/i });
    fireEvent.click(sendAnotherBtn);

    await waitFor(() => {
      expect(screen.getByLabelText(/Your Name/i)).toBeInTheDocument();
    });
  });

  it("handles server errors and retains user input in the form", async () => {
    const user = userEvent.setup();
    vi.mocked(contactService.sendContactMessage).mockRejectedValueOnce(
      new ApiError({
        status: "error",
        code: "rate_limited",
        message: "Request was throttled. Expected available in 86400 seconds.",
        detail: null,
      }),
    );

    render(<Contact profile={mockProfile} />);

    await user.type(screen.getByLabelText(/Your Name/i), "Alice Smith");
    await user.type(screen.getByLabelText(/Email Address/i), "alice@example.com");
    await user.type(screen.getByLabelText(/Subject/i), "Project Inquiry");
    await user.type(
      screen.getByLabelText(/Message/i),
      "I would like to discuss a project with you.",
    );

    const submitButton = screen.getByRole("button", { name: /Send Message/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(contactService.sendContactMessage).toHaveBeenCalled();
    });

    // Form inputs should still be preserved
    expect(screen.getByLabelText(/Your Name/i)).toHaveValue("Alice Smith");
    expect(screen.getByLabelText(/Email Address/i)).toHaveValue("alice@example.com");
    expect(screen.getByLabelText(/Subject/i)).toHaveValue("Project Inquiry");
    expect(screen.getByLabelText(/Message/i)).toHaveValue(
      "I would like to discuss a project with you.",
    );
  });
});
