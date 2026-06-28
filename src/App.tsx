/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { 
  Menu, 
  X, 
  ArrowRight, 
  Building2, 
  Map, 
  ClipboardCheck, 
  Mail, 
  Phone, 
  MapPin,
  Instagram,
  Linkedin,
  Facebook
} from "lucide-react";
import { useState, useEffect } from "react";

const projects = [
  {
    title: "Residencia Minimalista",
    category: "Edificación",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Centro Corporativo V",
    category: "Urbanismo",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Vivienda Unifamiliar",
    category: "Edificación",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Plan Maestro Urbano",
    category: "Urbanismo",
    image: "https://images.unsplash.com/photo-1449156003053-c30670b968b9?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Rehabilitación Histórica",
    category: "Asesoramiento",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Villa Contemporánea",
    category: "Edificación",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80"
  }
];

const services = [
  {
    title: "Edificación",
    description: "Planificación avanzada y diseño de vanguardia para proyectos residenciales y comerciales.",
    icon: <Building2 className="w-8 h-8" />
  },
  {
    title: "Urbanismo",
    description: "Desarrollo y ordenación del territorio con una visión sostenible y funcional.",
    icon: <Map className="w-8 h-8" />
  },
  {
    title: "Asesoramiento",
    description: "Consultoría técnica integral en materia de construcción y normativa vigente.",
    icon: <ClipboardCheck className="w-8 h-8" />
  }
];

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen selection:bg-zinc-100 selection:text-zinc-900">
      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? "bg-zinc-950/90 backdrop-blur-md py-4 border-b border-zinc-800" : "bg-transparent py-8"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tighter text-white">
              ANDRÉS MATA CARO
            </span>
            <span className="text-[10px] tracking-[0.3em] text-zinc-400 font-light">
              ARQUITECTO
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {["INICIO", "SOBRE NOSOTROS", "SERVICIOS", "PROYECTOS", "BLOG", "CONTACTO"].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-xs font-medium tracking-widest text-zinc-400 hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 w-full bg-zinc-950 border-b border-zinc-800 p-6 md:hidden"
          >
            <div className="flex flex-col space-y-4">
              {["INICIO", "SOBRE NOSOTROS", "SERVICIOS", "PROYECTOS", "BLOG", "CONTACTO"].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className="text-sm font-medium tracking-widest text-zinc-400"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="relative h-screen w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1448630360428-65456885c650?auto=format&fit=crop&w=1920&q=80" 
            alt="Arquitectura Moderna"
            className="w-full h-full object-cover scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/40 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6 text-white">
              VISIÓN.<br />ESPACIO.<br />VANGUARDIA.
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 font-light mb-10 max-w-lg leading-relaxed">
              La planificación y el asesoramiento que requiere su proyecto de construcción están en las mejores manos.
            </p>
            <motion.a 
              href="#proyectos"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-4 bg-white text-zinc-950 px-8 py-4 rounded-full font-bold tracking-tight hover:bg-zinc-200 transition-colors"
            >
              <span>Explorar Proyectos</span>
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-px h-12 bg-gradient-to-b from-white to-transparent"></div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="sobre-nosotros" className="py-32 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-[4/5] overflow-hidden rounded-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1503387762-592dee58c460?auto=format&fit=crop&w=1000&q=80" 
                alt="Proceso creativo"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 border-[20px] border-zinc-950/50 pointer-events-none"></div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-xs font-bold tracking-[0.5em] text-zinc-500 uppercase mb-4 block">
                Sobre Nosotros
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 text-white leading-tight">
                Procedimientos profesionales y creativos.
              </h2>
              <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                Descubra quiénes somos y cómo transformamos espacios con una dilatada experiencia en construcción. Nuestra filosofía se basa en la integración de la estética contemporánea con la funcionalidad estructural.
              </p>
              <p className="text-zinc-400 text-lg leading-relaxed mb-12">
                Cada proyecto es un desafío único donde la luz, el material y el entorno convergen para crear experiencias arquitectónicas memorables.
              </p>
              <div className="grid grid-cols-2 gap-8 border-t border-zinc-800 pt-12">
                <div>
                  <span className="text-3xl font-bold text-white block mb-1">25+</span>
                  <span className="text-xs tracking-widest text-zinc-500 uppercase">Años de experiencia</span>
                </div>
                <div>
                  <span className="text-3xl font-bold text-white block mb-1">150+</span>
                  <span className="text-xs tracking-widest text-zinc-500 uppercase">Proyectos finalizados</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-32 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <span className="text-xs font-bold tracking-[0.5em] text-zinc-500 uppercase mb-4 block">
              Nuestros Servicios
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              Excelencia Técnica
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group p-10 bg-zinc-900 border border-zinc-800 rounded-3xl hover:border-zinc-600 transition-all duration-500"
              >
                <div className="mb-8 text-zinc-400 group-hover:text-white transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4 tracking-tight">
                  {service.title}
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="proyectos" className="py-32 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div>
              <span className="text-xs font-bold tracking-[0.5em] text-zinc-500 uppercase mb-4 block">
                Portafolio
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                Proyectos Destacados
              </h2>
            </div>
            <a href="#" className="text-sm font-bold tracking-widest text-white border-b border-white pb-2 hover:text-zinc-400 hover:border-zinc-400 transition-all">
              VER TODOS LOS PROYECTOS
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer"
              >
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-zinc-950/0 group-hover:bg-zinc-950/80 transition-all duration-500 flex flex-col justify-end p-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    className="transform transition-all"
                  >
                    <span className="text-[10px] tracking-[0.3em] text-zinc-400 uppercase mb-2 block">
                      {project.category}
                    </span>
                    <h4 className="text-xl font-bold text-white tracking-tight">
                      {project.title}
                    </h4>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Contact Section */}
      <footer id="contacto" className="bg-zinc-950 border-t border-zinc-900 pt-32 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
            <div>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-12 leading-none">
                ¿Hablamos de su próximo proyecto?
              </h2>
              <div className="flex space-x-6">
                <a href="#" className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white transition-all">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white transition-all">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white transition-all">
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <Mail className="w-5 h-5 text-zinc-500 mt-1" />
                  <div>
                    <span className="text-[10px] tracking-widest text-zinc-500 uppercase block mb-1">Email</span>
                    <a href="mailto:andresmata@coagranada.org" className="text-white hover:text-zinc-400 transition-colors">
                      andresmata@coagranada.org
                    </a>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="w-5 h-5 text-zinc-500 mt-1" />
                  <div>
                    <span className="text-[10px] tracking-widest text-zinc-500 uppercase block mb-1">Teléfonos</span>
                    <p className="text-white">958 52 19 55</p>
                    <p className="text-white">616 47 94 46</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <MapPin className="w-5 h-5 text-zinc-500 mt-1" />
                <div>
                  <span className="text-[10px] tracking-widest text-zinc-500 uppercase block mb-1">Ubicación</span>
                  <p className="text-white leading-relaxed">
                    Calle Buensuceso 1 - 3ª A,<br />
                    18002 GRANADA.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-sm font-bold tracking-tighter text-white">
                ANDRÉS MATA CARO
              </span>
              <span className="text-[8px] tracking-[0.3em] text-zinc-500 font-light">
                ARQUITECTO
              </span>
            </div>
            <p className="text-zinc-600 text-[10px] tracking-widest uppercase">
              Copyright © {new Date().getFullYear()} Andrés Mata Caro - Arquitecto.
            </p>
            <div className="flex space-x-8">
              <a href="#" className="text-[10px] tracking-widest text-zinc-600 hover:text-white transition-colors uppercase">Privacidad</a>
              <a href="#" className="text-[10px] tracking-widest text-zinc-600 hover:text-white transition-colors uppercase">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
