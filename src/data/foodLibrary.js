export const foodLibrary = {
  proteins: [
    {
      name: 'Paneer (Low Fat)',
      servingSize: '100g',
      protein: '18g-20g',
      cost: 'Medium',
      bestUse: 'Pan-seared, Stir fry, Curry, Tikka bowl. Excellent slow-release protein (casein) before bed.',
      calories: 200
    },
    {
      name: 'Soya Chunks',
      servingSize: '50g',
      protein: '26g',
      cost: 'Low / Budget-Friendly',
      bestUse: 'Boiled & squeezed, Soya Pulao, Soya Bhurji, Cutlets. High protein-to-cost ratio.',
      calories: 170
    },
    {
      name: 'Whole Eggs / Whites',
      servingSize: '3 Eggs',
      protein: '18g (6g per egg)',
      cost: 'Low',
      bestUse: 'Boiled, Omelette, Scrambled, Sunny-side up. Perfect bioavailable protein for breakfast or post-workout.',
      calories: 210
    },
    {
      name: 'Skimmed Milk',
      servingSize: '250ml',
      protein: '8.5g',
      cost: 'Low',
      bestUse: 'Oats cooking, Shakes, direct drinking. Hydrating and high calcium.',
      calories: 90
    },
    {
      name: 'Greek / Fresh Curd',
      servingSize: '200g',
      protein: '8g-12g',
      cost: 'Low',
      bestUse: 'Curd Rice, Marinades, Smoothies. Probiotic benefits improve gut absorption.',
      calories: 120
    },
    {
      name: 'Yellow / Moong Dal',
      servingSize: '50g (raw)',
      protein: '12g',
      cost: 'Low',
      bestUse: 'Classic Dal Tadka, Khichdi, Dal Soups. Combine with rice to complete amino acid profile.',
      calories: 175
    },
    {
      name: 'Kala Chana / Chickpeas',
      servingSize: '50g (raw)',
      protein: '10g',
      cost: 'Low',
      bestUse: 'Salad bowl, boiled snack, chickpea mash, hummus. Rich in dietary fiber.',
      calories: 180
    },
    {
      name: 'Organic Tofu',
      servingSize: '100g',
      protein: '12g-14g',
      cost: 'Medium',
      bestUse: 'Vegan stir-fries, noodle toppings, grilled skewers. Low fat and calorie-efficient.',
      calories: 120
    }
  ],
  carbs: [
    {
      name: 'Basmati / Brown Rice',
      quantity: '75g (raw)',
      calories: '260 kcal',
      bestTime: 'Lunch (pre/post-workout). Easy to digest and quickly replenishes glycogen.',
      carbs: '60g'
    },
    {
      name: 'Rolled Oats',
      quantity: '50g',
      calories: '190 kcal',
      bestTime: 'Breakfast. Slow-burning complex carbs that sustain energy throughout the day.',
      carbs: '34g'
    },
    {
      name: 'Flat Rice / Poha',
      quantity: '70g',
      calories: '245 kcal',
      bestTime: 'Breakfast or Pre-workout. Light, fast digesting, and instant fuel.',
      carbs: '55g'
    },
    {
      name: 'Whole Wheat / Multi-grain Bread',
      quantity: '2 slices',
      calories: '150 kcal',
      bestTime: 'Breakfast or Snacks. Convenient carb source for sandwhiches.',
      carbs: '28g'
    },
    {
      name: 'Sweet Potato',
      quantity: '150g (boiled)',
      calories: '130 kcal',
      bestTime: 'Pre-workout. Ideal low glycemic index food for steady training energy.',
      carbs: '30g'
    },
    {
      name: 'Ragi (Finger Millet)',
      quantity: '40g',
      calories: '140 kcal',
      bestTime: 'Breakfast or Dinner. Rich in calcium and iron, gluten-free, highly alkaline.',
      carbs: '30g'
    },
    {
      name: 'Durum Wheat Pasta',
      quantity: '60g',
      calories: '210 kcal',
      bestTime: 'Post-workout. Excellent source of sustained complex carbohydrates.',
      carbs: '44g'
    },
    {
      name: 'Wheat Noodles',
      quantity: '70g',
      calories: '240 kcal',
      bestTime: 'Cheat meal / Dinner. Satisfying carb source when tossed with lots of vegetables.',
      carbs: '50g'
    }
  ],
  vegetables: {
    mealVeggies: [
      { name: 'Red Onion', benefit: 'Flavor base, rich in antioxidants and sulfur compounds.' },
      { name: 'Rani Tomato', benefit: 'Provides lycopene, vitamin C, and tanginess.' },
      { name: 'Capsicum (Bell Peppers)', benefit: 'High in Vitamin C, fiber, and adds premium crunch.' }
    ],
    juices: [
      { name: 'Beetroot', benefit: 'Natural nitrates boost nitric oxide, improving workout endurance.' },
      { name: 'Carrot', benefit: 'Beta-carotene for vision and glowing skin.' },
      { name: 'Amla (Indian Gooseberry)', benefit: 'Extreme Vitamin C bomb for immune response.' },
      { name: 'Fresh Ginger', benefit: 'Powerful anti-inflammatory and aids digestion.' },
      { name: 'Zesty Lemon', benefit: 'Alkalizes the body and enhances iron absorption.' }
    ],
    salads: [
      { name: 'English Cucumber', benefit: 'High water content (95%) for skin hydration.' },
      { name: 'Grated Carrot', benefit: 'Fibers help bind toxins in the gut.' },
      { name: 'Sliced Beetroot', benefit: 'Aids blood circulation and liver detoxification.' }
    ],
    spinachFrequency: '1-3 times per week. (Provides iron, folate, magnesium, and nitrates for muscle recovery)'
  },
  fruits: [
    {
      name: 'Banana',
      timing: 'Pre-workout (30-45 mins before) or immediate Post-workout.',
      benefit: 'Quick potassium release prevents cramping; provides immediate glucose.'
    },
    {
      name: 'Guava',
      timing: 'Mid-day snack (around 12 PM or 4 PM).',
      benefit: 'Extremely high in dietary fiber and Vitamin C; low glycemic index.'
    },
    {
      name: 'Papaya',
      timing: 'Morning on an empty stomach or post-lunch.',
      benefit: 'Contains papain enzymes that break down protein, accelerating absorption.'
    },
    {
      name: 'Watermelon',
      timing: 'Morning or hot afternoon.',
      benefit: 'Rich in L-citrulline which reduces muscle soreness and boosts blood flow.'
    },
    {
      name: 'Pineapple',
      timing: 'Post-workout or with heavy protein meals.',
      benefit: 'Contains bromelain, a natural enzyme blend that breaks down proteins and decreases bloating.'
    }
  ]
};
