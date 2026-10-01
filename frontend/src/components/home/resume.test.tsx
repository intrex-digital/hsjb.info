import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Resume, ResumeData } from "./resume";

const mockResumeData: ResumeData = {
  education: [
    {
      id: 1,
      degree: "B.Sc. Computer Science",
      institution: "Tech University",
      location: "San Francisco",
      start_date: "2010-09-01",
      end_date: "2014-05-01",
      is_current: false,
      description: "Focused on algorithms and systems.",
      order: 1,
    },
  ],
  training: [
    {
      id: 1,
      title: "Advanced Systems Design",
      institution: "Cloud Academy",
      location: "Online",
      start_date: "2022-01-01",
      end_date: "2022-03-01",
      is_current: false,
      description: "Distributed architectures.",
      order: 1,
    },
  ],
  certifications: [
    {
      id: 1,
      name: "AWS Certified Solutions Architect",
      issuer: "Amazon Web Services",
      issue_date: "2023-08-01",
      expiration_date: null,
      credential_id: "AWS-12345",
      credential_url: "https://aws.amazon.com/verify",
      order: 1,
    },
  ],
  industrialProjects: [
    {
      id: 1,
      title: "E-Commerce Platform",
      role: "Lead Backend Engineer",
      company: "Globex Corp",
      start_date: "2021-02-01",
      end_date: "2023-11-01",
      is_current: false,
      description: "Decoupled microservices architecture with high throughput.",
      link: "https://globex.com",
      image_url: "https://example.com/project.jpg",
      technologies: "Django, Postgres, Redis",
      order: 1,
    },
  ],
  trainingProjects: [
    {
      id: 1,
      title: "React & TypeScript Bootcamp",
      role: "Lead Instructor",
      institution: "Dev Academy",
      start_date: "2023-01-01",
      end_date: null,
      is_current: true,
      description: "Intensive 2-week workshop for enterprise developers.",
      link: "https://devacademy.com",
      technologies: "React, TypeScript",
      order: 1,
    },
  ],
};

describe("Resume Component", () => {
  it("renders sub-section tabs and default Education view", () => {
    render(<Resume data={mockResumeData} />);

    expect(screen.getByText("My Background")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Education" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Professional Training" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Certifications" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Industrial Projects" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Training Projects" })).toBeInTheDocument();

    expect(screen.getByText("B.Sc. Computer Science")).toBeInTheDocument();
    expect(screen.getByText("Tech University")).toBeInTheDocument();
  });

  it("switches to Professional Training when tab is clicked", async () => {
    render(<Resume data={mockResumeData} />);

    fireEvent.click(screen.getByRole("button", { name: "Professional Training" }));

    await waitFor(() => {
      expect(screen.getByText("Advanced Systems Design")).toBeInTheDocument();
      expect(screen.getByText("Cloud Academy")).toBeInTheDocument();
    });
  });

  it("switches to Certifications when tab is clicked", async () => {
    render(<Resume data={mockResumeData} />);

    fireEvent.click(screen.getByRole("button", { name: "Certifications" }));

    await waitFor(() => {
      expect(screen.getByText("AWS Certified Solutions Architect")).toBeInTheDocument();
      expect(screen.getByText("Amazon Web Services")).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Verify Credential/i })).toHaveAttribute(
        "href",
        "https://aws.amazon.com/verify",
      );
    });
  });

  it("switches to Industrial Projects and opens detail modal on click", async () => {
    render(<Resume data={mockResumeData} />);

    fireEvent.click(screen.getByRole("button", { name: "Industrial Projects" }));

    await waitFor(() => {
      expect(screen.getByText("E-Commerce Platform")).toBeInTheDocument();
      expect(screen.getByText("Globex Corp")).toBeInTheDocument();
    });

    // Click project card to open modal
    const viewDetails = screen.getByText("View Details");
    fireEvent.click(viewDetails);

    await waitFor(() => {
      expect(screen.getByText("Role Overview")).toBeInTheDocument();
    });

    // Close modal
    const closeBtn = screen.getByLabelText("Close modal");
    fireEvent.click(closeBtn);
    await waitFor(
      () => {
        expect(screen.queryByText("Role Overview")).not.toBeInTheDocument();
      },
      { timeout: 3000 },
    );
  });

  it("switches to Training Projects when tab is clicked", async () => {
    render(<Resume data={mockResumeData} />);

    fireEvent.click(screen.getByRole("button", { name: "Training Projects" }));

    await waitFor(() => {
      expect(screen.getByText("React & TypeScript Bootcamp")).toBeInTheDocument();
      expect(screen.getByText("Lead Instructor")).toBeInTheDocument();
      expect(screen.getByText("Dev Academy")).toBeInTheDocument();
    });
  });
});
