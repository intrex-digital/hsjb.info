"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export const NAV_LINKS = [
  { href: "#about", label: "About", id: "about" },
  { href: "#skills", label: "Skills", id: "skills" },
  { href: "#resume", label: "Resume", id: "resume" },
  { href: "#services", label: "Services", id: "services" },
  { href: "#blog", label: "Blog", id: "blog" },
  { href: "#contact", label: "Contact", id: "contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState("");

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Top of the page: clear active section
      if (window.scrollY < 120) {
        setActiveSection("");
        return;
      }

      // Check if user scrolled to bottom of page (activate contact)
      const scrollHeight = document.documentElement.scrollHeight;
      if (
        scrollHeight > window.innerHeight &&
        window.innerHeight + Math.round(window.scrollY) >= scrollHeight - 60
      ) {
        setActiveSection("contact");
        return;
      }

      // Check section bounding positions
      const sectionIds = ["about", "skills", "resume", "services", "blog", "contact"];
      const scrollPosition = window.scrollY + 140;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(id);
          return;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on desktop resize
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setIsMobileMenuOpen(false);
    if (href.startsWith("#")) {
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: "smooth" });
        setActiveSection(targetId);
        window.history.pushState(null, "", href);
      }
    }
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex h-16 items-center transition-all duration-300",
        isScrolled
          ? "border-b border-border/40 bg-background/80 backdrop-blur-md shadow-sm"
          : "bg-transparent",
      )}
    >
      <div className="container mx-auto flex h-full items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="font-heading text-xl font-bold tracking-tighter text-foreground transition-colors hover:text-primary"
          onClick={() => {
            setIsMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          HSJB<span className="text-primary">.info</span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="Main Navigation"
          className="hidden md:flex md:items-center md:gap-1 lg:gap-2"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary font-semibold dark:bg-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
              >
                {link.label}
              </a>
            );
          })}
          <div className="ml-3 pl-3 border-l border-border/60">
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Controls */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 z-40 h-[calc(100vh-4rem)] bg-background/95 backdrop-blur-md animate-in slide-in-from-top-2 md:hidden">
          <nav aria-label="Mobile Navigation" className="flex flex-col p-6 gap-2 shadow-xl">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex py-3 px-4 text-base font-medium rounded-xl transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary font-bold dark:bg-primary/20"
                      : "text-foreground hover:bg-muted/50 hover:text-primary",
                  )}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
