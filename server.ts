import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Gemini client
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set in environment. Gemini features will require key.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || '',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Endpoint: Generate Full Party Plan & Shopping List
app.post('/api/plan-party', async (req, res) => {
  try {
    const { partyConfig, customPrompt } = req.body;
    if (!partyConfig) {
      return res.status(400).json({ error: 'partyConfig is required' });
    }

    const ai = getAiClient();
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const promptText = `
You are an expert Master Party Planner and Wholesale Grocery / Supplies Shopping Agent.
Generate a comprehensive, realistic, and budget-optimized shopping list and timeline for this event:

EVENT DETAILS:
- Title/Occasion: ${partyConfig.title || 'Party'}
- Theme: ${partyConfig.theme || 'Festive'}
- Party Type: ${partyConfig.partyType || 'Celebration'}
- Guests: ${partyConfig.guestCount.adults} Adults, ${partyConfig.guestCount.kids} Kids, ${partyConfig.guestCount.toddlers} Toddlers (Total: ${partyConfig.guestCount.total})
- Duration: ${partyConfig.durationHours} hours
- Meal Style: ${partyConfig.mealType}
- Vibe: ${partyConfig.vibe}
- Target Budget: ${partyConfig.currency || '$'}${partyConfig.targetBudget}
- Dietary Restrictions: Vegetarian: ${partyConfig.dietary.vegetarian}, Vegan: ${partyConfig.dietary.vegan}, Gluten-Free: ${partyConfig.dietary.glutenFree}, Nut-Free: ${partyConfig.dietary.nutFree}, Dairy-Free: ${partyConfig.dietary.dairyFree}, Halal: ${partyConfig.dietary.halal}, Kosher: ${partyConfig.dietary.kosher}. Notes: ${partyConfig.dietary.otherNotes || 'None'}
- Equipment: Grill: ${partyConfig.equipment?.hasGrill ? 'Yes' : 'No'}, Oven: ${partyConfig.equipment?.hasOven ? 'Yes' : 'No'}, Blender: ${partyConfig.equipment?.hasBlender ? 'Yes' : 'No'}, Coolers: ${partyConfig.equipment?.hasCoolers ? 'Yes' : 'No'}, Needs Disposables: ${partyConfig.equipment?.needsDisposableTableware ? 'Yes' : 'No'}, Setting: ${partyConfig.equipment?.indoorOutdoor || 'indoor'}
- Host Notes/Special Requests: ${partyConfig.notes || 'None'} ${customPrompt ? `\n- Additional user guidance: ${customPrompt}` : ''}

INSTRUCTIONS:
1. Generate an itemized, highly specific shopping list across all relevant categories:
   - 'protein_main' (Main dishes, meats, vegetarian proteins)
   - 'produce_sides' (Veggies, fruits, salads, garnishes, dips)
   - 'bakery_snacks' (Buns, chips, breads, crackers, finger food)
   - 'drinks_alcohol' (Beer, wine, spirits, cocktail ingredients)
   - 'drinks_non_alcohol' (Soda, juice, water, iced tea, seltzers)
   - 'desserts' (Cake, cupcakes, pastries, sweets)
   - 'tableware_disposables' (Plates, cups, napkins, cutlery, trash bags, tablecloths)
   - 'decorations' (Balloons, banners, candles, theme accents)
   - 'ice_logistics' (Ice bags, charcoal/fuel, skewers, serving utensils)
2. Calibrate quantities mathematically for the guest count and duration.
3. Provide realistic US supermarket/club unit prices and totals. Ensure total cost stays close to or within the target budget.
4. Assign optimal store recommendations ('Costco / Wholesale', 'Supermarket / Grocery', 'Trader Joe\\'s / Specialty', 'Liquor Store', 'Target / Walmart', 'Party Store / Amazon', 'Bakery / Local Deli').
5. Provide helpful portion rationale, smart shopping tips, and alternative substitutes.
6. Create an actionable party prep timeline with 4-5 key chronological phases.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: promptText,
      config: {
        systemInstruction: 'You are the ultimate Party Planner Shopping Agent. Always output valid structured JSON matching the provided schema. Provide practical, delicious, and budget-conscious recommendations.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            aiSummary: {
              type: Type.STRING,
              description: 'An executive overview of the party plan and food/beverage strategy.',
            },
            cateringHighlights: {
              type: Type.OBJECT,
              properties: {
                foodPortionSummary: { type: Type.STRING },
                drinkPortionSummary: { type: Type.STRING },
                budgetHealth: { type: Type.STRING },
                topSavingsTip: { type: Type.STRING },
              },
              required: ['foodPortionSummary', 'drinkPortionSummary', 'budgetHealth', 'topSavingsTip'],
            },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  category: {
                    type: Type.STRING,
                    enum: [
                      'protein_main',
                      'produce_sides',
                      'bakery_snacks',
                      'drinks_alcohol',
                      'drinks_non_alcohol',
                      'desserts',
                      'tableware_disposables',
                      'decorations',
                      'ice_logistics',
                    ],
                  },
                  quantity: { type: Type.NUMBER },
                  unit: { type: Type.STRING },
                  estimatedUnitPrice: { type: Type.NUMBER },
                  estimatedTotalPrice: { type: Type.NUMBER },
                  priority: {
                    type: Type.STRING,
                    enum: ['must-have', 'recommended', 'optional'],
                  },
                  recommendedStore: {
                    type: Type.STRING,
                    enum: [
                      'Costco / Wholesale',
                      'Supermarket / Grocery',
                      'Trader Joe\'s / Specialty',
                      'Liquor Store',
                      'Target / Walmart',
                      'Party Store / Amazon',
                      'Bakery / Local Deli',
                    ],
                  },
                  dietaryTags: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  portionRationale: { type: Type.STRING },
                  shoppingTip: { type: Type.STRING },
                  substitutes: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['id', 'name', 'category', 'quantity', 'unit', 'estimatedUnitPrice', 'estimatedTotalPrice', 'priority', 'recommendedStore'],
              },
            },
            timeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  timeframe: {
                    type: Type.STRING,
                    enum: ['1_week_before', '3_days_before', '1_day_before', 'party_morning', '2_hours_before', 'during_party'],
                  },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  tasks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        text: { type: Type.STRING },
                        completed: { type: Type.BOOLEAN },
                      },
                      required: ['id', 'text', 'completed'],
                    },
                  },
                },
                required: ['id', 'timeframe', 'title', 'description', 'tasks'],
              },
            },
          },
          required: ['aiSummary', 'cateringHighlights', 'items', 'timeline'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    
    // Ensure all items have `purchased: false`
    const enrichedItems = (parsed.items || []).map((item: any, idx: number) => ({
      ...item,
      id: item.id || `gen-item-${Date.now()}-${idx}`,
      purchased: false,
    }));

    return res.json({
      aiSummary: parsed.aiSummary,
      cateringHighlights: parsed.cateringHighlights,
      items: enrichedItems,
      timeline: parsed.timeline,
    });
  } catch (err: any) {
    console.error('Error generating party plan:', err);
    return res.status(500).json({ error: err.message || 'Failed to generate party plan' });
  }
});

// Endpoint: Interactive Agent Chat & List Modifications
app.post('/api/agent-chat', async (req, res) => {
  try {
    const { message, currentPlan, chatHistory } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }

    const ai = getAiClient();
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const contextPrompt = `
You are the interactive Party Planner Shopping Agent Assistant.
You have full real-time awareness of the host's current party plan and shopping list:

PARTY SUMMARY:
- Title: ${currentPlan?.config?.title || 'Event'} (${currentPlan?.config?.theme})
- Guests: ${currentPlan?.config?.guestCount?.total} total (${currentPlan?.config?.guestCount?.adults} adults, ${currentPlan?.config?.guestCount?.kids} kids)
- Budget: ${currentPlan?.config?.currency || '$'}${currentPlan?.config?.targetBudget}
- Total Items in Cart: ${currentPlan?.items?.length || 0}
- Current Total Cost: $${(currentPlan?.items || []).reduce((sum: number, it: any) => sum + (it.estimatedTotalPrice || 0), 0).toFixed(2)}

CURRENT SHOPPING ITEMS SAMPLE:
${(currentPlan?.items || []).slice(0, 30).map((it: any) => `- [${it.category}] ${it.name}: ${it.quantity} ${it.unit} ($${it.estimatedTotalPrice}) [Store: ${it.recommendedStore}]`).join('\n')}

USER QUESTION / REQUEST:
"${message}"

INSTRUCTIONS:
1. Answer clearly, concisely, and supportively with exact quantities, cocktail recipes, cost-saving alternatives, prep tips, or dietary adjustments.
2. If the user asks to add, remove, substitute, or modify items in their shopping list, include an optional \`itemModifications\` payload in the JSON response so the client can automatically apply the changes with one click!
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: contextPrompt,
      config: {
        systemInstruction: 'You are a warm, highly experienced party catering and grocery logistics copilot. Provide actionable answers, precise math, and optional structured item modifications when requested.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            replyText: {
              type: Type.STRING,
              description: 'The conversational response to the user with explanations, recipe steps, or tips.',
            },
            suggestedActions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  action: { type: Type.STRING },
                },
                required: ['label', 'action'],
              },
            },
            itemModifications: {
              type: Type.OBJECT,
              properties: {
                itemsToAdd: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      category: { type: Type.STRING },
                      quantity: { type: Type.NUMBER },
                      unit: { type: Type.STRING },
                      estimatedUnitPrice: { type: Type.NUMBER },
                      estimatedTotalPrice: { type: Type.NUMBER },
                      priority: { type: Type.STRING },
                      recommendedStore: { type: Type.STRING },
                      portionRationale: { type: Type.STRING },
                      shoppingTip: { type: Type.STRING },
                    },
                    required: ['name', 'category', 'quantity', 'unit', 'estimatedUnitPrice', 'estimatedTotalPrice', 'priority', 'recommendedStore'],
                  },
                },
                itemNamesToRemove: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
            },
          },
          required: ['replyText'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in agent chat:', err);
    return res.status(500).json({ error: err.message || 'Agent chat error' });
  }
});

// Endpoint: Cost Optimizer / Budget Trimmer
app.post('/api/cost-optimize', async (req, res) => {
  try {
    const { currentPlan, targetBudget } = req.body;
    const ai = getAiClient();
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
    }

    const currentTotal = (currentPlan?.items || []).reduce((sum: number, it: any) => sum + (it.estimatedTotalPrice || 0), 0);
    const promptText = `
The host needs to optimize and reduce their party shopping list cost.
Current Total: $${currentTotal.toFixed(2)}
Target Budget: $${targetBudget || currentPlan?.config?.targetBudget || 200}
Guest Count: ${currentPlan?.config?.guestCount?.total} guests

CURRENT ITEMS:
${(currentPlan?.items || []).map((it: any) => `- ID: ${it.id} | Name: ${it.name} | Cat: ${it.category} | Qty: ${it.quantity} ${it.unit} | Cost: $${it.estimatedTotalPrice} | Priority: ${it.priority}`).join('\n')}

Analyze all items and recommend:
1. High-impact ingredient swaps (e.g. flank steak -> chuck/chicken thighs, brand liquor -> Kirkland/well, custom cake -> bakery cupcakes, pre-cut fruit -> whole melons).
2. Items that can be marked optional or quantity reduced without hurting guest satisfaction.
3. Bulk store migration advice (which items to buy at wholesale club to cut 40%).
4. Return an updated list of items with revised quantities/unit prices, plus detailed explanation of savings.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: promptText,
      config: {
        systemInstruction: 'You are an aggressive yet hospitable party budget optimizer. Find real savings without compromising taste or guest hospitality.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            savingsSummary: { type: Type.STRING },
            totalSavedAmount: { type: Type.NUMBER },
            newTotalEstimate: { type: Type.NUMBER },
            optimizationTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            updatedItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  unit: { type: Type.STRING },
                  estimatedUnitPrice: { type: Type.NUMBER },
                  estimatedTotalPrice: { type: Type.NUMBER },
                  priority: { type: Type.STRING },
                  recommendedStore: { type: Type.STRING },
                  portionRationale: { type: Type.STRING },
                  shoppingTip: { type: Type.STRING },
                },
                required: ['id', 'name', 'category', 'quantity', 'unit', 'estimatedUnitPrice', 'estimatedTotalPrice', 'priority', 'recommendedStore'],
              },
            },
          },
          required: ['savingsSummary', 'totalSavedAmount', 'newTotalEstimate', 'optimizationTips', 'updatedItems'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in cost optimize:', err);
    return res.status(500).json({ error: err.message || 'Cost optimizer error' });
  }
});

// Endpoint: AI Voice Control & Hands-Free Intent Parser
app.post('/api/voice-command', async (req, res) => {
  try {
    const { speechText, currentPlan, currentContext } = req.body;
    if (!speechText) {
      return res.status(400).json({ error: 'speechText is required' });
    }

    const ai = getAiClient();
    if (!process.env.GEMINI_API_KEY) {
      // Return a basic fallback response if API key is not configured
      return res.json({
        intent: 'UNKNOWN',
        speechReply: `I heard: "${speechText}". Please ensure the Gemini API key is active for advanced voice command parsing.`,
      });
    }

    const currentItemsSample = (currentPlan?.items || []).slice(0, 35).map((it: any) => 
      `"${it.name}" (ID: ${it.id}, Qty: ${it.quantity} ${it.unit}, Price: $${it.estimatedTotalPrice}, Purchased: ${it.purchased})`
    ).join(', ');

    const promptText = `
You are the voice control brain for the CymbalMart Party Planner Shopping Agent.
A customer is speaking hands-free commands. Interpret their speech utterance and map it to an actionable application command.

CURRENT APP STATE:
- Event: "${currentPlan?.config?.title || 'Party'}" (${currentPlan?.config?.guestCount?.total || 10} guests, Budget: $${currentPlan?.config?.targetBudget || 200})
- Active Screen / Modal: "${currentContext?.activeModal || 'dashboard'}"
- Current Shopping Items: ${currentItemsSample || 'None'}

USER SPOKEN UTTERANCE:
"${speechText}"

POSSIBLE INTENTS:
1. "ADD_ITEM": User wants to add an item (e.g., "Add 3 boxes of cookies for 12 dollars", "We need 2 packs of hamburger buns at supermarket").
2. "REMOVE_ITEM": User wants to delete an item (e.g., "Remove salsa", "Delete paper plates").
3. "MARK_PURCHASED": User bought an item or wants to check it off (e.g., "Check off ground beef", "I bought the tortilla chips", "Mark soda as purchased").
4. "UNMARK_PURCHASED": User wants to uncheck an item (e.g., "Uncheck ground beef", "Put chips back on shopping list").
5. "UPDATE_QUANTITY": User wants to change item quantity (e.g., "Change beer to 4 packs", "Increase ice bags to 5").
6. "UPDATE_PRICE": User wants to change price of an item (e.g., "Set chicken price to 15 dollars").
7. "SET_BUDGET": User wants to adjust target budget (e.g., "Set budget to 350 dollars", "Change budget to 500").
8. "NAVIGATE": User wants to open a screen or filter (e.g., "Open portion calculator", "Show timeline", "Open export list", "Show budget optimizer", "Show only Costco items", "Filter by drinks", "Show all items", "Open chat assistant").
9. "CHECKOUT": User wants to go to checkout (e.g., "Proceed to checkout", "Ready to checkout", "Open checkout").
10. "SELECT_FULFILLMENT": User selects fulfillment option (e.g., "Select Curbside Pickup", "Choose Express Delivery", "Show in-store aisle map").
11. "CONFIRM_ORDER": User wants to place the order (e.g., "Confirm and place order", "Submit order", "Finish checkout").
12. "CLOSE_MODAL": User wants to close or go back (e.g., "Close", "Go back", "Cancel modal").
13. "CREATE_PLAN": User wants to plan a new party (e.g., "Plan a BBQ for 20 adults with a budget of 400 dollars").
14. "OPTIMIZE_BUDGET": User asks to optimize/trim budget (e.g., "Trim my list", "Optimize for 200 dollars").
15. "ANSWER_QUESTION": User asks a catering, recipe, portion, or grocery question (e.g., "How much ice for 20 people?", "What drinks do I need?").

INSTRUCTIONS:
- Identify the most accurate intent.
- Craft a concise, natural, and friendly 'speechReply' (1-2 short sentences) that will be read aloud back to the customer via Text-to-Speech so they know their command succeeded.
- Provide all extracted structured parameters in 'data'.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: promptText,
      config: {
        systemInstruction: 'You are an accurate, fast voice control intent extractor for a party shopping app. Output valid JSON matching the schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            intent: {
              type: Type.STRING,
              enum: [
                'ADD_ITEM',
                'REMOVE_ITEM',
                'MARK_PURCHASED',
                'UNMARK_PURCHASED',
                'UPDATE_QUANTITY',
                'UPDATE_PRICE',
                'SET_BUDGET',
                'NAVIGATE',
                'CHECKOUT',
                'SELECT_FULFILLMENT',
                'CONFIRM_ORDER',
                'CLOSE_MODAL',
                'CREATE_PLAN',
                'OPTIMIZE_BUDGET',
                'ANSWER_QUESTION',
                'UNKNOWN',
              ],
            },
            speechReply: {
              type: Type.STRING,
              description: 'Clear, reassuring verbal confirmation to speak back to the user.',
            },
            data: {
              type: Type.OBJECT,
              properties: {
                targetItemName: { type: Type.STRING },
                quantity: { type: Type.NUMBER },
                unit: { type: Type.STRING },
                price: { type: Type.NUMBER },
                budget: { type: Type.NUMBER },
                modalName: {
                  type: Type.STRING,
                  enum: ['setup', 'portions', 'timeline', 'cost_optimizer', 'export', 'checkout', 'chat', 'none'],
                },
                filterStore: { type: Type.STRING },
                filterCategory: { type: Type.STRING },
                searchQuery: { type: Type.STRING },
                fulfillmentType: {
                  type: Type.STRING,
                  enum: ['pickup', 'delivery', 'instore'],
                },
                planDetails: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    theme: { type: Type.STRING },
                    adults: { type: Type.NUMBER },
                    kids: { type: Type.NUMBER },
                    budget: { type: Type.NUMBER },
                    mealType: { type: Type.STRING },
                  },
                },
                newItem: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    category: { type: Type.STRING },
                    quantity: { type: Type.NUMBER },
                    unit: { type: Type.STRING },
                    estimatedUnitPrice: { type: Type.NUMBER },
                    estimatedTotalPrice: { type: Type.NUMBER },
                    priority: { type: Type.STRING },
                    recommendedStore: { type: Type.STRING },
                  },
                },
                answer: { type: Type.STRING },
              },
            },
          },
          required: ['intent', 'speechReply'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in voice command parse:', err);
    return res.status(500).json({
      intent: 'UNKNOWN',
      speechReply: 'Sorry, I ran into an issue parsing that voice command. Could you try again?',
      error: err.message,
    });
  }
});

// Vite middleware & Static serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Party Planner Shopping Agent server running on http://localhost:${PORT}`);
  });
}

start();
