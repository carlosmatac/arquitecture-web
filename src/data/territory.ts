import { projects, type Project } from "./projects";

/** [latitude, longitude] */
export type LatLon = [number, number];

const coordinates: Record<string, LatLon> = {
  Granada: [37.1773, -3.5986],
  Capileira: [36.9617, -3.3589],
  Bubión: [36.9494, -3.3561],
  Nigüelas: [36.9867, -3.5367],
  Víznar: [37.2336, -3.5536],
  Motril: [36.745, -3.5178],
  "La Herradura": [36.7358, -3.7372],
  Monachil: [37.1328, -3.5372],
  Otura: [37.0906, -3.6358],
  "Las Gabias": [37.1344, -3.6703],
  Belicena: [37.1667, -3.6911],
  Loja: [37.1686, -4.1514],
  Maracena: [37.2072, -3.6344],
  Dílar: [37.0728, -3.6011],
  Benamaurel: [37.6083, -2.7019],
  Álora: [36.8231, -4.7042],
  Jaén: [37.7796, -3.7849],
};


export const municipalityOf = (project: Project) => {
  const parts = project.location.split(", ");
  return parts.length > 1 ? parts[parts.length - 2] : parts[0];
};

export interface Municipality {
  name: string;
  coords: LatLon;
  projects: Project[];
}

export const municipalities: Municipality[] = Object.values(
  projects.reduce<Record<string, Municipality>>((acc, project) => {
    const name = municipalityOf(project);
    acc[name] ??= { name, coords: coordinates[name], projects: [] };
    acc[name].projects.push(project);
    return acc;
  }, {}),
).sort((a, b) => b.projects.length - a.projects.length || a.name.localeCompare(b.name, "es"));
