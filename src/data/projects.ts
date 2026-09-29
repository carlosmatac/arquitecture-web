export type Category = "Edificación" | "Urbanismo";

export type Subcategory =
  | "Viviendas plurifamiliares"
  | "Viviendas unifamiliares"
  | "Edificios públicos"
  | "Urbanismo público"
  | "Urbanismo privado";

/**
 * photo  – real photograph of built work (retouched with AI, geometry preserved)
 * render – legacy 3D render (re-rendered photorealistically with AI, geometry preserved)
 * aerial – aerial / satellite / 3D massing image (AI clarity enhancement only)
 * plan   – planning drawing (never sent to AI, only upscaled locally)
 */
export type ImageKind = "photo" | "render" | "aerial" | "plan";

export interface ProjectImage {
  /** Output path relative to /public/projects */
  file: string;
  /** Original file in /assets/originals (downloaded from the old website) */
  source: string;
  kind: ImageKind;
  alt: string;
  /** Retouched file in /assets/retouched when it isn't named `<source id>-profesional.png` */
  retouched?: string;
  /** Extra instructions for the AI retouch of this specific image */
  notes?: string;
}

export interface Project {
  slug: string;
  title: string;
  location: string;
  category: Category;
  subcategory: Subcategory;
  description: string;
  images: ProjectImage[];
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: "vivienda-vacacional-niguelas",
    title: "Vivienda unifamiliar vacacional",
    location: "Nigüelas, Granada",
    category: "Edificación",
    subcategory: "Viviendas unifamiliares",
    description:
      "Vivienda unifamiliar vacacional con piscina, doble altura y grandes huecos abiertos al paisaje del Valle de Lecrín.",
    featured: true,
    images: [
      { file: "vivienda-vacacional-niguelas/01.jpg", source: "322657.jpg", retouched: "322653-322658-profesional.png", kind: "photo", alt: "Piscina y fachada al patio" },
      { file: "vivienda-vacacional-niguelas/02.jpg", source: "322656.jpg", kind: "photo", alt: "Fachada exterior con la sierra al fondo" },
      { file: "vivienda-vacacional-niguelas/03.jpg", source: "322654.jpg", kind: "photo", alt: "Salón bajo cubierta con ventanal a dos aguas" },
      { file: "vivienda-vacacional-niguelas/04.jpg", source: "322653.jpg", kind: "photo", alt: "Espacio a doble altura con escalera" },
      { file: "vivienda-vacacional-niguelas/05.jpg", source: "322655.jpg", kind: "photo", alt: "Galería interior de planta alta" },
      { file: "vivienda-vacacional-niguelas/06.jpg", source: "322659.jpg", kind: "photo", alt: "Porche exterior" },
      { file: "vivienda-vacacional-niguelas/07.jpg", source: "322658.jpg", kind: "photo", alt: "Terraza de planta alta" },
      { file: "vivienda-vacacional-niguelas/08.jpg", source: "322547.jpg", kind: "render", alt: "Infografía del proyecto: vista exterior" },
      { file: "vivienda-vacacional-niguelas/09.jpg", source: "322549.jpg", kind: "render", alt: "Infografía del proyecto: salón bajo cubierta" },
      { file: "vivienda-vacacional-niguelas/10.jpg", source: "322554.jpg", kind: "render", alt: "Infografía del proyecto: doble altura" },
    ],
  },
  {
    slug: "edificio-multifuncional-motril",
    title: "Edificio multifuncional",
    location: "Motril, Granada",
    category: "Edificación",
    subcategory: "Edificios públicos",
    description:
      "Edificio multifuncional concebido para completar las necesidades del barrio de Varadero, en el Puerto de Motril.",
    featured: true,
    images: [
      { file: "edificio-multifuncional-motril/01.jpg", source: "250992.jpg", kind: "render", alt: "Vista exterior del edificio multifuncional" },
      { file: "edificio-multifuncional-motril/02.jpg", source: "247423.jpg", kind: "render", alt: "Vista de la plaza de acceso" },
    ],
  },
  {
    slug: "biblioteca-otura",
    title: "Biblioteca municipal",
    location: "Otura, Granada",
    category: "Edificación",
    subcategory: "Edificios públicos",
    description: "Biblioteca municipal de líneas contemporáneas para el municipio de Otura.",
    featured: true,
    images: [{ file: "biblioteca-otura/01.jpg", source: "657928.jpg", kind: "render", alt: "Interior de la biblioteca" }],
  },
  {
    slug: "sala-multiusos-viznar",
    title: "Sala multiusos",
    location: "Víznar, Granada",
    category: "Edificación",
    subcategory: "Edificios públicos",
    description: "Edificio municipal de usos múltiples en el CEIP Arzobispo Moscoso.",
    featured: true,
    images: [
      { file: "sala-multiusos-viznar/01.jpg", source: "657929.jpg", kind: "render", alt: "Vista exterior de la sala multiusos" },
      { file: "sala-multiusos-viznar/02.jpg", source: "251472.jpg", kind: "render", alt: "Vista nocturna de la sala multiusos" },
    ],
  },
  {
    slug: "edificio-arabial",
    title: "Edificio de viviendas en calle Arabial",
    location: "Granada",
    category: "Edificación",
    subcategory: "Viviendas plurifamiliares",
    description: "Edificio de 15 viviendas con locales comerciales y sótanos de aparcamiento.",
    featured: true,
    images: [{ file: "edificio-arabial/01.jpg", source: "250938.jpg", kind: "photo", alt: "Fachada del edificio en calle Arabial" }],
  },
  {
    slug: "edificio-la-herradura",
    title: "Edificio de apartamentos",
    location: "La Herradura, Granada",
    category: "Edificación",
    subcategory: "Viviendas plurifamiliares",
    description: "Edificio de 19 apartamentos con garajes en la costa granadina.",
    featured: true,
    images: [{ file: "edificio-la-herradura/01.jpg", source: "247417.jpg", kind: "render", alt: "Vista exterior del edificio de apartamentos" }],
  },
  {
    slug: "vivienda-artistas-niguelas",
    title: "Vivienda para una pareja de artistas",
    location: "Nigüelas, Granada",
    category: "Edificación",
    subcategory: "Viviendas unifamiliares",
    description: "Vivienda unifamiliar diseñada para una pareja de artistas.",
    featured: true,
    images: [{ file: "vivienda-artistas-niguelas/01.jpg", source: "247419.jpg", kind: "render", alt: "Vista nocturna de la vivienda" }],
  },
  {
    slug: "vivienda-capileira",
    title: "Vivienda unifamiliar alpujarreña",
    location: "Capileira, Granada",
    category: "Edificación",
    subcategory: "Viviendas unifamiliares",
    description: "Vivienda en la Alpujarra construida con su arquitectura tradicional de muros de piedra.",
    featured: true,
    images: [{ file: "vivienda-capileira/01.jpg", source: "247583.jpg", kind: "photo", alt: "Vivienda de piedra en Capileira" }],
  },
  {
    slug: "plan-parcial-ar1-maracena",
    title: "Plan Parcial del Área de Reparto AR-1",
    location: "Maracena, Granada",
    category: "Urbanismo",
    subcategory: "Urbanismo público",
    description:
      "Plan Parcial que ordena un sector de suelo urbanizable sectorizado residencial, planificando una nueva área de expansión del municipio.",
    featured: true,
    images: [{ file: "plan-parcial-ar1-maracena/01.jpg", source: "248285.jpg", kind: "aerial", alt: "Vista 3D de la ordenación del sector AR-1" }],
  },
  {
    slug: "edificio-monachil-19",
    title: "Edificio de 19 apartamentos",
    location: "Monachil, Granada",
    category: "Edificación",
    subcategory: "Viviendas plurifamiliares",
    description: "Edificio de 19 apartamentos con garajes.",
    images: [{ file: "edificio-monachil-19/01.jpg", source: "250936.jpg", kind: "render", alt: "Vista exterior del edificio en Monachil" }],
  },
  {
    slug: "edificio-monachil-94",
    title: "Edificio de 94 apartamentos",
    location: "Monachil, Granada",
    category: "Edificación",
    subcategory: "Viviendas plurifamiliares",
    description: "Edificio de 94 apartamentos con garajes.",
    images: [{ file: "edificio-monachil-94/01.jpg", source: "250937.jpg", kind: "photo", alt: "Fachada del edificio de 94 apartamentos" }],
  },
  {
    slug: "edificio-calle-elvira",
    title: "Edificio de viviendas en calle Elvira",
    location: "Granada",
    category: "Edificación",
    subcategory: "Viviendas plurifamiliares",
    description: "Edificio de 12 viviendas con garajes en la calle Elvira, en pleno centro histórico.",
    images: [{ file: "edificio-calle-elvira/01.jpg", source: "250949.jpg", kind: "photo", alt: "Fachada del edificio en calle Elvira" }],
  },
  {
    slug: "edificio-loja",
    title: "Edificio de viviendas y locales",
    location: "Loja, Granada",
    category: "Edificación",
    subcategory: "Viviendas plurifamiliares",
    description: "Edificio de viviendas, locales comerciales y garajes.",
    images: [{ file: "edificio-loja/01.jpg", source: "250951.jpg", kind: "photo", alt: "Fachada del edificio en Loja" }],
  },
  {
    slug: "urbanizacion-viznar-44",
    title: "Urbanización de 44 viviendas",
    location: "Víznar, Granada",
    category: "Edificación",
    subcategory: "Viviendas plurifamiliares",
    description: "Conjunto residencial de 44 viviendas con garajes.",
    images: [{ file: "urbanizacion-viznar-44/01.jpg", source: "250954.jpg", kind: "render", alt: "Vista del conjunto residencial" }],
  },
  {
    slug: "guarderia-belicena",
    title: "Guardería",
    location: "Belicena, Granada",
    category: "Edificación",
    subcategory: "Viviendas unifamiliares",
    description: "Vivienda unifamiliar adaptada para su uso como guardería.",
    images: [{ file: "guarderia-belicena/01.jpg", source: "250957.jpg", kind: "photo", alt: "Fachada de la guardería" }],
  },
  {
    slug: "viviendas-niguelas-5",
    title: "Cinco viviendas unifamiliares",
    location: "Nigüelas, Granada",
    category: "Edificación",
    subcategory: "Viviendas unifamiliares",
    description: "Promoción de cinco viviendas unifamiliares.",
    images: [{ file: "viviendas-niguelas-5/01.jpg", source: "250958.jpg", kind: "photo", alt: "Fachada de las cinco viviendas" }],
  },
  {
    slug: "vivienda-adosada-niguelas",
    title: "Vivienda adosada vacacional",
    location: "Nigüelas, Granada",
    category: "Edificación",
    subcategory: "Viviendas unifamiliares",
    description: "Vivienda adosada de uso vacacional.",
    images: [{ file: "vivienda-adosada-niguelas/01.jpg", source: "247584.jpg", kind: "render", alt: "Vista nocturna de la vivienda adosada" }],
  },
  {
    slug: "vivienda-niguelas-a",
    title: "Vivienda unifamiliar",
    location: "Nigüelas, Granada",
    category: "Edificación",
    subcategory: "Viviendas unifamiliares",
    description: "Vivienda unifamiliar de nueva construcción.",
    images: [{ file: "vivienda-niguelas-a/01.jpg", source: "250959.jpg", kind: "photo", alt: "Fachada de la vivienda" }],
  },
  {
    slug: "vivienda-niguelas-b",
    title: "Vivienda unifamiliar",
    location: "Nigüelas, Granada",
    category: "Edificación",
    subcategory: "Viviendas unifamiliares",
    description: "Vivienda unifamiliar de nueva construcción.",
    images: [{ file: "vivienda-niguelas-b/01.jpg", source: "250976.jpg", kind: "photo", alt: "Fachada de la vivienda" }],
  },
  {
    slug: "vivienda-san-javier-las-gabias",
    title: "Vivienda unifamiliar",
    location: "Urb. San Javier, Las Gabias, Granada",
    category: "Edificación",
    subcategory: "Viviendas unifamiliares",
    description: "Vivienda unifamiliar de volúmenes blancos y líneas contemporáneas.",
    images: [{ file: "vivienda-san-javier-las-gabias/01.jpg", source: "247421.jpg", kind: "photo", alt: "Vivienda en la urbanización San Javier" }],
  },
  {
    slug: "vivienda-las-gabias",
    title: "Vivienda particular",
    location: "Las Gabias, Granada",
    category: "Edificación",
    subcategory: "Viviendas unifamiliares",
    description: "Vivienda particular de nueva construcción.",
    images: [{ file: "vivienda-las-gabias/01.jpg", source: "250971.jpg", kind: "photo", alt: "Fachada de la vivienda" }],
  },
  {
    slug: "vivienda-otura",
    title: "Vivienda unifamiliar",
    location: "Otura, Granada",
    category: "Edificación",
    subcategory: "Viviendas unifamiliares",
    description: "Vivienda unifamiliar de nueva construcción.",
    images: [{ file: "vivienda-otura/01.jpg", source: "250972.jpg", kind: "photo", alt: "Fachada de la vivienda" }],
  },
  {
    slug: "rehabilitacion-bubion",
    title: "Rehabilitación de vivienda",
    location: "Bubión, Granada",
    category: "Edificación",
    subcategory: "Viviendas unifamiliares",
    description: "Rehabilitación de una vivienda unifamiliar tradicional en la Alpujarra.",
    images: [{ file: "rehabilitacion-bubion/01.jpg", source: "250975.png", kind: "photo", alt: "Vivienda rehabilitada en Bubión" }],
  },
  {
    slug: "consultorio-niguelas",
    title: "Consultorio médico municipal",
    location: "Nigüelas, Granada",
    category: "Edificación",
    subcategory: "Edificios públicos",
    description: "Edificio municipal destinado a consultorio médico.",
    images: [{ file: "consultorio-niguelas/01.jpg", source: "250993.jpg", kind: "photo", alt: "Fachada del consultorio médico" }],
  },
  {
    slug: "instalaciones-deportivas-jaen",
    title: "Ampliación de instalaciones deportivas",
    location: "Jaén",
    category: "Edificación",
    subcategory: "Edificios públicos",
    description: "Ampliación de las instalaciones deportivas de La Salobreja, en el parque Felipe Arche.",
    images: [{ file: "instalaciones-deportivas-jaen/01.jpg", source: "250994.jpg", kind: "render", alt: "Vista de la ampliación deportiva" }],
  },
  {
    slug: "plaza-aparcamiento-viznar",
    title: "Plaza y aparcamiento público",
    location: "Víznar, Granada",
    category: "Edificación",
    subcategory: "Edificios públicos",
    description: "Construcción de una plaza pública con aparcamiento público.",
    images: [{ file: "plaza-aparcamiento-viznar/01.jpg", source: "251019.jpg", kind: "render", alt: "Vista aérea de la plaza" }],
  },
  {
    slug: "pgou-alora",
    title: "PGOU por adaptación parcial de las NN.SS.",
    location: "Álora, Málaga",
    category: "Urbanismo",
    subcategory: "Urbanismo público",
    description: "Modificación del planeamiento general mediante adaptación parcial de las Normas Subsidiarias.",
    images: [{ file: "pgou-alora/01.jpg", source: "248283.jpg", kind: "aerial", alt: "Vista aérea de Álora" }],
  },
  {
    slug: "reparcelacion-benamaurel",
    title: "Proyecto de reparcelación",
    location: "Benamaurel, Granada",
    category: "Urbanismo",
    subcategory: "Urbanismo público",
    description: "Proyecto de reparcelación de la Unidad de Ejecución Virgen de la Cabeza.",
    images: [{ file: "reparcelacion-benamaurel/01.jpg", source: "248284.jpg", kind: "plan", alt: "Plano de reparcelación" }],
  },
  {
    slug: "pgou-niguelas",
    title: "PGOU por adaptación parcial de las NN.SS.",
    location: "Nigüelas, Granada",
    category: "Urbanismo",
    subcategory: "Urbanismo público",
    description: "Modificación del planeamiento general mediante adaptación parcial de las Normas Subsidiarias.",
    images: [{ file: "pgou-niguelas/01.jpg", source: "248296.jpg", kind: "plan", alt: "Plano de ordenación de Nigüelas" }],
  },
  {
    slug: "parque-libertad-viznar",
    title: "Parque de la Libertad",
    location: "Víznar, Granada",
    category: "Urbanismo",
    subcategory: "Urbanismo público",
    description: "Ordenación de espacios libres y equipamientos en la UE-1.",
    images: [{ file: "parque-libertad-viznar/01.jpg", source: "248297.jpg", kind: "aerial", alt: "Vista aérea del Parque de la Libertad" }],
  },
  {
    slug: "urbanizacion-dilar",
    title: "Urbanización residencial",
    location: "Dílar, Granada",
    category: "Urbanismo",
    subcategory: "Urbanismo privado",
    description: "Urbanización destinada a la construcción de 8 viviendas unifamiliares.",
    images: [{ file: "urbanizacion-dilar/01.jpg", source: "248352.jpg", kind: "plan", alt: "Plano de la urbanización" }],
  },
  {
    slug: "plan-especial-ue8-viznar",
    title: "Plan Especial UE-8 Urbanización San Miguel",
    location: "Víznar, Granada",
    category: "Urbanismo",
    subcategory: "Urbanismo privado",
    description:
      "Urbanización para la promoción de vivienda unifamiliar y plurifamiliar, completada con equipamientos públicos y privados.",
    images: [{ file: "plan-especial-ue8-viznar/01.jpg", source: "248353.jpg", kind: "plan", alt: "Plano del Plan Especial UE-8" }],
  },
  {
    slug: "plan-parcial-rinconcillo-niguelas",
    title: "Plan Parcial Urbanización El Rinconcillo",
    location: "Nigüelas, Granada",
    category: "Urbanismo",
    subcategory: "Urbanismo privado",
    description:
      "Urbanización para la promoción de vivienda unifamiliar y plurifamiliar, completada con equipamientos públicos y privados.",
    images: [{ file: "plan-parcial-rinconcillo-niguelas/01.jpg", source: "248354.jpg", kind: "plan", alt: "Plano del Plan Parcial El Rinconcillo" }],
  },
  {
    slug: "plan-especial-capileira-c13",
    title: "Plan Especial C-13",
    location: "Capileira, Granada",
    category: "Urbanismo",
    subcategory: "Urbanismo privado",
    description: "Desarrollo urbanístico para la promoción particular de vivienda unifamiliar.",
    images: [{ file: "plan-especial-capileira-c13/01.jpg", source: "248422.jpg", kind: "plan", alt: "Plano del Plan Especial C-13" }],
  },
  {
    slug: "plan-especial-capileira-c9",
    title: "Plan Especial C-9",
    location: "Capileira, Granada",
    category: "Urbanismo",
    subcategory: "Urbanismo privado",
    description: "Desarrollo urbanístico para la promoción particular de vivienda unifamiliar.",
    images: [{ file: "plan-especial-capileira-c9/01.jpg", source: "248425.jpg", kind: "plan", alt: "Plano del Plan Especial C-9" }],
  },
];

export const projectImageUrl = (image: ProjectImage) => `/projects/${image.file}`;
