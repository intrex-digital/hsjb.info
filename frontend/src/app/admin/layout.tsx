import type { Metadata } from "next";
import { AuthProvider } from "@/contexts/auth-context";

export const metadata: Metadata = {
  title: {
    template: "%s | Admin — hsjb.info",
    default: "Admin — hsjb.info",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
