const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("../models/product.models");

const products = [
  {
    name: "Nova X1 Phone",
    description: "6.5 inch display, 128GB storage, dual camera.",
    price: 89999,
    stock: 24,
    category: "phones",
    imageUrl: "https://images.unsplash.com/photo-1565205053315-c52c1e9c5112?w=1200&q=80&auto=format&fit=crop", // Unsplash, Leon Seibert
  },
  {
    name: "Nova X1 Pro",
    description: "6.7 inch display, 256GB storage, 5G.",
    price: 119999,
    stock: 12,
    category: "phones",
    imageUrl: "https://images.unsplash.com/photo-1789856922540-3aff6e079111?w=1200&q=80&auto=format&fit=crop", // Unsplash, Samuel Angor
  },
  {
    name: "Pulse Mini Phone",
    description: "Compact phone with a two-day battery.",
    price: 44999,
    stock: 40,
    category: "phones",
    imageUrl: "https://images.unsplash.com/photo-1624204732340-53f862f007cf?w=1200&q=80&auto=format&fit=crop", // Unsplash, Mark Chan
  },
  {
    name: "Pulse Fold",
    description: "Foldable screen with a cover display.",
    price: 189999,
    stock: 6,
    category: "phones",
    imageUrl: "https://images.unsplash.com/photo-1724323184361-539f7d8b3b01?w=1200&q=80&auto=format&fit=crop", // Unsplash, Amanz
  },
  {
    name: "LumenBook 14",
    description: "14 inch laptop, 16GB memory, 512GB SSD.",
    price: 149999,
    stock: 15,
    category: "computers",
    imageUrl: "https://images.unsplash.com/photo-1520583457224-aee11bad5112?w=1200&q=80&auto=format&fit=crop", // Unsplash, AltumCode
  },
  {
    name: "LumenBook 16",
    description: "16 inch laptop for design and development.",
    price: 199999,
    stock: 8,
    category: "computers",
    imageUrl: "https://images.unsplash.com/photo-1610465299993-e6675c9f9efa?w=1200&q=80&auto=format&fit=crop", // Unsplash, Martin Sanchez
  },
  {
    name: "DeskMini Tower",
    description: "Small desktop with room for an extra drive.",
    price: 109999,
    stock: 10,
    category: "computers",
    imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=1200&q=80&auto=format&fit=crop", // Unsplash, Christian Wiediger
  },
  {
    name: "PixelView 27 Monitor",
    description: "27 inch 144Hz monitor with USB-C.",
    price: 59999,
    stock: 18,
    category: "computers",
    imageUrl: "https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?w=1200&q=80&auto=format&fit=crop", // Unsplash, Jack B
  },
  {
    name: "Aero Buds",
    description: "Wireless earbuds with a charging case.",
    price: 14999,
    stock: 60,
    category: "audio",
    imageUrl: "https://images.unsplash.com/photo-1578319439584-104c94d37305?w=1200&q=80&auto=format&fit=crop", // Unsplash, Roger Cai
  },
  {
    name: "Aero Buds Pro",
    description: "Noise cancelling earbuds with wireless charging.",
    price: 24999,
    stock: 35,
    category: "audio",
    imageUrl: "https://images.unsplash.com/photo-1722439667098-f32094e3b1d4?w=1200&q=80&auto=format&fit=crop", // Unsplash, Arjun Anil
  },
  {
    name: "Harbor Speaker",
    description: "Portable Bluetooth speaker, water resistant.",
    price: 19999,
    stock: 28,
    category: "audio",
    imageUrl: "https://images.unsplash.com/photo-1507878566509-a0dbe19677a5?w=1200&q=80&auto=format&fit=crop", // Unsplash, Jonas Jacobsson
  },
  {
    name: "Studio Headphones",
    description: "Over-ear headphones for music and calls.",
    price: 32999,
    stock: 22,
    category: "audio",
    imageUrl: "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=1200&q=80&auto=format&fit=crop", // Unsplash, Frank Septillion
  },
  {
    name: "Arcade Pad",
    description: "Wireless controller for PC and console.",
    price: 9999,
    stock: 50,
    category: "gaming",
    imageUrl: "https://images.unsplash.com/photo-1585620385456-4759f9b5c7d9?w=1200&q=80&auto=format&fit=crop", // Unsplash, Jose Gil
  },
  {
    name: "Arcade Headset",
    description: "Gaming headset with a flip microphone.",
    price: 17999,
    stock: 30,
    category: "gaming",
    imageUrl: "https://images.unsplash.com/photo-1610041321327-b794c052db27?w=1200&q=80&auto=format&fit=crop", // Unsplash, Fausto Sandoval
  },
  {
    name: "Keylight Keyboard",
    description: "Mechanical keyboard with white backlight.",
    price: 15999,
    stock: 26,
    category: "gaming",
    imageUrl: "https://images.unsplash.com/photo-1560457079-9a6532ccb118?w=1200&q=80&auto=format&fit=crop", // Unsplash, Sam Albury
  },
  {
    name: "Swift Mouse",
    description: "Lightweight wireless mouse, 6 buttons.",
    price: 7999,
    stock: 45,
    category: "gaming",
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=1200&q=80&auto=format&fit=crop", // Unsplash, Pascal M.
  },
  {
    name: "Charge Brick 30W",
    description: "USB-C wall charger for phones and laptops.",
    price: 4999,
    stock: 80,
    category: "accessories",
    imageUrl: "https://images.unsplash.com/photo-1586254116951-5263e2cdb44c?w=1200&q=80&auto=format&fit=crop", // Unsplash, Markus Winkler
  },
  {
    name: "Braided USB-C Cable",
    description: "2 meter USB-C cable with a nylon braid.",
    price: 1999,
    stock: 120,
    category: "accessories",
    imageUrl: "https://images.unsplash.com/photo-1595756630452-736bc8ef3693?w=1200&q=80&auto=format&fit=crop", // Unsplash, Mika Baumeister
  },
  {
    name: "Clear Phone Case",
    description: "Shock-absorbing clear case.",
    price: 2499,
    stock: 90,
    category: "accessories",
    imageUrl: "https://images.unsplash.com/photo-1583291023438-41cef6453b1f?w=1200&q=80&auto=format&fit=crop", // Unsplash, LARS KAIZER
  },
  {
    name: "Laptop Sleeve 14",
    description: "Padded sleeve for a 14 inch laptop.",
    price: 3999,
    stock: 40,
    category: "accessories",
    imageUrl: "https://images.unsplash.com/photo-1689757855413-9e366c2011f1?w=1200&q=80&auto=format&fit=crop", // Unsplash, Ocult Store
  },
];

const seedProducts = async () => {
  await mongoose.connect(process.env.MONGODB_URL);

  // Insert missing products; refresh only the photo on existing ones so their ids stay the same.
  for (const { imageUrl, ...product } of products) {
    await Product.updateMany(
      { name: product.name },
      { $setOnInsert: product, $set: { imageUrl } },
      { upsert: true },
    );
  }

  const count = await Product.countDocuments({ name: { $in: products.map((item) => item.name) } });
  console.log(`Seeded products present: ${count}`);
  await mongoose.disconnect();
};

seedProducts().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
