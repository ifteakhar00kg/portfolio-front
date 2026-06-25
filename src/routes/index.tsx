import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "../components/SiteShell";
import { Footer } from "../components/Footer";
import { Hero } from "../sections/Hero";
import { WhatIDo } from "../sections/WhatIDo";
import { Projects } from "../sections/Projects";
import { ApiIntegration } from "../sections/ApiIntegration";
import { Experience } from "../sections/Experience";
import { Contact } from "../sections/Contact";

const TITLE =
  "Ifteakar | Full Stack Developer — Spring Boot & React · Dhaka";
const DESCRIPTION =
  "Ifteakar is a full stack developer in Dhaka building Spring Boot APIs, React interfaces, and custom AI & third-party integrations for shipping products.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteShell>
      <section id="home" className="scroll-mt-24">
        <Hero />
      </section>
      <section id="services" className="scroll-mt-24">
        <WhatIDo />
      </section>
      <section id="projects" className="scroll-mt-24">
        <Projects />
      </section>
      <section id="integrations" className="scroll-mt-24">
        <ApiIntegration />
      </section>
      <section id="experience" className="scroll-mt-24">
        <Experience />
      </section>
      <section id="contact" className="scroll-mt-24">
        <Contact />
      </section>
      <Footer />
    </SiteShell>
  );
}
