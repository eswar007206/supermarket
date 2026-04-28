export type Product = {
  id: string;
  name: string;
  price: number;
  unit: string;
  image: string;
  category: string;
};

export type Category = {
  id: string;
  name: string;
  emoji: string;
  products: Product[];
};

const img = (q: string, seed: number) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=600&q=70&sig=${seed}`;

// Curated Unsplash photo IDs (food/grocery). We reuse across categories via seeds.
const POOL: string[] = [
  "photo-1560806887-1e4cd0b6cbd6",
  "photo-1519996529931-28324d5a630e",
  "photo-1546094096-0df4bcaaa337",
  "photo-1518977676601-b53f82aba655",
  "photo-1504674900247-0877df9cc836",
  "photo-1498579150354-977475b7ea0b",
  "photo-1571091718767-18b5b1457add",
  "photo-1506617420156-8e4536971650",
  "photo-1502741338009-cac2772e18bc",
  "photo-1505253468034-514d2507d914",
  "photo-1490885578174-acda8905c2c6",
  "photo-1484723091739-30a097e8f929",
  "photo-1486297678162-eb2a19b0a32d",
  "photo-1490474418585-ba9bad8fd0ea",
  "photo-1513442542250-854d436a73f2",
  "photo-1509440159596-0249088772ff",
  "photo-1464195244916-405fa0a82545",
  "photo-1528825871115-3581a5387919",
  "photo-1536304993881-ff6e9eefa2a6",
  "photo-1551024709-8f23befc6f87",
];

const pickImage = (i: number) => img(POOL[i % POOL.length], i);

type CatSpec = { name: string; emoji: string; items: { name: string; price: number; unit: string }[] };

const specs: CatSpec[] = [
  {
    name: "Fruits", emoji: "🍎", items: [
      { name: "Red Apples", price: 2.49, unit: "per kg" },
      { name: "Bananas", price: 1.19, unit: "per kg" },
      { name: "Navel Oranges", price: 2.99, unit: "per kg" },
      { name: "Strawberries", price: 3.99, unit: "250g" },
      { name: "Blueberries", price: 4.49, unit: "125g" },
      { name: "Green Grapes", price: 3.29, unit: "500g" },
      { name: "Watermelon", price: 5.99, unit: "each" },
      { name: "Pineapple", price: 4.29, unit: "each" },
      { name: "Mangoes", price: 2.19, unit: "each" },
      { name: "Kiwi Fruit", price: 0.69, unit: "each" },
      { name: "Avocados", price: 1.49, unit: "each" },
      { name: "Lemons", price: 0.49, unit: "each" },
      { name: "Pears", price: 2.59, unit: "per kg" },
      { name: "Peaches", price: 3.19, unit: "per kg" },
      { name: "Cherries", price: 6.49, unit: "500g" },
      { name: "Pomegranate", price: 3.49, unit: "each" },
      { name: "Raspberries", price: 3.99, unit: "125g" },
      { name: "Plums", price: 2.89, unit: "per kg" },
      { name: "Cantaloupe", price: 4.49, unit: "each" },
      { name: "Limes", price: 0.39, unit: "each" },
    ],
  },
  {
    name: "Vegetables", emoji: "🥬", items: [
      "Carrots|1.29|per kg","Broccoli|2.49|each","Spinach|2.19|200g","Tomatoes|2.79|per kg",
      "Cucumbers|0.99|each","Bell Peppers|1.49|each","Onions|1.19|per kg","Garlic|0.79|each",
      "Potatoes|2.99|2kg","Sweet Potatoes|2.49|per kg","Lettuce|1.99|each","Kale|2.29|bunch",
      "Zucchini|1.89|per kg","Eggplant|1.79|each","Mushrooms|2.99|250g","Cauliflower|3.49|each",
      "Celery|1.99|bunch","Green Beans|2.69|500g","Corn|0.99|each","Asparagus|3.99|bunch",
    ].map(s => { const [name,p,unit] = s.split("|"); return { name, price: +p, unit }; }),
  },
  {
    name: "Dairy & Eggs", emoji: "🥛", items: [
      "Whole Milk|1.99|1L","Skim Milk|1.89|1L","Greek Yogurt|4.49|500g","Butter|3.99|250g",
      "Cheddar Cheese|5.49|200g","Mozzarella|4.99|250g","Parmesan|6.49|150g","Cream Cheese|3.29|200g",
      "Sour Cream|2.49|300g","Heavy Cream|3.19|500ml","Large Eggs|3.99|12ct","Free-Range Eggs|5.49|12ct",
      "Feta Cheese|4.79|200g","Cottage Cheese|3.49|400g","Goat Cheese|5.99|150g","Oat Milk|3.49|1L",
      "Almond Milk|3.29|1L","Vanilla Yogurt|1.29|170g","Kefir|4.49|750ml","Ricotta|3.99|250g",
    ].map(s => { const [name,p,unit] = s.split("|"); return { name, price: +p, unit }; }),
  },
  {
    name: "Bakery", emoji: "🥖", items: [
      "Sourdough Loaf|4.49|each","Whole Wheat Bread|3.29|each","French Baguette|2.99|each","Croissants|1.79|each",
      "Bagels|4.99|6ct","English Muffins|3.49|6ct","Ciabatta|3.79|each","Rye Bread|3.99|each",
      "Chocolate Muffins|4.49|4ct","Blueberry Muffins|4.49|4ct","Dinner Rolls|3.99|8ct","Pita Bread|2.49|6ct",
      "Focaccia|5.49|each","Brioche Buns|4.79|6ct","Cinnamon Rolls|5.99|6ct","Pound Cake|6.49|each",
      "Banana Bread|5.99|each","Tortillas|2.99|10ct","Naan|3.49|2ct","Danish Pastries|1.99|each",
    ].map(s => { const [name,p,unit] = s.split("|"); return { name, price: +p, unit }; }),
  },
  {
    name: "Meat & Poultry", emoji: "🍗", items: [
      "Chicken Breast|9.99|per kg","Chicken Thighs|7.49|per kg","Whole Chicken|8.99|each","Ground Beef|11.99|per kg",
      "Ribeye Steak|24.99|per kg","Sirloin Steak|19.99|per kg","Pork Chops|12.49|per kg","Pork Belly|10.99|per kg",
      "Bacon|5.99|250g","Ham|6.49|200g","Turkey Breast|13.49|per kg","Lamb Chops|22.99|per kg",
      "Beef Mince|10.99|per kg","Chicken Wings|8.49|per kg","Sausages|6.99|500g","Salami|5.49|150g",
      "Prosciutto|7.99|100g","Hot Dogs|4.49|8ct","Meatballs|7.99|500g","Duck Breast|14.99|each",
    ].map(s => { const [name,p,unit] = s.split("|"); return { name, price: +p, unit }; }),
  },
  {
    name: "Seafood", emoji: "🐟", items: [
      "Atlantic Salmon|18.99|per kg","Tuna Steak|22.49|per kg","Cod Fillet|15.99|per kg","Shrimp|19.99|per kg",
      "Mussels|8.99|per kg","Scallops|24.99|per kg","Crab Meat|12.99|200g","Lobster Tail|18.99|each",
      "Smoked Salmon|7.99|100g","Sardines|2.99|can","Tuna in Oil|2.49|can","Anchovies|3.49|can",
      "Calamari|9.99|per kg","Sea Bass|17.49|per kg","Mackerel|10.99|per kg","Tilapia|11.49|per kg",
      "Prawns|15.99|500g","Octopus|14.99|per kg","Clams|9.49|per kg","Fish Sticks|4.99|450g",
    ].map(s => { const [name,p,unit] = s.split("|"); return { name, price: +p, unit }; }),
  },
  {
    name: "Pantry Staples", emoji: "🌾", items: [
      "Basmati Rice|6.99|1kg","Jasmine Rice|6.49|1kg","Brown Rice|5.99|1kg","Spaghetti|1.99|500g",
      "Penne Pasta|1.99|500g","All-Purpose Flour|3.49|1kg","Bread Flour|3.99|1kg","Sugar|2.49|1kg",
      "Brown Sugar|2.99|1kg","Salt|1.49|750g","Black Pepper|3.99|50g","Olive Oil|8.99|500ml",
      "Sunflower Oil|4.99|1L","Canned Tomatoes|1.29|400g","Black Beans|1.49|400g","Chickpeas|1.49|400g",
      "Lentils|2.99|500g","Quinoa|5.99|500g","Oats|3.49|1kg","Honey|6.99|500g",
    ].map(s => { const [name,p,unit] = s.split("|"); return { name, price: +p, unit }; }),
  },
  {
    name: "Snacks", emoji: "🍿", items: [
      "Potato Chips|3.49|170g","Tortilla Chips|3.99|300g","Pretzels|2.99|200g","Popcorn|2.49|100g",
      "Mixed Nuts|7.99|300g","Almonds|8.49|250g","Cashews|9.99|250g","Trail Mix|5.99|200g",
      "Granola Bars|4.49|6ct","Chocolate Bar|2.49|100g","Dark Chocolate|3.99|100g","Cookies|3.49|300g",
      "Crackers|2.99|200g","Rice Cakes|2.49|100g","Beef Jerky|5.99|80g","Dried Mango|4.99|150g",
      "Raisins|3.49|250g","Pistachios|9.49|250g","Gummy Bears|2.99|200g","Pita Chips|3.99|200g",
    ].map(s => { const [name,p,unit] = s.split("|"); return { name, price: +p, unit }; }),
  },
  {
    name: "Beverages", emoji: "🥤", items: [
      "Orange Juice|4.49|1L","Apple Juice|3.99|1L","Cola|1.99|2L","Lemon-Lime Soda|1.99|2L",
      "Sparkling Water|1.49|1L","Still Water|0.99|1.5L","Iced Tea|3.49|1L","Cold Brew Coffee|4.99|500ml",
      "Green Tea|3.99|20 bags","Black Tea|3.49|40 bags","Instant Coffee|7.99|200g","Ground Coffee|9.99|250g",
      "Energy Drink|2.49|500ml","Sports Drink|1.99|600ml","Almond Milk Latte|3.99|250ml","Kombucha|3.49|480ml",
      "Coconut Water|2.99|500ml","Lemonade|3.29|1L","Hot Chocolate|4.99|300g","Tonic Water|1.99|1L",
    ].map(s => { const [name,p,unit] = s.split("|"); return { name, price: +p, unit }; }),
  },
  {
    name: "Frozen Foods", emoji: "🧊", items: [
      "Frozen Pizza|5.99|each","Frozen Lasagna|7.49|each","Frozen Peas|2.49|500g","Frozen Corn|2.29|500g",
      "Mixed Vegetables|2.99|750g","Frozen Berries|4.99|400g","Ice Cream Vanilla|5.99|1L","Ice Cream Chocolate|5.99|1L",
      "Frozen Waffles|3.99|10ct","Frozen Fries|3.49|1kg","Chicken Nuggets|6.99|700g","Fish Fillets|7.99|450g",
      "Frozen Dumplings|5.49|400g","Frozen Burritos|4.99|4ct","Veggie Burgers|5.99|4ct","Frozen Shrimp|10.99|500g",
      "Frozen Spinach|2.49|400g","Puff Pastry|3.99|400g","Frozen Yogurt|4.99|500ml","Frozen Garlic Bread|3.49|each",
    ].map(s => { const [name,p,unit] = s.split("|"); return { name, price: +p, unit }; }),
  },
  {
    name: "Breakfast & Cereal", emoji: "🥣", items: [
      "Corn Flakes|4.49|500g","Granola|5.99|500g","Muesli|6.49|500g","Oatmeal|3.99|500g",
      "Frosted Flakes|4.99|500g","Cheerios|5.49|400g","Rice Krispies|4.79|400g","Honey Nut Cereal|5.29|450g",
      "Chocolate Cereal|5.49|400g","Pancake Mix|3.99|500g","Maple Syrup|7.99|250ml","Peanut Butter|5.49|500g",
      "Almond Butter|8.99|340g","Strawberry Jam|3.49|370g","Marmalade|3.99|370g","Nutella|5.99|350g",
      "Instant Oatmeal|4.49|10ct","Breakfast Bars|4.99|6ct","Protein Cereal|7.49|400g","Granola Clusters|5.99|400g",
    ].map(s => { const [name,p,unit] = s.split("|"); return { name, price: +p, unit }; }),
  },
  {
    name: "Condiments & Sauces", emoji: "🧂", items: [
      "Ketchup|3.49|500ml","Mayonnaise|4.99|500ml","Mustard|2.99|250ml","BBQ Sauce|3.99|500ml",
      "Hot Sauce|3.49|250ml","Soy Sauce|3.99|500ml","Teriyaki Sauce|4.49|300ml","Worcestershire|4.29|300ml",
      "Sriracha|4.99|500ml","Pesto|5.49|190g","Tomato Sauce|2.99|680g","Alfredo Sauce|4.49|400g",
      "Salsa|3.99|450g","Guacamole|4.99|250g","Hummus|3.99|250g","Tahini|6.49|300g",
      "Balsamic Vinegar|5.99|500ml","Apple Cider Vinegar|4.49|500ml","Ranch Dressing|3.99|450ml","Italian Dressing|3.49|450ml",
    ].map(s => { const [name,p,unit] = s.split("|"); return { name, price: +p, unit }; }),
  },
  {
    name: "Household & Cleaning", emoji: "🧽", items: [
      "Dish Soap|3.49|750ml","Laundry Detergent|12.99|2L","Fabric Softener|7.99|1.5L","Bleach|3.99|1.5L",
      "All-Purpose Cleaner|4.49|750ml","Glass Cleaner|3.99|500ml","Floor Cleaner|5.49|1L","Toilet Cleaner|3.49|750ml",
      "Paper Towels|8.99|6ct","Toilet Paper|9.99|12ct","Facial Tissues|2.99|box","Trash Bags|6.99|30ct",
      "Aluminum Foil|4.49|roll","Plastic Wrap|3.99|roll","Ziplock Bags|4.99|50ct","Sponges|3.49|6ct",
      "Rubber Gloves|2.99|pair","Air Freshener|4.49|each","Dishwasher Tabs|8.99|40ct","Laundry Pods|11.99|35ct",
    ].map(s => { const [name,p,unit] = s.split("|"); return { name, price: +p, unit }; }),
  },
  {
    name: "Personal Care", emoji: "🧴", items: [
      "Shampoo|6.99|400ml","Conditioner|6.99|400ml","Body Wash|5.49|500ml","Bar Soap|1.99|each",
      "Toothpaste|3.99|100ml","Toothbrush|2.99|each","Mouthwash|4.99|500ml","Dental Floss|3.49|each",
      "Deodorant|4.99|each","Body Lotion|7.49|400ml","Hand Sanitizer|3.99|250ml","Hand Cream|4.99|100ml",
      "Razor|8.99|each","Shaving Cream|4.49|200ml","Face Wash|6.99|150ml","Sunscreen SPF 50|9.99|200ml",
      "Lip Balm|2.49|each","Cotton Pads|3.49|100ct","Cotton Swabs|2.99|200ct","Shower Gel|5.99|500ml",
    ].map(s => { const [name,p,unit] = s.split("|"); return { name, price: +p, unit }; }),
  },
  {
    name: "Baby Care", emoji: "🍼", items: [
      "Diapers Size 1|24.99|60ct","Diapers Size 2|24.99|54ct","Diapers Size 3|24.99|48ct","Baby Wipes|4.99|80ct",
      "Baby Lotion|5.49|300ml","Baby Shampoo|5.99|300ml","Baby Oil|4.99|200ml","Baby Powder|3.99|200g",
      "Infant Formula|29.99|900g","Baby Cereal|4.99|250g","Baby Puree Apple|1.49|120g","Baby Puree Pear|1.49|120g",
      "Baby Puree Carrot|1.49|120g","Teething Biscuits|3.99|180g","Baby Yogurt|2.99|4ct","Baby Juice|2.49|200ml",
      "Pacifier|4.99|each","Baby Bottle|7.99|each","Sippy Cup|6.49|each","Diaper Cream|6.99|113g",
    ].map(s => { const [name,p,unit] = s.split("|"); return { name, price: +p, unit }; }),
  },
];

let counter = 0;
export const CATALOG: Category[] = specs.map((c) => ({
  id: c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  name: c.name,
  emoji: c.emoji,
  products: c.items.map((p) => {
    const idx = counter++;
    return {
      id: `p-${idx}`,
      name: p.name,
      price: p.price,
      unit: p.unit,
      image: pickImage(idx),
      category: c.name,
    };
  }),
}));

export const ALL_PRODUCTS: Record<string, Product> = CATALOG.reduce(
  (acc, cat) => {
    cat.products.forEach((p) => (acc[p.id] = p));
    return acc;
  },
  {} as Record<string, Product>,
);
