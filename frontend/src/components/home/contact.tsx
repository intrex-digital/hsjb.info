"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, CheckCircle2, Loader2, Clock, MessageSquare, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Profile, ApiError } from "@/services";
import { sendContactMessage } from "@/services/contact";
import { SectionHeader } from "@/components/ui/section-header";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/field-error";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface ContactProps {
  profile: Profile;
}

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Contact({ profile }: ContactProps) {
  const [formData, setFormData] = React.useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = React.useState<FormErrors>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const validateField = (field: keyof FormState, value: string): string | undefined => {
    switch (field) {
      case "name":
        if (!value.trim()) return "Please enter your name.";
        if (value.trim().length < 2) return "Name must be at least 2 characters.";
        return undefined;
      case "email":
        if (!value.trim()) return "Please enter your email address.";
        if (!EMAIL_REGEX.test(value.trim())) return "Please enter a valid email address.";
        return undefined;
      case "subject":
        if (!value.trim()) return "Please enter a subject.";
        if (value.trim().length < 3) return "Subject must be at least 3 characters.";
        return undefined;
      case "message":
        if (!value.trim()) return "Please enter your message.";
        if (value.trim().length < 10) return "Message must be at least 10 characters.";
        return undefined;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    (Object.keys(formData) as Array<keyof FormState>).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: keyof FormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true,
    });

    if (!validateForm()) {
      toast.error("Please correct the errors in the form before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      await sendContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      setIsSuccess(true);
      toast.success("Thank you! Your message has been sent successfully.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setErrors({});
      setTouched({});
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.detail && typeof err.detail === "object") {
          const serverErrors: FormErrors = {};
          const detail = err.detail as Record<string, string[]>;
          if (detail.name) serverErrors.name = detail.name[0];
          if (detail.email) serverErrors.email = detail.email[0];
          if (detail.subject) serverErrors.subject = detail.subject[0];
          if (detail.message) serverErrors.message = detail.message[0];
          setErrors(serverErrors);
          toast.error(err.message || "Please fix the indicated fields.");
        } else {
          toast.error(err.message || "Failed to send message. Please try again later.");
        }
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 bg-surface dark:bg-background overflow-hidden">
      {/* Ambient background decoration */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-secondary/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 right-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="container px-4 md:px-6 max-w-7xl mx-auto relative z-10">
        <ScrollReveal>
          <SectionHeader
            badge="Contact"
            title="Let's Work Together"
            subtitle="Have an interesting project or inquiry? Leave a message and let's discuss."
            align="center"
            className="mb-16"
          />
        </ScrollReveal>

        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Left Column: Contact Information */}
          <ScrollReveal delay={0.1} className="lg:col-span-5 space-y-8">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
              <h3 className="font-heading text-2xl font-bold tracking-tight text-foreground mb-4">
                Get in Touch
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Whether you are looking for custom development, system design consulting, or
                technical training, I am always open to discussing new opportunities.
              </p>

              <div className="space-y-6">
                {/* Email Address */}
                {profile.email && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                        Email Me Directly
                      </span>
                      <a
                        href={`mailto:${profile.email}`}
                        className="text-base font-semibold text-foreground hover:text-primary transition-colors break-all"
                      >
                        {profile.email}
                      </a>
                    </div>
                  </div>
                )}

                {/* Response Time */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary/40 text-secondary-foreground">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Response Time
                    </span>
                    <p className="text-base font-medium text-foreground">
                      Typically within 24–48 hours
                    </p>
                  </div>
                </div>

                {/* Direct Consultation */}
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                      Consultation & Training
                    </span>
                    <p className="text-base font-medium text-foreground">
                      Available for remote & hybrid engagements
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-8 mt-8 border-t border-border/60">
                <span className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  Connect on Social
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  {profile.github_url && (
                    <a
                      href={profile.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-background border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                      aria-label="GitHub Profile"
                    >
                      <GithubIcon className="h-4 w-4" />
                    </a>
                  )}

                  {profile.linkedin_url && (
                    <a
                      href={profile.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-background border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                      aria-label="LinkedIn Profile"
                    >
                      <LinkedinIcon className="h-4 w-4" />
                    </a>
                  )}

                  {profile.twitter_url && (
                    <a
                      href={profile.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-background border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                      aria-label="Twitter/X Profile"
                    >
                      <TwitterIcon className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: Interactive Form Card */}
          <ScrollReveal delay={0.2} className="lg:col-span-7">
            <div className="rounded-3xl border border-border bg-card p-8 md:p-10 shadow-sm relative overflow-hidden">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  /* Success Confirmation State */
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col items-center justify-center text-center py-12 px-4 space-y-6"
                  >
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary/50 text-secondary-foreground shadow-sm">
                      <CheckCircle2 className="h-10 w-10 text-primary" />
                    </div>

                    <div className="space-y-2 max-w-md">
                      <h3 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                        Message Sent!
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        Thank you for reaching out. I have received your message and will review it
                        shortly.
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setIsSuccess(false)}
                      className="gap-2 mt-4"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  /* Form State */
                  <motion.form
                    key="form"
                    id="contact-form"
                    onSubmit={handleSubmit}
                    noValidate
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="grid gap-6 sm:grid-cols-2">
                      {/* Name */}
                      <div className="space-y-2">
                        <Label htmlFor="contact-name">
                          Your Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="contact-name"
                          type="text"
                          autoComplete="name"
                          placeholder="Jane Doe"
                          value={formData.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          onBlur={() => handleBlur("name")}
                          disabled={isSubmitting}
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? "name-error" : undefined}
                          className="h-11 rounded-xl bg-background border-border"
                          required
                        />
                        {errors.name && <FieldError id="name-error" error={errors.name} />}
                      </div>

                      {/* Email */}
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">
                          Email Address <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="contact-email"
                          type="email"
                          autoComplete="email"
                          placeholder="jane@example.com"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          onBlur={() => handleBlur("email")}
                          disabled={isSubmitting}
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? "email-error" : undefined}
                          className="h-11 rounded-xl bg-background border-border"
                          required
                        />
                        {errors.email && <FieldError id="email-error" error={errors.email} />}
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="space-y-2">
                      <Label htmlFor="contact-subject">
                        Subject <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="contact-subject"
                        type="text"
                        placeholder="Project Discussion / Technical Training"
                        value={formData.subject}
                        onChange={(e) => handleChange("subject", e.target.value)}
                        onBlur={() => handleBlur("subject")}
                        disabled={isSubmitting}
                        aria-invalid={!!errors.subject}
                        aria-describedby={errors.subject ? "subject-error" : undefined}
                        className="h-11 rounded-xl bg-background border-border"
                        required
                      />
                      {errors.subject && <FieldError id="subject-error" error={errors.subject} />}
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="contact-message">
                        Message <span className="text-destructive">*</span>
                      </Label>
                      <Textarea
                        id="contact-message"
                        rows={5}
                        placeholder="Tell me more about your requirements, project scope, or timeline..."
                        value={formData.message}
                        onChange={(e) => handleChange("message", e.target.value)}
                        onBlur={() => handleBlur("message")}
                        disabled={isSubmitting}
                        aria-invalid={!!errors.message}
                        aria-describedby={errors.message ? "message-error" : undefined}
                        className="rounded-xl bg-background border-border min-h-[140px] p-4 resize-y"
                        required
                      />
                      {errors.message && <FieldError id="message-error" error={errors.message} />}
                    </div>

                    {/* Submit Button */}
                    <Button
                      id="contact-submit-button"
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto min-w-[180px] rounded-xl gap-2 font-semibold shadow-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
