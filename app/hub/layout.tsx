import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse AI Tools & Tech Stack",
  description:
    "Browse 2,386 AI Tools and 1,861 Developer Technologies. Filter, compare, and discover with fuzzy search.",
};

export default function HubLayout({ children }: { children: React.ReactNode }) {
  return children;
}
