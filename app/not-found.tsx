import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <header className="page-hero" aria-label="Page not found" style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="hero-orb o1" aria-hidden="true" />
        <div className="hero-orb o2" aria-hidden="true" />
        <div className="page-hero-inner">
          <div className="page-hero-tag">Error 404</div>
          <h1 className="page-hero-title">
            This page <span className="grad">wandered off.</span>
          </h1>
          <p className="page-hero-sub">
            The link is broken or the page never existed. Let&apos;s get you back to something useful.
          </p>
          <div className="cta-actions" style={{ marginTop: "32px", display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/" className="btn-primary">Back home</Link>
            <Link href="/hub" className="btn-secondary">Browse the hub →</Link>
          </div>
        </div>
      </header>
      <SiteFooter />
    </>
  );
}
