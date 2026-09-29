/**
 * Emblematic architecture used as visual references in the hero.
 * All images come from Wikimedia Commons under free licences; they were cropped to a square
 * (an adaptation), so attribution + licence link must stay visible in the credits.
 */
export interface Reference {
  slug: string;
  name: string;
  place: string;
  author: string;
  license: string;
  licenseUrl: string;
  source: string;
}

export const references: Reference[] = [
  { slug: "patio-leones", name: "Patio de los Leones", place: "Alhambra, Granada · s. XIV", author: "Benjamin Smith", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Granada_-_Alhambra_-_Palacios_nazar%C3%ADes_-_Patio_de_los_Leones_-_1.jpg" },
  { slug: "museo-memoria-andalucia", name: "Museo Memoria de Andalucía", place: "Granada · Alberto Campo Baeza, 2009", author: "Anual", license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0", source: "https://commons.wikimedia.org/wiki/File:Museo_memoria_andalucia_001.jpg" },
  { slug: "capileira", name: "Tinao en Capileira", place: "La Alpujarra, Granada", author: "Jocelyn Erskine-Kellie", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0", source: "https://commons.wikimedia.org/wiki/File:Alley_in_Capileira_(38235669952).jpg" },
  { slug: "pabellon-barcelona", name: "Pabellón de Barcelona", place: "Barcelona · Mies van der Rohe, 1929", author: "Ashley Pomeroy", license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0", source: "https://commons.wikimedia.org/wiki/File:The_Barcelona_Pavilion,_Barcelona,_2010.jpg" },
  { slug: "palacio-carlos-v", name: "Palacio de Carlos V", place: "Alhambra, Granada · Pedro Machuca, 1527", author: "Benjamin Smith", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Granada_-_Alhambra_-_Palacio_de_Carlos_V.jpg" },
  { slug: "instituto-salk", name: "Instituto Salk", place: "La Jolla · Louis Kahn, 1965", author: "Codera23", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Salk_Institute_2.jpg" },
  { slug: "pampaneira", name: "Pampaneira", place: "La Alpujarra, Granada", author: "Mark Chinnick", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0", source: "https://commons.wikimedia.org/wiki/File:Pampaneira,_en_Granada_(Espa%C3%B1a).jpg" },
  { slug: "mezquita-cordoba", name: "Mezquita-Catedral", place: "Córdoba · s. VIII–X", author: "Frank Kovalchek", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0", source: "https://commons.wikimedia.org/wiki/File:Arches_in_the_Mezquita,_Cordoba,_Spain_(3317356899).jpg" },
  { slug: "torres-blancas", name: "Torres Blancas", place: "Madrid · Sáenz de Oiza, 1969", author: "Álvaro Ibáñez", license: "CC BY 2.0", licenseUrl: "https://creativecommons.org/licenses/by/2.0", source: "https://commons.wikimedia.org/wiki/File:Torres_Blancas,_Madrid_(6655439835).jpg" },
  { slug: "alhambra-sierra-nevada", name: "La Alhambra y Sierra Nevada", place: "Granada", author: "Jebulon", license: "CC0", licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/", source: "https://commons.wikimedia.org/wiki/File:Dawn_Charles_V_Palace_Alhambra_Granada_Andalusia_Spain.jpg" },
  { slug: "metropol-parasol", name: "Metropol Parasol", place: "Sevilla · Jürgen Mayer H., 2011", author: "Gzzz", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Metropol_Parasol_2019_(6).jpg" },
  { slug: "casa-cascada", name: "Casa de la Cascada", place: "Pensilvania · Frank Lloyd Wright, 1939", author: "fuzheado", license: "CC BY-SA 2.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/2.0", source: "https://commons.wikimedia.org/wiki/File:Fallingwater_20200718_1.jpg" },
  { slug: "pampaneira-barrio-bajo", name: "Barrio Bajo de Pampaneira", place: "La Alpujarra, Granada", author: "José Luis Filpo Cabana", license: "CC BY 3.0", licenseUrl: "https://creativecommons.org/licenses/by/3.0", source: "https://commons.wikimedia.org/wiki/File:Barrio_bajo,_Pampaneira.jpg" },
  { slug: "panteon-roma", name: "Panteón de Agripa", place: "Roma · s. II", author: "Livioandronico2013", license: "CC BY-SA 4.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0", source: "https://commons.wikimedia.org/wiki/File:Pantheon_(Rome)_-_Dome_interior.jpg" },
  { slug: "opera-sidney", name: "Ópera de Sídney", place: "Sídney · Jørn Utzon, 1973", author: "Matthew Field", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0", source: "https://commons.wikimedia.org/wiki/File:Sydney_opera_house_side_view.jpg" },
];

export const referenceUrl = (r: Reference) => `/references/${r.slug}.jpg`;
