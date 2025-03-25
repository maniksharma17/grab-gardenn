import { CartItem, Product } from "./types";

export const products: Product[] = [
  {
    id: 1,
    name: "Finger Millet Flour",
    hindiName: "Mandua, Ragi, Koda",
    description: `Finger millet flour is a powerhouse of nutrition, known for its rich fiber, protein, and essential minerals like calcium and iron. This wholesome flour is a perfect choice for those seeking a healthy and balanced diet. 

      Carefully milled to retain its natural goodness, finger millet atta offers the perfect blend of nutrition and convenience. It serves as a nutrient-dense alternative to regular flours, supporting overall well-being and an active lifestyle. Ideal for various culinary creations, it enhances both taste and health in every meal. Plus, it seamlessly fits into vegetarian and vegan diets, making it a versatile staple for health-conscious individuals.
      `,
    cutoffPrice: [300, 600, 1000],
    rating: 4.8,
    category: "Flour",
    image: "/product/IMG_6281.jpg",
    variants: ["500g", "1kg", "2kg"],
    price: [250, 500, 900],
    benefits: [
      "Improves digestion",
      "Prevents heart disease",
      "Anti-aging properties",
      "Controls diabetes",
      "Strengthens bones",
      "Supports weight loss",
    ],
    ingredients: ["Finger millet"],
    storage: "Store in a cool and dry place in an airtight container.",
  },
  {
    id: 2,
    name: "Barnyard Millet",
    hindiName: "Jhangora",
    description: `
    Our Jhangora (Barnyard Millet) is a nutritional powerhouse that brings wholesome goodness to your table. This ancient grain is gluten-free, rich in fiber, and packed with essential nutrients. Whether you're looking to diversify your diet or cater to specific health needs, our Jhangora stands as a versatile and nutritious choice. Elevate your culinary experience with this ancient grain, promoting both taste and well-being in every bite. It complements to both vegetarian and vegan diets. It is also known ‘Vrat Ke Chawal’ (shymaka).
    `,
    price: [190, 270],
    cutoffPrice: [230, 340],
    rating: 4.6,
    category: "Grains",
    image: "/product/IMG_6286.jpg",
    variants: ["500g", "1kg"],
    benefits: [
      "Rich in fiber",
      "Great rice alternative for diabetics",
      "Useful in jaundice treatment",
      "Good source of antioxidants",
    ],
    ingredients: ["Barnyard millet"],
    storage: "Store in a cool and dry place.",
  },
  {
    id: 3,
    name: "Horse Gram",
    hindiName: "Kulath",
    description: `
    Horse Gram or Kulath/Gahat as it is locally known, is a much preferred ‘pulse’ of Uttaranchal. It is also renowned for its perceived medicinal properties – used for relief from arthritis and kidney stones. It is a source of proteins and other nutrients. The whole grain is soaked then fried or boiled to make dal or soup. It is grown at an altitude ranging from 1200m to 1800m above sea level.
`,
    price: [250, 500],
    cutoffPrice: [320, 600],
    rating: 4.5,
    category: "Pulses",
    image: "/product/IMG_6291.jpg",
    variants: ["500g", "1kg"],
    benefits: [
      "Facilitates kidney stone breakdown",
      "Anti-diabetic and anti-ulcer properties",
      "Boosts immunity",
      "Relieves arthritis",
      "Aids in piles treatment",
      "Helps with menstrual troubles",
    ],
    ingredients: ["Horse gram"],
    storage: "Store in a cool and dry place in an airtight container.",
  },
  {
    id: 4,
    name: "Pahadi White Soyabean",
    description: `
    Pahadi white Soybean also known as Bhatmaas cultivated in the mountainous regions of India, this is a nutritional powerhouse revered for its unique taste and health benefits. Their nutty flavor and versatile nature make them ideal for various culinary creations, from soups and stews to salads and spreads. Soybeans, with their robust nutritional profile and distinct taste, offer a wholesome addition to meals, embodying the essence of mountain-grown goodness in every bite, while contributing to a well-rounded and flavorful diet.
    A very popular preparation made from it is a soup which is prepared by boiling it with other pulses like Gahat and Chickpeas and the soup is cooked with rice flour in an iron ‘kadai’ to make an almost oil less iron rich soup.
    `,
    price: [250, 500, 900],
    cutoffPrice: [300, 600, 1000],
    rating: 4.7,
    category: "Pulses",
    image: "/product/IMG_6278.jpg",
    variants: ["500g", "1kg", "2kg"],
    benefits: [
      "Rich in Vitamin A & B",
      "Supports heart health",
      "Aids digestion",
    ],
    ingredients: ["White soyabean"],
    storage: "Store in a cool and dry place in an airtight container.",
  },
  {
    id: 5,
    name: "Perilla Seeds",
    hindiName: "Bhangjeera",
    description: `
    Perilla Seeds are considered as nutritional gem that enhances your well-being with every serving. These tiny seeds are a pack of powerful punch of nutrients, offering a myriad of health advantages. Rich in omega-3 fatty acids and antioxidants, Perilla Seeds contribute to heart health and inflammation reduction.
    Their nutty flavor and versatility make them an excellent addition to various dishes, whether sprinkled atop salads, blended into smoothies, or incorporated into baked goods. Gluten-free and brimming with essential minerals and vitamins, Perilla Seeds are a smart choice for those seeking a diverse and wholesome diet.
    `,
    price: [400, 700],
    cutoffPrice: [480, 800],
    rating: 4.9,
    category: "Seeds",
    image: "/product/IMG_6291.JPG",
    variants: ["250g", "500g"],
    benefits: [
      "Rich in omega-3 fatty acids",
      "High in antioxidants",
      "Supports heart health",
      "Reduces inflammation",
    ],
    ingredients: ["Perilla seeds"],
    storage: "Store in a cool and dry place in an airtight container.",
  },
  {
    id: 6,
    name: "Naurangi Dal",
    description: `Naurangi Dal, originating from the mountainous terrains of India, is a vibrant blend of nine assorted lentils, each contributing a unique flavour and nutritional profile. This colourful medley includes lentils like red and green gram, chickpeas, and more, offering a diverse range of textures and tastes. Brimming with protein, fibre, and essential minerals, this dal the goodness of multiple legumes in one hearty dish. Its versatility shines in various regional cuisines, from soups to Savory stews. Pahadi Naurangi Dal not only tantalizes taste buds but also delivers a wholesome and nourishing dining experience, reflecting the rich tapestry of flavours from the mountains in every delighted spoonful.
`,
    price: [320, 510],
    cutoffPrice: [390, 600],
    rating: 4.6,
    category: "Pulses",
    image: "/product/IMG_6273.jpg",
    variants: ["500g", "1kg"],
    benefits: [
      "Supports muscle repair and growth",
      "Aids digestion",
      "Good for bone health",
    ],
    ingredients: ["Naurangi Dal"],
    storage: "Store in a cool and dry place in an airtight container.",
  },
  {
    id: 7,
    name: "Pigeon Pea (Toor Dal)",
    description: `
    Pahadi Toor Dal, derived from mountainous Indian regions, embodies robust flavor and rich nutrition. A cherished legume, it's a protein powerhouse ideal for vegetarian diets. Its earthy profile and adeptness in absorbing flavors make it a versatile culinary staple. From traditional stews to inventive salads, this dal's versatility shines. Cultivated in pristine mountain terrains, it not only delights taste buds but also offers essential nutrients, embodying the essence of hearty, wholesome meals. Embrace Pahadi Toor Dal in your cooking for a taste of the mountains' authenticity, encapsulating a world of flavor and nutrition in every spoonful.
`,
    price: [300, 500],
    cutoffPrice: [360, 600],
    rating: 4.7,
    category: "Pulses",
    image: "/product/IMG_6273.jpg",
    variants: ["500g", "1kg"],
    benefits: ["Antioxidant properties", "Low Glycemic Index"],
    ingredients: ["Pigeon Pea"],
    storage: "Store in an airtight container in a cool and dry place.",
  },
  {
    id: 8,
    name: "Pahadi Black Urad",
    description: `Pahadi Black Urad, indigenous to the mountainous terrains of India, presents a culinary delight and nutritional treasure. These dark-hued lentils, also known as black gram or black matpe beans, offer a rich source of protein, fiber, and essential minerals. Renowned for their earthy flavor and creamy texture, they enhance diverse dishes like savory curries, hearty stews, and delectable dips. Black Urad's versatility in cuisine and its nutrient-packed profile contribute not only to taste but also to a balanced, nourishing diet. 
`,
    price: [320, 600],
    cutoffPrice: [380, 700],
    rating: 4.6,
    category: "Pulses",
    image: "/product/IMG_6278.jpg",
    variants: ["500g", "1kg"],
    benefits: [
      "Aids gut health",
      "Regulates blood sugar levels",
      "Supports energy metabolism",
    ],
    ingredients: ["Black Urad"],
    storage: "Store in a cool and dry place.",
  },
  {
    id: 9,
    name: "Rlli Milli Dal (Mix Dal)",
    description: `Our Rlli Milli dal is a combination of three pulses (Dhuli Urad Dal + Chana Dal+ Dhuli Masoor Dal). This combination of dal was cooked by our Great Grandmothers and now we are packing the same ratio and delivering it to you. 
Traditionally, this dal was cooked in villages on clay stove (Chulla) in earthen pot (Handi) which enhances its taste as well as its nutritional values.
`,
    price: [350, 650],
    cutoffPrice: [420, 750],
    rating: 4.7,
    category: "Pulses",
    image: "/product/IMG_6291.jpg",
    variants: ["500g", "1kg"],
    benefits: ["Rich in protein and fiber", "Boosts immunity"],
    ingredients: [
      "Split and Dehusked Black Gram Lentils (Dhuli Urad Dal)",
      "Split and Dehusked Brown Lentils (Dhuli Masoor Dal)",
      "Split Brown Chickpeas (Chana Dal)",
    ],
    storage:
      "For best use store it in a cool and dry place in air-tight container.",
  },
  {
    id: 10,
    name: "Red Rice",
    description: `Red rice is a type of rice that's red in color due to its anthocyanin content. It's a whole grain rice that's high in fiber, vitamins, and minerals. It helps with digestion, energy levels, and overall well-being. Traditionally, the starch extracted from the boiled rice was given to pregnant ladies and lactating mothers due to its caloric value.
Red rice is considered a healthy choice due to its high fiber content and richness in antioxidants.
`,
    price: [250, 450],
    cutoffPrice: [320, 550],
    rating: 4.7,
    category: "Grains",
    image: "/product/IMG_6294.jpg",
    variants: ["500g", "1kg"],
    benefits: [
      "Supports heart health",
      "Helps in weight management",
      "Aids digestion",
    ],
    ingredients: ["Red Rice"],
    storage: "Store in a cool and dry place.",
  },
  {
    id: 11,
    name: "Black Rice",
    description: `Black rice also known as forbidden rice. It has a dark purple-black color and a chewy texture. It gets this black-purple color from a pigment called anthocyanin, which has potent antioxidant properties. Having the highest antioxidant content amongst all rice varieties, it is a powerhouse of antioxidants, protein, carbohydrates, vitamins, and minerals. 
`,
    price: [350, 650],
    cutoffPrice: [420, 750],
    rating: 4.8,
    category: "Grains",
    image: "/product/IMG_6291.jpg",
    variants: ["500g", "1kg"],
    benefits: [
      "Aids digestion",
      "Rich in dietary fiber",
      "Supports weight management",
    ],
    ingredients: ["Black Rice"],
    storage: "Store in an airtight container in a cool and dry place.",
  },
  {
    id: 12,
    name: "Wild Mustard",
    hindiName: "Jakhiya",
    description: `
    Our Jakhiya seeds have crunchy and nutty flavor, it is a spice native to the Himalayan regions, particularly Uttarakhand, India.  Jakhiya is often preferred over cumin or mustard seeds for tempering dishes like curries, lentils, dry aloo, beans, cabbage capsicum etc. Use them in daily routine cooking to enhance the taste and nutrition.
`,
    price: [140, 270],
    cutoffPrice: [200, 350],
    rating: 4.5,
    category: "Spices",
    image: "/product/IMG_6264.jpg",
    variants: ["100g", "200g"],
    benefits: [
      "Rich in omega-3 and omega-6",
      "Supports bone health",
      "Aids digestion",
      "Wild mustard is rich in fatty acids",
    ],
    ingredients: ["Wild mustard seeds"],
    storage: "Store in a cool and dry place in an airtight container.",
  },
  {
    id: 13,
    name: "Jaggery Powder",
    description: `Jaggery is a traditional unrefined sugar made from sugarcane juice, is a natural sweetener rich in essential nutrients. Incorporating jaggery into the diet can give health benefits, making it a preferable alternative to refined sugar. However, it is essential to consume it in moderation due to its sugar content. Traditionally, jaggery was consumed after meals to aid digestion.
`,
    price: [250, 500],
    cutoffPrice: [380, 700],
    rating: 4.8,
    category: "Sweeteners",
    image: "/product/IMG_6291.jpg",
    variants: ["500g", "1kg"],
    benefits: [
      "Aids digestion",
      "Rich in minerals and antioxidants",
      "Boosts hemoglobin levels",
      "Supports liver health",
    ],
    ingredients: ["Sugarcane"],
    storage: "Store in an airtight container away from direct sunlight.",
  },
  {
    id: 14,
    name: "Raw Sugar",
    hindiName: "Desi Khand",
    description: `
    Desi Khand, also known as unrefined sugar or raw sugar, is derived from sugarcane juice. Unlike refined white sugar, khand retains its natural molasses content, giving it a distinct brown color and a rich, caramel-like flavor. Khand retains more minerals than refined white sugar.
`,
    price: [280, 550],
    cutoffPrice: [350, 700],
    rating: 4.7,
    category: "Sweeteners",
    image: "/product/IMG_6273.jpg",
    variants: ["500g", "1kg"],
    benefits: [
      "Aids digestion",
      "Powerhouse of minerals and antioxidants",
      "Helps to improve gut health",
    ],
    ingredients: ["Sugarcane juice"],
    storage:
      "Once opened, store it in a clean, dry, and airtight container, away from direct sunlight.",
  },
  {
    id: 15,
    name: "Hand Grounded Salt",
    description: `This seasoned hand-grounded salt blend combines salt with coriander leaves, garlic, green chili, turmeric, herbs, asafoetida, ajwain (carom seeds), and jeera (cumin). The fusion of these diverse ingredients creates a versatile seasoning mix.
Ideal for enhancing various dishes, from grilled meats to soups or vegetables, this crafted blend promises a harmonious blend of flavors, elevating culinary creations with its well-balanced taste profile. Furthermore, this salt also pairs perfectly with fruits and salads, adding a delicious twist to these dishes. 
`,
    price: [180, 320],
    cutoffPrice: [250, 400],
    rating: 4.8,
    category: "Salt",
    image: "/product/IMG_6260.jpg",
    variants: ["250g", "500g"],
    benefits: [
      "Perfect fusion of herbs, spices, and flavor",
      "Enhances taste naturally",
      "Pairs well with fruits, vegetables, and grilled meats",
    ],
    ingredients: [
      "Ocean salt",
      "Coriander leaves",
      "Garlic",
      "Green chili",
      "Turmeric",
      "Herbs",
      "Asafoetida",
      "Carom seeds",
      "Cumin seeds",
    ],
    storage:
      "For best use, store it in a cool and dry place, away from direct sunlight.",
  },
  {
    id: 16,
    name: "Rhododendron Tea",
    hindiName: "Buransh Chai",
    description: `
    Rhododendron is derived from Greek word ‘rhodo’ means rose and dendron means ‘tree’ in combination of rose-tree, locally known as Buransh in Uttarakhand. It  is renowned for its flowers, these brightly colored flowers from deep red to pink, bloom from late winter till early summer. Buransh Tea is a light herbal drink made from buransh flower petals.
`,
    price: [300, 450],
    cutoffPrice: [360, 500],
    rating: 4.7,
    category: "Tea",
    image: "/product/IMG_6278.jpg",
    variants: ["250g", "500g"],
    benefits: [
      "Boosts immune system",
      "Helps in skin nourishment",
      "Caffeine-free",
    ],
    ingredients: ["Buransh flowers"],
    storage: "Store in a clean and dry place.",
    instructions: [
      "Take 1gm or 3-4 flowers with 100 ml of water",
      "Add Buransh Flower Tea",
      "Add Hot Water",
      "Add Honey (optional)",
      "Serve Hot",
    ],
  },
  {
    id: 17,
    name: "Buransh Squash",
    description: `Our Buransh squash is extracted from the flowers of Buransh tree. Buransh is native to the Himalayas which fills it with many medicinal properties. It is antioxidant, anti-inflammatory, and anti-diabetic in nature. It also aids to healthy heart, liver, and skin.
Drink juice of Buransh flowers from the foothills of Himalayas as it is enriched with nutrients and good for health in summers.
`,
    price: [250, 500],
    cutoffPrice: [300, 600],
    rating: 4.8,
    category: "Beverages",
    image: "/product/IMG_6286.jpg",
    variants: ["500ml", "1L"],
    benefits: [
      "Antioxidant and anti-inflammatory properties",
      "Supports heart, liver, and skin health",
    ],
    ingredients: ["Buransh Flowers", "Sugar", "Water"],
    storage:
      "Store in a cool and dry place, consume within 1 month after opening.",
  },
  {
    id: 18,
    name: "Malta Squash",
    description: `
    Malta, a citrus fruit cultivated in Uttarakhand, India, is known for its sweet and tangy flavor. Malta juice, made from the locally grown Malta oranges of Uttarakhand, and is packed with essential nutrients and antioxidants, making it a highly beneficial addition to your diet rich source of vitamin C. 
Drink juice of Malta from the foothills of Himalayas as it is enriched with nutrients and good for health in summers.
`,
    price: [250, 500],
    cutoffPrice: [300, 600],
    rating: 4.8,
    category: "Beverages",
    image: "/product/IMG_6260.jpg",
    variants: ["500ml", "1L"],
    benefits: [
      "Boosts the immune system and promotes healthy skin",
      "Aids in digestion and prevents constipation",
      "Anti-aging properties",
    ],
    ingredients: ["Malta oranges", "Sugar", "Water"],
    storage:
      "Store it in a cool and dry place, away from direct sunlight. Once opened, consume within 1 month.",
  },
];

export const cart: CartItem[] = [
  {
    id: 1,
    name: "Finger Millet Flour",
    hindiName: "Mandua, Ragi, Koda",
    description:
      "Finger millet flour is rich in fiber, protein, calcium, and iron. It supports digestion, heart health, and diabetes management.",
    cutoffPrice: 620,
    rating: 4.8,
    category: "Flour",
    image: "/productImage.JPG",
    variants: "500g",
    price: 650,
    quantity: 2,
  },
  {
    id: 7,
    name: "Wild Mustard",
    hindiName: "Jakhiya",
    description:
      "A spice native to the Himalayas, used for tempering dishes like curries, lentils, and vegetables.",
    price: 270,
    cutoffPrice: 350,
    rating: 4.5,
    category: "Spices",
    image: "/productImage.JPG",
    variants: "200g",
    quantity: 1,
  },
];

export const news = [
  {
    id: 1,
    title: "India Introduces Stricter Organic Food Regulations",
    summary:
      "New government policies aim to ensure higher quality standards in organic produce.",
    content: `
      The Indian government has recently introduced new stringent regulations for organic food certification. 
      These policies focus on maintaining purity in organic farming by reducing the use of artificial pesticides 
      and ensuring transparency in labeling. Farmers across the country are adapting to these regulations to 
      meet the growing demand for authentic organic products.
      
      Consumers can now expect better transparency with labeling, making it easier to distinguish genuine 
      organic products from falsely marketed ones.
    `,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    date: "March 25, 2025",
  },
  {
    id: 2,
    title: "Organic Food Market in India Expected to Reach $2 Billion",
    summary:
      "The Indian organic food industry is growing rapidly, fueled by increased consumer awareness.",
    content: `
      With more Indians shifting towards healthier eating habits, the organic food industry in the country 
      is projected to reach a valuation of $2 billion by 2027. Experts cite rising awareness, health concerns, 
      and increased affordability as key reasons for this surge.
      
      Farmers and companies are investing in sustainable agricultural practices to meet the demand. Many 
      online grocery stores are now offering certified organic food to cater to health-conscious consumers.
    `,
    image:
      "https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "March 20, 2025",
  },
  {
    id: 3,
    title: "Uttarakhand Farmers Lead India's Organic Revolution",
    summary:
      "Himalayan farmers are setting an example for sustainable organic farming.",
    content: `
      Uttarakhand's farmers are becoming pioneers in India's organic revolution. With fertile soil and 
      a favorable climate, many farmers are switching from conventional farming to organic methods.
      
      The state government has launched various initiatives to support organic farming, including training 
      programs and subsidies for farmers. The region is now home to some of India's most sought-after organic 
      produce, including millets, lentils, and herbal teas.
    `,
    image:
      "https://images.unsplash.com/photo-1528693404014-b13ebe6e723e?q=80&w=3133&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "March 18, 2025",
  },
  {
    id: 4,
    title: "Pesticide-Free Farming Gains Popularity in Maharashtra",
    summary:
      "Farmers are embracing pesticide-free cultivation methods for healthier crops.",
    content: `
      In Maharashtra, a growing number of farmers are adopting pesticide-free farming techniques. These methods 
      reduce soil contamination, improve biodiversity, and result in healthier food.
      
      Many farmers are now leveraging natural fertilizers and bio-pesticides instead of synthetic chemicals, 
      ensuring their produce is safe for consumption. The state government is offering incentives to promote 
      sustainable agriculture.
    `,
    image:
      "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=3096&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "March 15, 2025",
  },

  {
    id: 6,
    title: "Organic Farming Reduces Carbon Footprint, Says Study",
    summary:
      "New research highlights the environmental benefits of organic farming.",
    content: `
      A recent study has revealed that organic farming significantly reduces greenhouse gas emissions compared 
      to conventional farming methods. The research indicates that the elimination of synthetic fertilizers and 
      pesticides plays a crucial role in lowering carbon footprints.
      
      The study suggests that if more farmers adopt organic practices, it could contribute to global climate 
      change mitigation efforts.
    `,
    image:
      "https://images.unsplash.com/photo-1728919722219-9a9f1d9e08db?q=80&w=2969&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "March 10, 2025",
  },
  {
    id: 7,
    title: "Demand for Organic Grains Rises in India",
    summary: "Indian households are increasingly switching to organic grains.",
    content: `
      Indian consumers are making the switch to organic grains due to their health benefits and lack of chemical 
      residues. Organic wheat, rice, and pulses have seen a steady rise in demand over the past few years.
      
      Many e-commerce platforms now provide home delivery of certified organic grains, making them more accessible 
      to urban populations.
    `,
    image:
      "https://images.unsplash.com/photo-1566218246241-934ad8b38ea6?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "March 5, 2025",
  },
];

export const blogs = [
  {
    id: 1,
    title: "5 Benefits of Organic Food You Should Know",
    summary: "Discover how organic food can improve your health and lifestyle.",
    content: `
      Organic food is free from harmful chemicals and pesticides, making it a healthier choice for you and your family. 
      Here are five key benefits:
      
      1. **Better Nutrition**: Organic foods retain more essential vitamins and minerals.
      2. **Free from Chemicals**: No harmful pesticides or synthetic fertilizers.
      3. **Environmentally Friendly**: Sustainable farming practices help protect nature.
      4. **Tastes Better**: Many consumers find organic food to have a richer taste.
      5. **Supports Local Farmers**: Buying organic helps small-scale farmers thrive.
    `,
    image:
      "https://images.unsplash.com/photo-1562437243-4117943e59b8?q=80&w=3111&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "March 24, 2025",
  },
  {
    id: 2,
    title: "Why You Should Switch to Organic Grains",
    summary:
      "Organic grains are packed with nutrients and free from harmful chemicals.",
    content: `
      Many households are switching to organic grains due to their high nutritional value and lack of chemical residues.
      Whole grains such as brown rice, quinoa, and millet provide fiber, protein, and essential minerals.
    `,
    image:
      "https://images.unsplash.com/photo-1737735633629-f9ed8408a176?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "March 22, 2025",
  },
  {
    id: 3,
    title: "How to Grow Your Own Organic Vegetables at Home",
    summary:
      "A beginner’s guide to starting your own organic vegetable garden.",
    content: `
      Growing organic vegetables at home is easier than you think! Start with small herbs like basil and coriander, 
      and gradually move to tomatoes and spinach. Use compost and natural fertilizers for the best results.
    `,
    image:
      "https://images.unsplash.com/photo-1558717738-12f5dde036a7?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "March 20, 2025",
  },
  {
    id: 4,
    title: "Are Organic Fruits Really Healthier?",
    summary:
      "Unveiling the truth about organic fruits and their health benefits.",
    content: `
      Studies show that organic fruits contain higher levels of antioxidants and fewer pesticide residues than 
      conventionally grown fruits. Choosing organic can lead to better overall health.
    `,
    image:
      "https://images.unsplash.com/photo-1551888762-164944b399d8?q=80&w=3134&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "March 18, 2025",
  },
  {
    id: 5,
    title: "Sustainable Eating: How to Reduce Food Waste",
    summary: "Practical tips to reduce food waste and support sustainability.",
    content: `
      Reducing food waste is essential for a sustainable future. Plan meals in advance, store food properly, and 
      compost scraps to minimize waste.
    `,
    image:
      "https://images.unsplash.com/photo-1582408904325-adf33a0ec010?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: "March 15, 2025",
  },
];

export const categories = [
  {
    name: "Flour",
    description:
      "Freshly milled, nutrient-rich flours for all your baking needs.",
    image:
      "https://images.unsplash.com/photo-1627735483792-233bf632619b?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Grains",
    description: "Wholesome, unprocessed grains packed with natural goodness.",
    image:
      "https://images.unsplash.com/photo-1705475388190-775066fd69a5?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Pulses",
    description:
      "High-protein, organic pulses for a healthy and balanced diet.",
    image:
      "https://images.unsplash.com/photo-1694679671688-3d9bb5e77f37?q=80&w=3132&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Seeds",
    description: "Nutrient-dense seeds for snacking, cooking, and wellness.",
    image:
      "https://images.unsplash.com/photo-1633633688057-9bd3ed288d52?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Spices",
    description:
      "Aromatic, farm-fresh spices to enhance your culinary creations.",
    image:
      "https://images.unsplash.com/photo-1566824099147-bef027d3a333?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Sweeteners",
    description:
      "Natural sweeteners like jaggery and raw sugar for guilt-free indulgence.",
    image:
      "https://img.freepik.com/free-photo/healthy-jaggery-still-life-arrangement_23-2149161556.jpg?t=st=1742920082~exp=1742923682~hmac=a259a9f32ea3bc93b00a052e2409ce3742c8de8461fb6600470262cea2913a43&w=2000",
  },
  {
    name: "Tea",
    description:
      "Handpicked organic teas for a refreshing and calming experience.",
    image:
      "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?q=80&w=2967&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Beverages",
    description: "Healthy, natural drinks to keep you energized and hydrated.",
    image:
      "https://images.unsplash.com/photo-1580775174971-149b403a7e0b?q=80&w=2942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];
