import * as React from "react";
import { Certification } from "@/services/api.types";
import { ShieldCheck, Calendar, ExternalLink } from "lucide-react";

export function CertificationsSection({ items }: { items: Certification[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-white/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-center">
        <p className="text-muted-foreground">No certifications available.</p>
      </div>
    );
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {items.map((cert) => (
        <div
          key={cert.id}
          className="group relative flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 hover:border-emerald-500/30 overflow-hidden"
        >
          {/* Background Ambient Glow on Hover */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/0 via-emerald-500/0 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  {cert.name}
                </h3>
                <div className="text-emerald-600 dark:text-emerald-500 font-medium">
                  {cert.issuer}
                </div>
              </div>
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground mt-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  Issued: {formatDate(cert.issue_date)}
                  {cert.expiration_date && ` · Expires: ${formatDate(cert.expiration_date)}`}
                </span>
              </div>
              {cert.credential_id && (
                <div className="flex items-center gap-2 font-mono text-xs opacity-75">
                  <span className="font-semibold sans-serif text-sm">ID:</span> {cert.credential_id}
                </div>
              )}
            </div>
          </div>

          {cert.credential_url && (
            <div className="relative z-10 mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <a
                href={cert.credential_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors group/link"
              >
                Verify Credential
                <ExternalLink className="w-4 h-4 ml-1.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
