export const CATEGORIES = [
  {
    id: "phones",
    index: "01",
    title: "Phones",
    hero: "Nova X1 Phone",
    line: "The object in your hand for most of the day.",
    color: "#5ef2ff",
  },
  {
    id: "computers",
    index: "02",
    title: "Computers",
    hero: "LumenBook 16",
    line: "Where the work actually sits.",
    color: "#9b7bff",
  },
  {
    id: "audio",
    index: "03",
    title: "Audio",
    hero: "Studio Headphones",
    line: "Sound you wear, or set on a table.",
    color: "#ff6ad5",
  },
  {
    id: "gaming",
    index: "04",
    title: "Gaming",
    hero: "Arcade Pad",
    line: "The controls around the screen.",
    color: "#7dffb3",
  },
  {
    id: "accessories",
    index: "05",
    title: "Accessories",
    hero: "Laptop Sleeve 14",
    line: "Cables, cases, and the rest of the kit.",
    color: "#ffb86b",
  },
];

export const categoryById = (id) => CATEGORIES.find((item) => item.id === id) || CATEGORIES[0];
