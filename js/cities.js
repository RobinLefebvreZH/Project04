export const CITIES = {
  zurich: {
    names: { en: 'Zurich', de: 'Zürich', fr: 'Zurich', it: 'Zurigo' },
    price: 16559, rent: 26.5, growth: 0.0037, heat: [13000, 27000], start: /Grossmünster/,
  },
  geneva: {
    names: { en: 'Geneva', de: 'Genf', fr: 'Genève', it: 'Ginevra' },
    price: 17145, rent: 501 / 12, growth: 0.0021, heat: [12000, 23000], start: /Saint-Pierre|Cathédrale/,
  },
  lausanne: {
    names: { en: 'Lausanne', de: 'Lausanne', fr: 'Lausanne', it: 'Losanna' },
    price: 14388, rent: 328 / 12, growth: 0.0021, heat: [10000, 19000], start: /Cathédrale/,
  },
  zug: {
    names: { en: 'Zug', de: 'Zug', fr: 'Zoug', it: 'Zugo' },
    price: 17059, rent: 405 / 12, growth: 0.005, heat: [12000, 23000], start: /Zytturm|St\. ?Oswald/,
  },
  lucerne: {
    names: { en: 'Lucerne', de: 'Luzern', fr: 'Lucerne', it: 'Lucerna' },
    price: 14124, rent: 299 / 12, growth: 0.0042, heat: [10000, 19000], start: /Kapellbrücke|Jesuitenkirche/,
  },
  basel: {
    names: { en: 'Basel', de: 'Basel', fr: 'Bâle', it: 'Basilea' },
    price: 11937, rent: 336 / 12, growth: 0.0021, heat: [8500, 16000], start: /Münster/,
  },
  bern: {
    names: { en: 'Bern', de: 'Bern', fr: 'Berne', it: 'Berna' },
    price: 7763, rent: 272 / 12, growth: 0.0021, heat: [5500, 10500], start: /Bundeshaus|Zytglogge/,
  },
  stgallen: {
    names: { en: 'St. Gallen', de: 'St. Gallen', fr: 'Saint-Gall', it: 'San Gallo' },
    price: 9151, rent: 275 / 12, growth: 0.0033, heat: [6500, 12500], start: /Kathedrale|Stiftsbezirk/,
  },
  lugano: {
    names: { en: 'Lugano', de: 'Lugano', fr: 'Lugano', it: 'Lugano' },
    price: 8091, rent: 260 / 12, growth: -0.003, heat: [5500, 11000], start: /Cattedrale|San Lorenzo/,
  },
};

export const CITY_KEYS = Object.keys(CITIES);

export function grossYield(key) {
  const c = CITIES[key];
  return (c.rent * 12) / c.price;
}
