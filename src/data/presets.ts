import { PartyPlan } from '../types';

export const PRESET_PARTIES: PartyPlan[] = [
  {
    config: {
      id: 'preset-taco-fiesta',
      title: 'Cinco de Fiesta Taco Bar',
      theme: 'Mexican Fiesta & Margarita Bar',
      partyType: 'Birthday / Celebration',
      guestCount: {
        adults: 16,
        kids: 4,
        toddlers: 0,
        total: 20
      },
      durationHours: 4,
      mealType: 'full_meal',
      vibe: 'festive',
      targetBudget: 280,
      currency: '$',
      dietary: {
        vegetarian: 3,
        vegan: 1,
        glutenFree: 4,
        nutFree: 20,
        dairyFree: 2,
        halal: 0,
        kosher: 0,
        otherNotes: 'Provide corn tortillas for gluten-free guests; keep cheese and crema separate for dairy-free/vegan.'
      },
      equipment: {
        hasGrill: false,
        hasOven: true,
        hasBlender: true,
        hasCoolers: true,
        hasChafingDishes: true,
        needsDisposableTableware: true,
        indoorOutdoor: 'both'
      },
      notes: 'Self-serve taco bar with warm slow cooker carnitas, seasoned chicken tinga, and vegetarian black beans.'
    },
    cateringHighlights: {
      foodPortionSummary: '10 lbs meat (Carnitas + Chicken) + 4 cans black beans = ~3 tacos per guest.',
      drinkPortionSummary: '60 drink servings planned (Margarita pitcher, Mexican cervezas, Jarritos sodas).',
      budgetHealth: 'Estimated $242.50 vs target budget $280.00 ($37.50 buffer remaining).',
      topSavingsTip: 'Buy pork shoulder & chicken thighs at wholesale club; squeeze fresh limes in bulk 3 hours prior.'
    },
    aiSummary: 'A vibrant, crowd-pleasing DIY Taco Bar calibrated for 20 guests (16 adults, 4 kids). Everything is segmented for easy gluten-free and vegetarian customization with a festive drink station.',
    timeline: [
      {
        id: 't-1',
        timeframe: '3_days_before',
        title: 'Wholesale & Grocery Run',
        description: 'Purchase non-perishables, canned beans, disposable fiesta tableware, and bulk margarita mixers.',
        tasks: [
          { id: 'task-1', text: 'Costco run: Pork shoulder, chicken thighs, shredded cheese, chips, salsa jars, limes', completed: false },
          { id: 'task-2', text: 'Liquor store: Tequila blanco, Triple Sec, Corona/Modelo 24-pack', completed: false },
          { id: 'task-3', text: 'Check slow cooker & chafing dishes are cleaned and working', completed: false }
        ]
      },
      {
        id: 't-2',
        timeframe: '1_day_before',
        title: 'Prep Marinades & Chop Veggies',
        description: 'Season carnitas for slow cooking, slice jalapenos, chop cilantro and onions, and chill beer.',
        tasks: [
          { id: 'task-4', text: 'Start slow cooker carnitas (cook low & slow for 8 hours)', completed: false },
          { id: 'task-5', text: 'Chop cilantro, red onions, limes into taco bar topping bowls; seal tight', completed: false },
          { id: 'task-6', text: 'Batch mix Margarita base (lime juice, agave, triple sec) in glass pitchers', completed: false }
        ]
      },
      {
        id: 't-3',
        timeframe: 'party_morning',
        title: 'Cook Chicken & Fresh Guacamole',
        description: 'Shred meats, heat black beans, and mash fresh avocados 1 hour before start.',
        tasks: [
          { id: 'task-7', text: 'Simmer seasoned shredded chicken tinga', completed: false },
          { id: 'task-8', text: 'Pick up 2x 20lb bags of ice and load cooler with drinks', completed: false },
          { id: 'task-9', text: 'Mash fresh guacamole and cover directly with plastic wrap against surface', completed: false }
        ]
      },
      {
        id: 't-4',
        timeframe: '2_hours_before',
        title: 'Buffet & Bar Station Setup',
        description: 'Set out warmer dishes, tortilla warmers, chip bowls, and festive napkins/plates.',
        tasks: [
          { id: 'task-10', text: 'Warm corn and flour tortillas in foil bundles in oven at 250°F', completed: false },
          { id: 'task-11', text: 'Set out margarita salt rimmer, ice bucket, and glassware/cups', completed: false },
          { id: 'task-12', text: 'Cue upbeat Latin acoustic/fiesta background playlist', completed: false }
        ]
      }
    ],
    items: [
      {
        id: 'item-1',
        name: 'Pork Shoulder / Butt (for Carnitas)',
        category: 'protein_main',
        quantity: 6,
        unit: 'lbs',
        estimatedUnitPrice: 3.49,
        estimatedTotalPrice: 20.94,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Costco / Wholesale',
        dietaryTags: ['Gluten-Free', 'Dairy-Free'],
        portionRationale: 'Calculated at 0.35 lb cooked yield per meat-eating guest across 2 meats.',
        shoppingTip: 'Look for bone-in or boneless pork butt on sale; cooks down into tender shreds.',
        substitutes: ['Pre-cooked pork carnitas', 'Beef chuck roast']
      },
      {
        id: 'item-2',
        name: 'Boneless Skinless Chicken Thighs',
        category: 'protein_main',
        quantity: 5,
        unit: 'lbs',
        estimatedUnitPrice: 3.99,
        estimatedTotalPrice: 19.95,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Costco / Wholesale',
        dietaryTags: ['Gluten-Free', 'Dairy-Free', 'Halal-friendly'],
        portionRationale: 'Juicier than breasts, holds moisture in warming dish.',
        shoppingTip: 'Chicken thighs stay tender in slow cookers much longer than chicken breast.',
        substitutes: ['Chicken breast tenders', 'Ground turkey']
      },
      {
        id: 'item-3',
        name: 'Black Beans (Seasoned Canned)',
        category: 'protein_main',
        quantity: 4,
        unit: 'cans (15oz)',
        estimatedUnitPrice: 1.29,
        estimatedTotalPrice: 5.16,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Supermarket / Grocery',
        dietaryTags: ['Vegetarian', 'Vegan', 'Gluten-Free'],
        portionRationale: 'Essential protein for 3 vegetarian/vegan guests plus side for others.',
        shoppingTip: 'Simmer with cumin, garlic powder, and diced onion for restaurant flavor.'
      },
      {
        id: 'item-4',
        name: 'Corn Tortillas (Pack of 50)',
        category: 'bakery_snacks',
        quantity: 1,
        unit: 'pack (50 ct)',
        estimatedUnitPrice: 3.99,
        estimatedTotalPrice: 3.99,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Supermarket / Grocery',
        dietaryTags: ['Gluten-Free', 'Vegan'],
        portionRationale: 'Safe for GF guests and traditional taco lovers (2-3 per person).',
        shoppingTip: 'Look for Milagro or El Milagro brand for authentic taste.'
      },
      {
        id: 'item-5',
        name: 'Flour Tortillas (Street Taco Size, 30 ct)',
        category: 'bakery_snacks',
        quantity: 1,
        unit: 'pack (30 ct)',
        estimatedUnitPrice: 3.49,
        estimatedTotalPrice: 3.49,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Supermarket / Grocery',
        dietaryTags: ['Vegetarian'],
        portionRationale: 'Great for kids and adults who prefer soft flour shells.'
      },
      {
        id: 'item-6',
        name: 'Restaurant Style Tortilla Chips (Bulk Bag)',
        category: 'bakery_snacks',
        quantity: 2,
        unit: 'bags (24oz)',
        estimatedUnitPrice: 4.99,
        estimatedTotalPrice: 9.98,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Costco / Wholesale',
        dietaryTags: ['Gluten-Free', 'Vegan'],
        portionRationale: 'Approx 2.5 oz chips per person for salsa/guac bar.',
        shoppingTip: 'Bulk wholesale bag offers 3x value over standard grocery bags.'
      },
      {
        id: 'item-7',
        name: 'Hass Avocados (Mesh Bag)',
        category: 'produce_sides',
        quantity: 8,
        unit: 'avocados',
        estimatedUnitPrice: 1.15,
        estimatedTotalPrice: 9.20,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Costco / Wholesale',
        dietaryTags: ['Vegan', 'Gluten-Free', 'Dairy-Free'],
        portionRationale: 'Makes ~4 cups of fresh party guacamole.',
        shoppingTip: 'Buy 2 days ahead if firm, or day of event if already soft to touch.'
      },
      {
        id: 'item-8',
        name: 'Fresh Limes (Bulk Bag)',
        category: 'produce_sides',
        quantity: 20,
        unit: 'limes',
        estimatedUnitPrice: 0.35,
        estimatedTotalPrice: 7.00,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Costco / Wholesale',
        dietaryTags: ['Vegan', 'Gluten-Free'],
        portionRationale: '12 limes for Margarita batch + 8 cut into wedges for tacos/cervezas.',
        shoppingTip: 'Microwave cold limes for 10 seconds and roll firmly to yield 30% more juice.'
      },
      {
        id: 'item-9',
        name: 'Fresh Cilantro & Red Onions',
        category: 'produce_sides',
        quantity: 1,
        unit: 'combo bundle',
        estimatedUnitPrice: 3.50,
        estimatedTotalPrice: 3.50,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Supermarket / Grocery',
        dietaryTags: ['Vegan', 'Gluten-Free'],
        portionRationale: 'Classic street taco garnish for taco station bowls.'
      },
      {
        id: 'item-10',
        name: 'Shredded Mexican Cheese Blend (2 lb bag)',
        category: 'produce_sides',
        quantity: 1,
        unit: 'bag (32oz)',
        estimatedUnitPrice: 7.99,
        estimatedTotalPrice: 7.99,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Costco / Wholesale',
        dietaryTags: ['Vegetarian', 'Gluten-Free'],
        portionRationale: '~1.5 oz cheese per guest.',
        shoppingTip: 'Pre-shredded with Monterey Jack and Queso Quesadilla melts quickly.'
      },
      {
        id: 'item-11',
        name: 'Mexican Crema / Sour Cream',
        category: 'produce_sides',
        quantity: 2,
        unit: 'tubs (16oz)',
        estimatedUnitPrice: 2.79,
        estimatedTotalPrice: 5.58,
        purchased: false,
        priority: 'recommended',
        recommendedStore: 'Supermarket / Grocery',
        dietaryTags: ['Vegetarian', 'Gluten-Free']
      },
      {
        id: 'item-12',
        name: 'Salsa Variety (Mild Pico + Medium Roasted Salsa)',
        category: 'produce_sides',
        quantity: 2,
        unit: 'jars (24oz)',
        estimatedUnitPrice: 4.49,
        estimatedTotalPrice: 8.98,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Trader Joe\'s / Specialty',
        dietaryTags: ['Vegan', 'Gluten-Free']
      },
      {
        id: 'item-13',
        name: '100% Agave Tequila Blanco (1.75L)',
        category: 'drinks_alcohol',
        quantity: 1,
        unit: 'bottle (1.75L)',
        estimatedUnitPrice: 34.99,
        estimatedTotalPrice: 34.99,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Liquor Store',
        portionRationale: 'Yields ~38 standard 1.5oz margarita pours for 16 adults.',
        shoppingTip: 'Espolon, Kirkland Tequila, or Milagro offer highest purity-to-price ratio.',
        substitutes: ['Tequila Reposado', 'Mezcal for smoky notes']
      },
      {
        id: 'item-14',
        name: 'Triple Sec / Orange Liqueur (750ml)',
        category: 'drinks_alcohol',
        quantity: 1,
        unit: 'bottle (750ml)',
        estimatedUnitPrice: 10.99,
        estimatedTotalPrice: 10.99,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Liquor Store',
        portionRationale: '0.75 oz per margarita cocktail.'
      },
      {
        id: 'item-15',
        name: 'Mexican Beer Variety (Corona / Modelo 24-Pack)',
        category: 'drinks_alcohol',
        quantity: 1,
        unit: 'case (24 cans/bottles)',
        estimatedUnitPrice: 26.99,
        estimatedTotalPrice: 26.99,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Costco / Wholesale',
        portionRationale: '1.5 beers per adult guest average alongside margaritas.'
      },
      {
        id: 'item-16',
        name: 'Jarritos Mexican Sodas (Mandarin & Lime 12-pack)',
        category: 'drinks_non_alcohol',
        quantity: 1,
        unit: 'case (12 bottles)',
        estimatedUnitPrice: 11.99,
        estimatedTotalPrice: 11.99,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Supermarket / Grocery',
        dietaryTags: ['Vegan', 'Gluten-Free', 'Kid-Friendly'],
        portionRationale: 'For 4 kids + adults who prefer non-alcoholic festive sodas.'
      },
      {
        id: 'item-17',
        name: 'Sparkling Mineral Water (Topo Chico / Lime Seltzers)',
        category: 'drinks_non_alcohol',
        quantity: 1,
        unit: '12-pack',
        estimatedUnitPrice: 6.99,
        estimatedTotalPrice: 6.99,
        purchased: false,
        priority: 'recommended',
        recommendedStore: 'Supermarket / Grocery',
        dietaryTags: ['Zero Calorie', 'Vegan', 'Gluten-Free']
      },
      {
        id: 'item-18',
        name: 'Churros or Mexican Cinnamon Sugar Pastries',
        category: 'desserts',
        quantity: 24,
        unit: 'pieces',
        estimatedUnitPrice: 0.60,
        estimatedTotalPrice: 14.40,
        purchased: false,
        priority: 'recommended',
        recommendedStore: 'Bakery / Local Deli',
        dietaryTags: ['Vegetarian'],
        portionRationale: '1-2 pieces per guest with chocolate dipping sauce.'
      },
      {
        id: 'item-19',
        name: 'Heavy Duty 3-Compartment Plates (50 ct)',
        category: 'tableware_disposables',
        quantity: 1,
        unit: 'pack (50 ct)',
        estimatedUnitPrice: 9.99,
        estimatedTotalPrice: 9.99,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Target / Walmart',
        portionRationale: 'Compartment plates prevent taco juices from soaking tortilla chips.'
      },
      {
        id: 'item-20',
        name: 'Compostable Cups 12oz & Napkins (100 ct)',
        category: 'tableware_disposables',
        quantity: 1,
        unit: 'combo pack',
        estimatedUnitPrice: 8.50,
        estimatedTotalPrice: 8.50,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Target / Walmart'
      },
      {
        id: 'item-21',
        name: 'Fiesta Papel Picado Banner & Table Runner',
        category: 'decorations',
        quantity: 1,
        unit: 'decor kit',
        estimatedUnitPrice: 11.99,
        estimatedTotalPrice: 11.99,
        purchased: false,
        priority: 'optional',
        recommendedStore: 'Party Store / Amazon',
        shoppingTip: 'Reusable felt banner instantly sets the party theme without hassle.'
      },
      {
        id: 'item-22',
        name: 'Party Ice Bags (20 lbs)',
        category: 'ice_logistics',
        quantity: 2,
        unit: 'bags (20 lb each)',
        estimatedUnitPrice: 3.99,
        estimatedTotalPrice: 7.98,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Supermarket / Grocery',
        portionRationale: '1 bag for cooler drink submersion + 1 bag clean ice for drinks.'
      }
    ]
  },
  {
    config: {
      id: 'preset-bbq-smokeout',
      title: 'Backyard Summer BBQ & Smokeout',
      theme: 'Classic American BBQ & Craft Beer',
      partyType: 'Summer Backyard Gathering',
      guestCount: {
        adults: 14,
        kids: 6,
        toddlers: 2,
        total: 22
      },
      durationHours: 5,
      mealType: 'bbq_cookout',
      vibe: 'casual',
      targetBudget: 320,
      currency: '$',
      dietary: {
        vegetarian: 2,
        vegan: 1,
        glutenFree: 3,
        nutFree: 22,
        dairyFree: 4,
        halal: 0,
        kosher: 0,
        otherNotes: 'Provide plant-based burgers for vegetarians; gluten-free buns for 3 guests.'
      },
      equipment: {
        hasGrill: true,
        hasOven: true,
        hasBlender: false,
        hasCoolers: true,
        hasChafingDishes: false,
        needsDisposableTableware: true,
        indoorOutdoor: 'outdoor'
      },
      notes: 'Smoked pulled pork, grilled burgers, hot dogs for kids, mac and cheese, watermelon, and cold beverages.'
    },
    cateringHighlights: {
      foodPortionSummary: '12 lbs pulled pork + 16 burger patties + 12 hot dogs + 4 plant burgers.',
      drinkPortionSummary: '75 beverage units (craft beers, hard seltzers, lemonades, iced tea).',
      budgetHealth: 'Estimated $278.40 vs target budget $320.00 ($41.60 remaining).',
      topSavingsTip: 'Pork butt is $2.49/lb in bulk and feeds 20+ people with high leftovers value.'
    },
    aiSummary: 'An easygoing, high-flavor outdoor cookout designed for 22 guests with generous meat portions, kid favorites, grilled corn, and refreshing hydration.',
    timeline: [
      {
        id: 'bbq-t1',
        timeframe: '3_days_before',
        title: 'Meat & Charcoal Shopping',
        description: 'Pick up pork shoulder, charcoal/wood chunks, buns, and condiments.',
        tasks: [
          { id: 'b-task-1', text: 'Buy pork shoulder, burger blend, hot dogs, and Beyond meat at wholesale', completed: false },
          { id: 'b-task-2', text: 'Check propane tank / buy 2 bags of lump charcoal and wood smoking chips', completed: false }
        ]
      },
      {
        id: 'bbq-t2',
        timeframe: '1_day_before',
        title: 'Dry Rub & Smoker Prep',
        description: 'Rub meats with brown sugar/paprika BBQ rub, make potato salad and coleslaw.',
        tasks: [
          { id: 'b-task-3', text: 'Trim fat cap & rub pork with BBQ seasoning; wrap in foil in fridge', completed: false },
          { id: 'b-task-4', text: 'Make southern potato salad & tangy slaw (flavors deepen overnight)', completed: false },
          { id: 'b-task-5', text: 'Fill coolers with bottled waters, iced tea, and beer to pre-chill', completed: false }
        ]
      },
      {
        id: 'bbq-t3',
        timeframe: 'party_morning',
        title: 'Light the Smoker & Slice Watermelon',
        description: 'Fire up smoker at 6:00 AM for 6-8 hr slow smoke, slice fruit, prep grill station.',
        tasks: [
          { id: 'b-task-6', text: 'Put pork butt on smoker at 225°F with applewood smoke', completed: false },
          { id: 'b-task-7', text: 'Slice whole seedless watermelon into easy handheld triangles', completed: false },
          { id: 'b-task-8', text: 'Pick up 3x bags of ice for beverage troughs and coolers', completed: false }
        ]
      },
      {
        id: 'bbq-t4',
        timeframe: '2_hours_before',
        title: 'Grill Station & Condiment Bar',
        description: 'Set out burger fixings, warm brioche buns, set out lawn games.',
        tasks: [
          { id: 'b-task-9', text: 'Shred pulled pork into warm tray and toss with BBQ sauce', completed: false },
          { id: 'b-task-10', text: 'Set out ketchup, mustard, pickles, sliced cheddar, and tomato slices', completed: false },
          { id: 'b-task-11', text: 'Setup cornhole and outdoor speakers with summer rock/country playlist', completed: false }
        ]
      }
    ],
    items: [
      {
        id: 'bbq-1',
        name: 'Pork Shoulder / Boston Butt (for Pulled Pork)',
        category: 'protein_main',
        quantity: 8,
        unit: 'lbs',
        estimatedUnitPrice: 2.79,
        estimatedTotalPrice: 22.32,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Costco / Wholesale',
        portionRationale: '0.45 lb raw weight per meat eater; shrinks by ~35% when smoked.',
        shoppingTip: 'Bone-in retains moisture best throughout long smoking sessions.'
      },
      {
        id: 'bbq-2',
        name: '80/20 Ground Beef Burger Patties (16 ct)',
        category: 'protein_main',
        quantity: 1,
        unit: 'pack (16 patties)',
        estimatedUnitPrice: 21.99,
        estimatedTotalPrice: 21.99,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Costco / Wholesale',
        portionRationale: '1 patty per adult, extra for big eaters.'
      },
      {
        id: 'bbq-3',
        name: 'All-Beef Hot Dogs (12 pack)',
        category: 'protein_main',
        quantity: 1,
        unit: 'pack (12 ct)',
        estimatedUnitPrice: 6.99,
        estimatedTotalPrice: 6.99,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Supermarket / Grocery',
        portionRationale: '1-2 dogs per kid + backup for casual snacking.'
      },
      {
        id: 'bbq-4',
        name: 'Beyond Meat / Plant-Based Patties',
        category: 'protein_main',
        quantity: 1,
        unit: '4-pack',
        estimatedUnitPrice: 7.49,
        estimatedTotalPrice: 7.49,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Supermarket / Grocery',
        dietaryTags: ['Vegetarian', 'Vegan'],
        portionRationale: 'For 2 vegetarian & 1 vegan guest.'
      },
      {
        id: 'bbq-5',
        name: 'Brioche Burger Buns & Hot Dog Buns',
        category: 'bakery_snacks',
        quantity: 3,
        unit: 'packs (8 ct each)',
        estimatedUnitPrice: 3.99,
        estimatedTotalPrice: 11.97,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Costco / Wholesale'
      },
      {
        id: 'bbq-6',
        name: 'Gluten-Free Burger Buns (4-pack)',
        category: 'bakery_snacks',
        quantity: 1,
        unit: 'pack (4 ct)',
        estimatedUnitPrice: 5.49,
        estimatedTotalPrice: 5.49,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Trader Joe\'s / Specialty',
        dietaryTags: ['Gluten-Free']
      },
      {
        id: 'bbq-7',
        name: 'Sweet Corn on the Cob (Shucked 8-pack)',
        category: 'produce_sides',
        quantity: 2,
        unit: 'packs (8 ct)',
        estimatedUnitPrice: 4.99,
        estimatedTotalPrice: 9.98,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Supermarket / Grocery',
        portionRationale: 'Cut into halves for 32 mini cobs for easy handheld eating.'
      },
      {
        id: 'bbq-8',
        name: 'Whole Seedless Watermelon',
        category: 'produce_sides',
        quantity: 1,
        unit: 'large watermelon',
        estimatedUnitPrice: 6.99,
        estimatedTotalPrice: 6.99,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Supermarket / Grocery',
        dietaryTags: ['Vegan', 'Gluten-Free', 'Kid-Favorite']
      },
      {
        id: 'bbq-9',
        name: 'Creamy Macaroni Salad & Slaw (3 lb tubs)',
        category: 'produce_sides',
        quantity: 2,
        unit: 'tubs (48oz)',
        estimatedUnitPrice: 6.49,
        estimatedTotalPrice: 12.98,
        purchased: false,
        priority: 'recommended',
        recommendedStore: 'Costco / Wholesale'
      },
      {
        id: 'bbq-10',
        name: 'Craft IPA / Summer Ale (12-pack)',
        category: 'drinks_alcohol',
        quantity: 2,
        unit: '12-packs',
        estimatedUnitPrice: 18.99,
        estimatedTotalPrice: 37.98,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Liquor Store'
      },
      {
        id: 'bbq-11',
        name: 'Hard Seltzers Variety (White Claw / High Noon 12-pack)',
        category: 'drinks_alcohol',
        quantity: 1,
        unit: '12-pack',
        estimatedUnitPrice: 19.99,
        estimatedTotalPrice: 19.99,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Costco / Wholesale',
        dietaryTags: ['Gluten-Free']
      },
      {
        id: 'bbq-12',
        name: 'Lemonade & Sweet Iced Tea Gallons',
        category: 'drinks_non_alcohol',
        quantity: 3,
        unit: 'gallons',
        estimatedUnitPrice: 3.49,
        estimatedTotalPrice: 10.47,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Supermarket / Grocery'
      },
      {
        id: 'bbq-13',
        name: 'Bulk Bottled Spring Water (40 ct case)',
        category: 'drinks_non_alcohol',
        quantity: 1,
        unit: 'case (40 bottles)',
        estimatedUnitPrice: 4.99,
        estimatedTotalPrice: 4.99,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Costco / Wholesale'
      },
      {
        id: 'bbq-14',
        name: 'S\'mores Kit (Graham Crackers, Marshmallows, Hershey Bars)',
        category: 'desserts',
        quantity: 1,
        unit: 'bundle kit',
        estimatedUnitPrice: 11.99,
        estimatedTotalPrice: 11.99,
        purchased: false,
        priority: 'recommended',
        recommendedStore: 'Target / Walmart',
        portionRationale: 'Fun campfire / grill dessert for both kids and adults.'
      },
      {
        id: 'bbq-15',
        name: 'Heavy Duty Paper Plates & Cutlery Kit (100 ct)',
        category: 'tableware_disposables',
        quantity: 1,
        unit: 'combo pack',
        estimatedUnitPrice: 14.99,
        estimatedTotalPrice: 14.99,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Costco / Wholesale'
      },
      {
        id: 'bbq-16',
        name: 'Lump Hardwood Charcoal & Firestarters',
        category: 'ice_logistics',
        quantity: 1,
        unit: '20 lb bag',
        estimatedUnitPrice: 15.99,
        estimatedTotalPrice: 15.99,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Target / Walmart'
      },
      {
        id: 'bbq-17',
        name: 'Party Ice Bags (20 lbs)',
        category: 'ice_logistics',
        quantity: 3,
        unit: 'bags (20 lbs each)',
        estimatedUnitPrice: 3.99,
        estimatedTotalPrice: 11.97,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Supermarket / Grocery'
      }
    ]
  },
  {
    config: {
      id: 'preset-cocktail-tapas',
      title: 'Chic Cocktail & Charcuterie Tapas Night',
      theme: 'Sophisticated Wine, Cheese & Grazing Board',
      partyType: 'Adult Evening Gathering',
      guestCount: {
        adults: 12,
        kids: 0,
        toddlers: 0,
        total: 12
      },
      durationHours: 3.5,
      mealType: 'heavy_appetizers',
      vibe: 'formal',
      targetBudget: 250,
      currency: '$',
      dietary: {
        vegetarian: 2,
        vegan: 0,
        glutenFree: 2,
        nutFree: 12,
        dairyFree: 1,
        halal: 0,
        kosher: 0,
        otherNotes: 'Separate gluten-free artisan crackers on their own serving slate.'
      },
      equipment: {
        hasGrill: false,
        hasOven: true,
        hasBlender: false,
        hasCoolers: true,
        hasChafingDishes: false,
        needsDisposableTableware: false,
        indoorOutdoor: 'indoor'
      },
      notes: 'Epic charcuterie grazing table, warm baked brie with fig jam, Spanish garlic shrimp, prosciutto crostini, curated wines.'
    },
    cateringHighlights: {
      foodPortionSummary: '3.5 lbs artisan cheese + 2 lbs cured meats + 4 warm tapas dishes.',
      drinkPortionSummary: '36 drinks (6 bottles wine, 1 bottle gin for botanical tonics, sparkling waters).',
      budgetHealth: 'Estimated $219.50 vs target budget $250.00 ($30.50 buffer remaining).',
      topSavingsTip: 'Trader Joe\'s has unbeatable prices on Brie, Manchego, and Prosciutto ($4-6 vs $11 at standard grocer).'
    },
    aiSummary: 'A refined, upscale grazing party for 12 adults with minimal day-of cooking, featuring artisan cheeses, charcuterie pairings, custom gin cocktail bar, and chocolate truffles.',
    timeline: [
      {
        id: 'ck-1',
        timeframe: '3_days_before',
        title: 'Cheese & Wine Sourcing',
        description: 'Shop specialty cheeses, Spanish cured meats, tonics, and wine selections.',
        tasks: [
          { id: 'ck-task-1', text: 'Trader Joe\'s run: Manchego, Truffle Gouda, Brie, Prosciutto, Fig butter, Olives', completed: false },
          { id: 'ck-task-2', text: 'Liquor store: 3 Pinot Noir, 3 Sauvignon Blanc, 1 Empress 1908 or Botanical Gin', completed: false }
        ]
      },
      {
        id: 'ck-3',
        timeframe: 'party_morning',
        title: 'Assemble Charcuterie Board & Chill Wine',
        description: 'Arrange wooden boards, slice crusty baguettes, chill whites and bubbles.',
        tasks: [
          { id: 'ck-task-3', text: 'Take cheeses out 45 mins before party (best aroma at room temp)', completed: false },
          { id: 'ck-task-4', text: 'Fold salami and prosciutto into roses and ribbons across slate board', completed: false },
          { id: 'ck-task-5', text: 'Fill ramekins with Marcona almonds, honeycomb, cornichons, and olives', completed: false }
        ]
      },
      {
        id: 'ck-4',
        timeframe: '2_hours_before',
        title: 'Warm Tapas & Lighting Ambiance',
        description: 'Bake brie in oven, light unscented dinner candles, set lounge playlist.',
        tasks: [
          { id: 'ck-task-6', text: 'Bake wheel of Brie with fig jam & rosemary in oven at 350°F for 15 mins', completed: false },
          { id: 'ck-task-7', text: 'Set out cocktail garnishes: dehydrated citrus, fresh rosemary sprigs, juniper berries', completed: false },
          { id: 'ck-task-8', text: 'Dim main lights and ignite amber taper candles', completed: false }
        ]
      }
    ],
    items: [
      {
        id: 'ck-item-1',
        name: 'Artisan Cheese Trio (Triple Cream Brie, Aged Manchego, Truffle Gouda)',
        category: 'protein_main',
        quantity: 3,
        unit: 'wedges (approx 2.5 lbs total)',
        estimatedUnitPrice: 8.99,
        estimatedTotalPrice: 26.97,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Trader Joe\'s / Specialty',
        dietaryTags: ['Vegetarian', 'Gluten-Free'],
        portionRationale: '3.5 oz cheese per person for grazing spread.'
      },
      {
        id: 'ck-item-2',
        name: 'Cured Charcuterie Trio (Prosciutto di Parma, Genoa Salami, Jamón Serrano)',
        category: 'protein_main',
        quantity: 3,
        unit: 'packs (6oz each)',
        estimatedUnitPrice: 6.99,
        estimatedTotalPrice: 20.97,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Trader Joe\'s / Specialty',
        dietaryTags: ['Gluten-Free', 'Dairy-Free'],
        portionRationale: '2 oz cured meat per person.'
      },
      {
        id: 'ck-item-3',
        name: 'Spanish Garlic Shrimp (Gambas al Ajillo) Ingredients',
        category: 'protein_main',
        quantity: 2,
        unit: 'lbs raw peeled shrimp',
        estimatedUnitPrice: 9.99,
        estimatedTotalPrice: 19.98,
        purchased: false,
        priority: 'recommended',
        recommendedStore: 'Costco / Wholesale',
        dietaryTags: ['Gluten-Free', 'Dairy-Free'],
        portionRationale: 'Warm savory protein tapa, takes 5 mins in skillet with olive oil and garlic.'
      },
      {
        id: 'ck-item-4',
        name: 'Artisan Sliced French Baguettes',
        category: 'bakery_snacks',
        quantity: 2,
        unit: 'loaves',
        estimatedUnitPrice: 2.99,
        estimatedTotalPrice: 5.98,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Bakery / Local Deli'
      },
      {
        id: 'ck-item-5',
        name: 'Gluten-Free Artisan Seed Crackers (Simple Mills)',
        category: 'bakery_snacks',
        quantity: 2,
        unit: 'boxes',
        estimatedUnitPrice: 4.49,
        estimatedTotalPrice: 8.98,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Trader Joe\'s / Specialty',
        dietaryTags: ['Gluten-Free', 'Vegan']
      },
      {
        id: 'ck-item-6',
        name: 'Castelvetrano Green Olives & Cornichons',
        category: 'produce_sides',
        quantity: 2,
        unit: 'jars',
        estimatedUnitPrice: 3.99,
        estimatedTotalPrice: 7.98,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Trader Joe\'s / Specialty',
        dietaryTags: ['Vegan', 'Gluten-Free']
      },
      {
        id: 'ck-item-7',
        name: 'Gourmet Fig Butter & Pure Honeycomb',
        category: 'produce_sides',
        quantity: 1,
        unit: 'bundle',
        estimatedUnitPrice: 6.50,
        estimatedTotalPrice: 6.50,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Trader Joe\'s / Specialty',
        dietaryTags: ['Vegetarian', 'Gluten-Free']
      },
      {
        id: 'ck-item-8',
        name: 'Fresh Seedless Grapes & Fresh Blackberries',
        category: 'produce_sides',
        quantity: 2,
        unit: 'lbs',
        estimatedUnitPrice: 3.49,
        estimatedTotalPrice: 6.98,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Supermarket / Grocery',
        dietaryTags: ['Vegan', 'Gluten-Free']
      },
      {
        id: 'ck-item-9',
        name: 'Curated Wine (3 Pinot Noir + 3 Crisp Sauvignon Blanc)',
        category: 'drinks_alcohol',
        quantity: 6,
        unit: 'bottles (750ml)',
        estimatedUnitPrice: 11.99,
        estimatedTotalPrice: 71.94,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Trader Joe\'s / Specialty',
        portionRationale: 'Half a bottle per guest (2.5 glasses each) across 3.5 hours.'
      },
      {
        id: 'ck-item-10',
        name: 'Craft Botanical Gin (750ml)',
        category: 'drinks_alcohol',
        quantity: 1,
        unit: 'bottle (750ml)',
        estimatedUnitPrice: 24.99,
        estimatedTotalPrice: 24.99,
        purchased: false,
        priority: 'recommended',
        recommendedStore: 'Liquor Store',
        portionRationale: 'For welcome cocktail (Gin & Mediterranean Tonic with Rosemary).'
      },
      {
        id: 'ck-item-11',
        name: 'Fever-Tree Mediterranean Tonic Waters',
        category: 'drinks_non_alcohol',
        quantity: 2,
        unit: '4-packs',
        estimatedUnitPrice: 4.99,
        estimatedTotalPrice: 9.98,
        purchased: false,
        priority: 'recommended',
        recommendedStore: 'Supermarket / Grocery'
      },
      {
        id: 'ck-item-12',
        name: 'Dark Chocolate Sea Salt Truffles',
        category: 'desserts',
        quantity: 1,
        unit: 'box (16 ct)',
        estimatedUnitPrice: 7.99,
        estimatedTotalPrice: 7.99,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Trader Joe\'s / Specialty',
        portionRationale: 'Perfect sweet finish to pair with red wine.'
      },
      {
        id: 'ck-item-13',
        name: 'Clear Cocktail Ice Spheres / Premium Bag',
        category: 'ice_logistics',
        quantity: 1,
        unit: 'bag (10 lbs)',
        estimatedUnitPrice: 4.99,
        estimatedTotalPrice: 4.99,
        purchased: false,
        priority: 'must-have',
        recommendedStore: 'Supermarket / Grocery'
      }
    ]
  }
];
