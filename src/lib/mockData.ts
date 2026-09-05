export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  images: string[];
  stock: number;
  isPopular?: boolean;
  isNew?: boolean;
  flavorOptions?: string[];
  weightOptions?: string[];
  sizeOptions?: { name: string; price: number }[];
  availability?: Record<'attock' | 'kamra', boolean>;
}

export const CATEGORIES = [
  "Cakes World",
  "Special Cakes",
  "Dream Cakes",
  "Donuts",
  "Brownies",
  "Bakery Items & Desserts"
];

export const PRODUCTS: Product[] = [
  // --- Cakes World ---
  {
    id: "cw1",
    name: "Lotus Cake",
    category: "Cakes World",
    description: "Premium sponge cake crafted with rich Lotus Biscoff flavor and creamy spread.",
    price: 2590,
    rating: 4.9,
    reviews: 145,
    images: ["/images/prod_lotus_biscoff_1783112213131.png"],
    stock: 20,
    isPopular: true
  },
  {
    id: "cw2",
    name: "Belgium Malt Cake",
    category: "Cakes World",
    description: "A delightful blend of Belgian chocolate and malted goodness.",
    price: 2480,
    rating: 4.8,
    reviews: 89,
    images: ["/images/prod_belgian_choc_1783112204857.png"],
    stock: 15
  },
  {
    id: "cw3",
    name: "Ferrero Rocher Cake",
    category: "Cakes World",
    description: "Decadent hazelnut chocolate cake topped with authentic Ferrero Rocher.",
    price: 2480,
    rating: 4.9,
    reviews: 210,
    images: ["/images/prod_ferrero_rocher_1783112221919.png"],
    stock: 12,
    isPopular: true
  },
  {
    id: "cw4",
    name: "Nutella Cake",
    category: "Cakes World",
    description: "Rich chocolate sponge layered generously with pure Nutella.",
    price: 2750,
    rating: 4.8,
    reviews: 175,
    images: ["/images/prod_choc_truffle_1783112196918.png"],
    stock: 18
  },
  {
    id: "cw5",
    name: "Red Velvet Cake",
    category: "Cakes World",
    description: "Classic smooth red velvet with our signature cream cheese frosting.",
    price: 2150,
    rating: 4.7,
    reviews: 132,
    images: ["/images/prod_red_velvet_1783112239348.png"],
    stock: 25
  },
  {
    id: "cw6",
    name: "Kit Kat Cake",
    category: "Cakes World",
    description: "Chocolate dream surrounded by crunchy Kit Kat wafers.",
    price: 2350,
    rating: 4.6,
    reviews: 95,
    images: ["/images/prod_choc_truffle_1783112196918.png"],
    stock: 10
  },
  {
    id: "cw7",
    name: "Fudge Cake",
    category: "Cakes World",
    description: "Deep, dark, and intensely fudgy chocolate cake.",
    price: 2350,
    rating: 4.8,
    reviews: 144,
    images: ["/images/prod_choc_truffle_1783112196918.png"],
    stock: 14,
    isPopular: true
  },
  {
    id: "cw8",
    name: "Chocolate Mousse Cake",
    category: "Cakes World",
    description: "Light, airy, and creamy chocolate mousse layered cake.",
    price: 2350,
    rating: 4.7,
    reviews: 88,
    images: ["/images/prod_choc_truffle_1783112196918.png"],
    stock: 12
  },
  {
    id: "cw9",
    name: "NY Cheese Cake",
    category: "Cakes World",
    description: "Classic dense and creamy New York style cheesecake.",
    price: 3800,
    rating: 4.9,
    reviews: 205,
    images: ["/images/prod_blueberry_cheesecake_1783112247681.png"],
    stock: 8,
    isPopular: true
  },
  {
    id: "cw10",
    name: "Pine Apple Cake",
    category: "Cakes World",
    description: "Soft vanilla sponge soaked in pineapple juice with fresh chunks.",
    price: 2350,
    rating: 4.5,
    reviews: 110,
    images: ["/images/prod_bento_cake_1783112265061.png"],
    stock: 15
  },
  {
    id: "cw11",
    name: "Black Forest Cake",
    category: "Cakes World",
    description: "Classic chocolate sponge, whipped cream, and cherry filling.",
    price: 2350,
    rating: 4.6,
    reviews: 150,
    images: ["/images/prod_choc_truffle_1783112196918.png"],
    stock: 20
  },
  {
    id: "cw12",
    name: "Cadbury Cake",
    category: "Cakes World",
    description: "Smooth and creamy milk chocolate cake inspired by Cadbury.",
    price: 2350,
    rating: 4.8,
    reviews: 165,
    images: ["/images/prod_choc_truffle_1783112196918.png"],
    stock: 18
  },

  // --- Special Cakes ---
  {
    id: "sc1",
    name: "Pistachio Cake",
    category: "Special Cakes",
    description: "Exquisite cake made with premium roasted pistachios.",
    price: 2850,
    rating: 4.9,
    reviews: 85,
    images: ["/images/prod_pistachio_dream_1783112230661.png"],
    stock: 10,
    isPopular: true
  },
  {
    id: "sc2",
    name: "Lava Cake",
    category: "Special Cakes",
    description: "Molten chocolate center that oozes perfectly when sliced.",
    price: 2350,
    rating: 4.8,
    reviews: 210,
    images: ["/images/prod_choc_truffle_1783112196918.png"],
    stock: 15
  },
  {
    id: "sc3",
    name: "Salted Caramel Cake",
    category: "Special Cakes",
    description: "Sweet and salty perfection with layers of rich caramel.",
    price: 2480,
    rating: 4.7,
    reviews: 94,
    images: ["/images/prod_gold_leaf_1783112275495.png"],
    stock: 12
  },
  {
    id: "sc4",
    name: "Mud Cake",
    category: "Special Cakes",
    description: "Dense, intensely rich chocolate mud cake.",
    price: 2350,
    rating: 4.8,
    reviews: 130,
    images: ["/images/prod_choc_truffle_1783112196918.png"],
    stock: 14
  },
  {
    id: "sc5",
    name: "Tiramisu Cake",
    category: "Special Cakes",
    description: "Italian classic with coffee-soaked layers and mascarpone.",
    price: 2350,
    rating: 4.9,
    reviews: 180,
    images: ["/images/prod_choc_truffle_1783112196918.png"],
    stock: 10
  },

  // --- Dream Cakes ---
  {
    id: "dc1",
    name: "Signature Dream Cake",
    category: "Dream Cakes",
    description: "Our famous multi-layered dream cake available in various sizes.",
    price: 690, // Base price (Small)
    rating: 4.9,
    reviews: 350,
    images: ["/images/cat_brownies_1783112170945.png"],
    stock: 30,
    isPopular: true,
    flavorOptions: ["Lotus", "Three Milk Chocolate"],
    sizeOptions: [
      { name: "Small (S)", price: 690 },
      { name: "Medium (M)", price: 1250 },
      { name: "Large (L)", price: 2480 }
    ]
  },

  // --- Donuts & Brownies ---
  {
    id: "do1",
    name: "Attock Cake Delight Donut",
    category: "Donuts",
    description: "Freshly fried, soft and fluffy donuts available in multiple glazes.",
    price: 190,
    rating: 4.6,
    reviews: 112,
    images: ["/images/prod_choc_truffle_1783112196918.png"],
    stock: 50,
    flavorOptions: [
      "Chocolate", "Cotton Candy", "Ferrero Rocher", "Kit Kat", "Lotus", 
      "Matt Chocolate", "Nutella", "Oreo", "Glazzy", "Strawberry"
    ]
  },
  {
    id: "br1",
    name: "Attock Cake Delight Brownie",
    category: "Brownies",
    description: "Gooey, decadent brownies baked fresh daily.",
    price: 230,
    rating: 4.8,
    reviews: 245,
    images: ["/images/cat_brownies_1783112170945.png"],
    stock: 40,
    isPopular: true,
    flavorOptions: [
      "Chocolate Brownie", "Nutella Brownie", "Fudge", 
      "Belgian Malt", "Walnut", "Special Brownie", "Cadbury"
    ]
  },

  // --- Bakery Items & Desserts ---
  {
    id: "bi1",
    name: "Macarons (Pack of 6)",
    category: "Bakery Items & Desserts",
    description: "Delicate French macarons with crisp shells and soft fillings.",
    price: 350,
    rating: 4.7,
    reviews: 180,
    images: ["/images/prod_macarons_1783112256364.png"],
    stock: 25,
    isPopular: true
  },
  {
    id: "bi2",
    name: "Cookies",
    category: "Bakery Items & Desserts",
    description: "Freshly baked chunky cookies.",
    price: 250,
    rating: 4.5,
    reviews: 88,
    images: ["/images/cat_gift_boxes_1783112178444.png"],
    stock: 45
  },
  {
    id: "bi3",
    name: "Muffins",
    category: "Bakery Items & Desserts",
    description: "Soft and fluffy breakfast muffins.",
    price: 290,
    rating: 4.6,
    reviews: 70,
    images: ["/images/cat_brownies_1783112170945.png"],
    stock: 30
  },
  {
    id: "bi4",
    name: "Tarts",
    category: "Bakery Items & Desserts",
    description: "Buttery tart shells filled with sweet cream and fruits or chocolate.",
    price: 190,
    rating: 4.8,
    reviews: 65,
    images: ["/images/prod_strawberry_cheesecake_1783112291552.png"],
    stock: 20
  },
  {
    id: "bi5",
    name: "Fresh Bread",
    category: "Bakery Items & Desserts",
    description: "Warm, freshly baked loaf bread.",
    price: 150,
    rating: 4.5,
    reviews: 110,
    images: ["/images/cat_brownies_1783112170945.png"],
    stock: 25,
    flavorOptions: ["Banana Bread", "Carrot Bread"]
  },
  {
    id: "bi6",
    name: "Cup Cakes",
    category: "Bakery Items & Desserts",
    description: "Classic cupcakes with rich frosting.",
    price: 230,
    rating: 4.7,
    reviews: 135,
    images: ["/images/prod_red_velvet_1783112239348.png"],
    stock: 40
  },
  {
    id: "bi7",
    name: "Sundae",
    category: "Bakery Items & Desserts",
    description: "Cool and refreshing dessert sundaes in various premium flavors.",
    price: 370,
    rating: 4.9,
    reviews: 210,
    images: ["/images/prod_blueberry_cheesecake_1783112247681.png"],
    stock: 35,
    isPopular: true,
    flavorOptions: ["Red Velvet", "Three Milk", "Nutella", "Lotus", "Pistachio"]
  }
];
