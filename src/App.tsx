/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MotionConfig } from "motion/react";
import { useCallback, useState } from "react";
import Contact from "./components/Contact";
import FeaturedWork from "./components/FeaturedWork";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Manifesto, { Marquee } from "./components/Manifesto";
import Nav from "./components/Nav";
import ProjectIndex from "./components/ProjectIndex";
import ProjectModal from "./components/ProjectModal";
import Services from "./components/Services";
import Studio from "./components/Studio";
import Territory from "./components/Territory";
import type { Project } from "./data/projects";
import { useSmoothScroll } from "./lib/smoothScroll";

export default function App() {
  useSmoothScroll();
  const [selected, setSelected] = useState<Project | null>(null);
  const close = useCallback(() => setSelected(null), []);

  return (
    <MotionConfig reducedMotion="user">
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Studio />
        <Manifesto />
        <Services />
        <FeaturedWork onOpen={setSelected} />
        <ProjectIndex onOpen={setSelected} />
        <Territory onOpen={setSelected} />
        <Contact />
      </main>
      <Footer />
      <ProjectModal project={selected} onClose={close} />
    </MotionConfig>
  );
}
