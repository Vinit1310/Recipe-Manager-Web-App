/* Simple Recipe Manager (Purple theme)
   - localStorage key: "recipes"
   - CRUD, Search by title, Difficulty filter
   - Image upload (stored as data URL) + optional Image URL
   - Client-side validation
*/

const KEY = "recipes";

// DOM refs
const listEl = document.getElementById("list");
const searchInput = document.getElementById("searchInput");
const difficultyFilter = document.getElementById("difficultyFilter");
const btnAdd = document.getElementById("btnAdd");

const modal = document.getElementById("modal");
const modalBackdrop = document.getElementById("modalBackdrop");
const modalClose =
  document.getElementById("modalClose") ||
  document.getElementById("modalClose");
const form = document.getElementById("form");
const recipeId = document.getElementById("recipeId");
const titleI = document.getElementById("title");
const descriptionI = document.getElementById("description");
const ingredientsI = document.getElementById("ingredients");
const stepsI = document.getElementById("steps");
const categoryI = document.getElementById("category");
const difficultyI = document.getElementById("difficulty");
const prepI = document.getElementById("prepTime");
const imageFileI = document.getElementById("imageFile");
const imageUrlI = document.getElementById("imageUrl");
const previewImg = document.getElementById("preview");
const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");
const deleteBtn = document.getElementById("deleteBtn");
const formErrors = document.getElementById("formErrors");

// helper
const q = (sel) => document.querySelector(sel);

// load & save
function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) throw new Error("bad data");
    return arr;
  } catch (e) {
    console.warn("localStorage corrupted or empty, resetting.", e);
    localStorage.removeItem(KEY);
    return [];
  }
}
function save(arr) {
  localStorage.setItem(KEY, JSON.stringify(arr));
}

// seed single candidate recipe + small samples
function seedIfEmpty() {
  const arr = load();
  if (arr.length) return;
  const now = () => Date.now() + Math.floor(Math.random() * 1000);

  const seed = [
    {
      id: now(),
      title: "Bread Omelette (for 2)",
      description:
        "A popular Indian street food breakfast dish where bread slices are dipped in spiced egg mixture and pan-fried until golden and crispy. Perfect for a quick, filling breakfast or snack.",
      ingredients: [
        "1) 4 bread slices",
        "2) 3 large eggs",
        "3) 1 small onion, finely chopped",
        "4) 1 small tomato, finely chopped",
        "5) 1 green chili, finely chopped (optional)",
        "6) 2 tablespoons fresh coriander leaves, chopped",
        "7) 1/4 teaspoon turmeric powder",
        "8) 1/4 teaspoon red chili powder",
        "9) 1/4 teaspoon black pepper powder",
        "10) Salt to taste",
        "11) 2-3 tablespoons oil or butter for cooking",
      ],
      steps: [
        "1) Crack the eggs into a wide, shallow bowl and beat them well with a fork or whisk.",
        "2) Add the chopped onions, tomatoes, green chili, and coriander leaves to the beaten eggs.",
        "3) Add turmeric powder, red chili powder, black pepper powder, and salt to the egg mixture.",
        "4) Mix all the ingredients together until well combined and set aside.",
        "5) Heat a flat pan or tawa over medium heat and add 1 tablespoon of oil or butter.",
        "6) Dip one bread slice into the egg mixture, coating both sides thoroughly but don't let it soak too long or it will break.",
        "7) Place the egg-coated bread slice on the hot pan immediately.",
        "8) Pour a little extra egg mixture on top of the bread slice to cover any dry spots.",
        "9) Cook for 2-3 minutes until the bottom turns golden brown and crispy.",
        "10) Flip the bread omelette carefully using a spatula and cook the other side for another 2-3 minutes.",
        "11) Press gently with the spatula to ensure even cooking and crispiness.",
        "12) Remove from pan when both sides are golden brown and crispy.",
        "13) Repeat the process with remaining bread slices, adding more oil or butter as needed.",
        "14) Serve hot with ketchup, green chutney, or your favorite sauce.",
        "Serving Suggestions: Best enjoyed hot and fresh. Pairs wonderfully with a cup of chai or coffee for breakfast!",
      ],
      prepTime: 10,
      difficulty: "Easy",
      category: "Breakfast",
      image: "images\bread-omlette.png",
      createdAt: new Date().toISOString(),
    },

    {
      id: now() + 1,
      title: "Masala Omelette",
      description:
        "A flavorful Indian-style omelette loaded with onions, tomatoes, green chilies, and aromatic spices. This protein-packed breakfast is spicy, savory, and incredibly satisfying. A popular choice at street food stalls and home kitchens across India.",
      ingredients: [
        "1) 3 large eggs",
        "2) 1 small onion, finely chopped",
        "3) 1 small tomato, finely chopped",
        "4) 1-2 green chilies, finely chopped",
        "5) 2 tablespoons fresh coriander leaves, chopped:",
        "6) 1/4 teaspoon turmeric powder",
        "7) 1/4 teaspoon red chili powder",
        "8) 1/4 teaspoon cumin powder (optional)",
        "9) 1/4 teaspoon garam masala (optional)",
        "10) Salt to taste",
        "11) Black pepper powder to taste:",
        "12) 2 tablespoons oil or butter for cooking],",
      ],
      steps: [
        "1) Crack the eggs into a mixing bowl and beat them well with a fork or whisk until fluffy.",
        "2) Add the finely chopped onions to the beaten eggs.",
        "3) Add the chopped tomatoes, green chilies, and fresh coriander leaves to the egg mixture.",
        "4) Add turmeric powder, red chili powder, cumin powder, and garam masala to the bowl.",
        "5) Season with salt and black pepper powder according to your taste.",
        "6) Mix all the ingredients thoroughly until everything is well combined.",
        "7) Heat a non-stick pan or tawa over medium heat and add oil or butter.",
        "8) Once the oil is hot, pour the entire egg mixture into the pan and spread it evenly.",
        "9) Let it cook undisturbed for 2-3 minutes on medium-low heat until the bottom sets and turns golden.",
        "10) Check the edges - when they start lifting from the pan, the omelette is ready to flip.",
        "11) Carefully flip the omelette using a spatula to cook the other side, or fold it in half if preferred.",
        "12) Cook for another 1-2 minutes until the other side is golden brown and the eggs are fully cooked.",
        "13) Press gently with the spatula to ensure even cooking throughout.",
        "14) Remove from heat and transfer to a serving plate.",
        "15) Garnish with extra coriander leaves if desired and serve hot.",
        "Serving Suggestions: Serve with buttered toast, pav (bread rolls), paratha, or simply enjoy on its own with ketchup or green chutney on the side.",
        "Pro Tips:",
        "1) For a softer omelette, cook on lower heat",
        "2) For extra richness, add a splash of milk or cream to the eggs",
        "3) Adjust spice levels according to your preference",
      ],
      prepTime: 8,
      difficulty: "Easy",
      category: "Breakfast",
      image: images / Masala - Omlette.jpg,
      createdAt: new Date().toISOString(),
    },

    {
      id: now() + 2,
      title: "Vegetable Pulao",
      description:
        "A fragrant and colorful one-pot Indian rice dish cooked with aromatic spices and mixed vegetables. This mildly spiced, flavorful pulao is perfect for lunch or dinner and pairs wonderfully with raita, curry, or dal. Quick, easy, and absolutely delicious!",
      ingredients: [
        "1) 1.5 cups basmati rice",
        "2) 1 cup mixed vegetables (carrots, beans, peas, cauliflower), chopped",
        "3) 1 large onion, thinly sliced",
        "4) 1 tomato, chopped",
        "5) 2-3 green chilies, slit lengthwise",
        "6) 1 tablespoon ginger-garlic paste",
        "7) 3 cups water",
        "8) 3 tablespoons oil or ghee",
        "9) 1 bay leaf",
        "10) 4-5 whole cloves",
        "11) 2-3 green cardamom pods",
        "12) 1 inch cinnamon stick",
        "13) 1 teaspoon cumin seeds",
        "14) 1/2 teaspoon turmeric powder",
        "15) 1/2 teaspoon red chili powder (optional)",
        "16) 1/2 teaspoon garam masala",
        "17) Salt to taste",
        "18) Fresh coriander leaves for garnish",
        "19) Fresh mint leaves, chopped (optional)",
        "20) Juice of half a lemon (optional)",
      ],
      steps: [
        "1) Wash the basmati rice thoroughly in cold water 2-3 times until the water runs clear, then soak it in water for 20 minutes.",
        "2) After soaking, drain the rice completely and set aside.",
        "3) Wash and chop all the vegetables into small, uniform pieces for even cooking.",
        "4) Heat oil or ghee in a heavy-bottomed pot or pressure cooker over medium heat.",
        "5) Add the bay leaf, cloves, cardamom pods, cinnamon stick, and cumin seeds to the hot oil.",
        "6) Let the whole spices crackle and release their aroma for about 30 seconds.",
        "7) Add the sliced onions and sauté until they turn golden brown, about 5-6 minutes.",
        "8) Add the ginger-garlic paste and slit green chilies, and sauté for 1-2 minutes until the raw smell disappears.",
        "9) Add the chopped tomatoes and cook for 2-3 minutes until they soften and become mushy.",
        "10) Add all the chopped mixed vegetables and stir well to combine with the masala.",
        "11) Add turmeric powder, red chili powder, and salt, and mix everything together.",
        "12) Sauté the vegetables for 3-4 minutes on medium heat, stirring occasionally.",
        "13) Add the drained rice to the pot and gently mix with the vegetables, being careful not to break the rice grains.",
        "14) Sauté the rice with vegetables for 2 minutes, stirring gently to coat the rice with the spices.",
        "15) Add 3 cups of water (ratio of 1:2 for rice to water) and add garam masala and chopped mint leaves if using.",
        "16) Taste and adjust salt if needed, then stir gently once.",
        "17) Increase the heat to high and bring the mixture to a boil.",
        "18) Once it starts boiling, reduce the heat to low, cover the pot with a tight-fitting lid.",
        "19) Cook on low heat for 15-18 minutes until the rice is fully cooked and water is absorbed (or 2 whistles if using pressure cooker).",
        "20) Turn off the heat and let the pulao rest covered for 5 minutes without opening the lid.",
        "21) After resting, open the lid and gently fluff the rice with a fork, separating the grains carefully.",
        "22) Add lemon juice if desired and garnish with fresh coriander leaves.",
        "23) Serve hot with raita, papad, pickle, or your favorite curry.",
        "Serving Suggestions: Pairs perfectly with cucumber raita, boondi raita, plain yogurt, dal fry, or any curry of your choice.",
        "Pro Tips:",
        "1) Don't skip soaking the rice - it helps achieve long, separate grains",
        "2) Use aged basmati rice for best results",
        "3) Don't over-stir after adding rice to prevent it from becoming mushy",
        "4) You can add paneer cubes or cashews for extra richness",
      ],
      prepTime: 35,
      difficulty: "Medium",
      category: "Lunch",
      image: images / veg - pulao.jpg,
      createdAt: new Date().toISOString(),
    },

    // ⭐ NEW RECIPE 1
    {
      id: now() + 3,
      title: "Paneer Butter Masala",
      description:
        "A rich, creamy, and indulgent North Indian curry featuring soft paneer cubes in a silky tomato-based gravy with butter and cream. This restaurant-style dish is mildly spiced, slightly sweet, and incredibly flavorful. Perfect for special occasions or when you're craving comfort food!",
      ingredients: [
        "A) For the Gravy:",
        "1) 400g paneer (cottage cheese), cut into cubes",
        "2) 4-5 large tomatoes, roughly chopped",
        "3) 2 medium onions, roughly chopped",
        "4) 8-10 cashew nuts",
        "5) 1 tablespoon ginger-garlic paste",
        "6) 2-3 green chilies",
        "7) 1 bay leaf",
        "8) 2-3 green cardamom pods",
        "9) 1 inch cinnamon stick",
        "10) 3-4 cloves",
        "11) 1 teaspoon cumin seeds",
        "12) 2 tablespoons butter",
        "13) 2 tablespoons oil",
        "B) For the Masala:",
        "1) 3 tablespoons butter",
        "2) 1 teaspoon red chili powder",
        "3) 1 teaspoon coriander powder",
        "4) 1/2 teaspoon turmeric powder",
        "5) 1 teaspoon garam masala",
        "6) 1 teaspoon dried fenugreek leaves (kasuri methi)",
        "7) 1-2 teaspoons sugar",
        "8) Salt to taste",
        "9) 1/2 cup fresh cream",
        "10) 1/4 cup milk (optional)",
        "11) Fresh coriander leaves for garnish",
      ],
      steps: [
        "A) Making the Base Gravy:",
        "1) Heat 2 tablespoons butter and 2 tablespoons oil in a pan over medium heat.",
        "2) Add the bay leaf, cardamom pods, cinnamon stick, cloves, and cumin seeds, and let them crackle for 30 seconds.",
        "3) Add the chopped onions and sauté until they turn translucent and soft, about 5-6 minutes.",
        "4) Add the ginger-garlic paste and green chilies, and cook for 1-2 minutes until the raw smell disappears.",
        "5) Add the chopped tomatoes and cashew nuts to the pan.",
        "6) Add a pinch of salt and mix everything well.",
        "7) Cover the pan with a lid and cook for 10-12 minutes until the tomatoes are completely soft and mushy, stirring occasionally.",
        "8) Turn off the heat and let the mixture cool down to room temperature for 10 minutes.",
        "9) Remove the whole spices (bay leaf, cardamom, cinnamon, cloves) from the mixture if you can spot them.",
        "10) Transfer the cooled mixture to a blender and blend into a smooth, fine paste, adding a little water if needed.",
        "11) Strain the blended mixture through a fine sieve to get a silky smooth gravy (optional but recommended for restaurant-style texture).",
        "B) Preparing the Paneer:",
        "1) Cut the paneer into cubes (about 1-inch size) and soak them in warm water for 10 minutes to keep them soft.",
        "2) Drain the water and set the paneer cubes aside.",
        "C) Making the Final Curry:",
        "1) Heat 3 tablespoons of butter in the same pan over medium heat.",
        "2) Add the strained tomato-onion gravy to the pan and cook for 3-4 minutes, stirring continuously.",
        "3) Add red chili powder, coriander powder, turmeric powder, and salt to taste, and mix well.",
        "4) Cook the masala for 5-6 minutes on medium heat, stirring occasionally until the oil starts separating from the sides.",
        "5) Add sugar and mix well to balance the tanginess of the tomatoes.",
        "6) Crush the dried fenugreek leaves (kasuri methi) between your palms and add to the gravy for authentic flavor.",
        "7) Add the fresh cream and mix thoroughly until the gravy becomes rich and creamy.",
        "8) If the gravy is too thick, add milk or water to adjust the consistency.",
        "9) Add garam masala and mix well.",
        "10) Gently add the paneer cubes to the gravy and mix carefully without breaking them.",
        "11) Let the paneer simmer in the gravy for 2-3 minutes on low heat to absorb the flavors.",
        "12) Turn off the heat and garnish with fresh coriander leaves.",
        "13) Drizzle a little fresh cream on top before serving for extra richness.",
        "14) Serve hot with naan, roti, paratha, jeera rice, or garlic naan.",
        "Serving Suggestions: Best enjoyed with butter naan, garlic naan, tandoori roti, or steamed basmati rice. Add a side of onion rings, green chutney, and papad for a complete meal.",
        "Pro Tips:",
        "1) Soaking paneer in warm water keeps it soft and prevents it from becoming rubbery",
        "2) Don't skip the cashews - they add creaminess and richness to the gravy",
        "3) Straining the gravy gives it a restaurant-style smooth texture",
        "4) Adjust the amount of cream and butter based on how rich you want the dish",
        "5) You can add a tablespoon of honey instead of sugar for natural sweetness",
      ],
      prepTime: 30,
      difficulty: "Medium",
      category: "Dinner",
      image: images / paneer - butter - masala.webp,
      createdAt: new Date().toISOString(),
    },

    // ⭐ NEW RECIPE 2
    {
      id: now() + 4,
      title: "Aloo Paratha",
      description:
        "A popular North Indian flatbread stuffed with spiced mashed potato filling. These golden, crispy parathas are a beloved breakfast dish that's hearty, flavorful, and incredibly satisfying. Perfect with yogurt, pickle, and a dollop of butter!",
      ingredients: [
        "A) For the Dough:",
        "1) 2 cups whole wheat flour (atta)",
        "2) 1/2 teaspoon salt",
        "3) 1 tablespoon oil",
        "4) Water as needed (about 3/4 cup)",
        "B) For the Potato Filling:",
        "1) 3-4 medium potatoes, boiled and mashed",
        "2) 1 medium onion, finely chopped (optional)",
        "3) 2-3 green chilies, finely chopped",
        "4) 1 tablespoon ginger, grated",
        "5) 2 tablespoons fresh coriander leaves, chopped",
        "6) 1 teaspoon cumin seeds",
        "7) 1/2 teaspoon red chili powder",
        "8) 1/2 teaspoon garam masala",
        "9) 1/2 teaspoon coriander powder",
        "10) 1/2 teaspoon amchur (dry mango powder) or chaat masala",
        "11) Salt to taste",
        "12) 1 tablespoon lemon juice (optional)",
        "C) For Cooking:",
        "1) Ghee or butter for roasting",
        "2) Extra wheat flour for dusting",
      ],
      steps: [
        "A) Making the Dough:",
        "1) Take whole wheat flour in a large mixing bowl and add salt and oil.",
        "2) Mix the flour, salt, and oil together with your fingers until the mixture resembles breadcrumbs.",
        "3) Gradually add water, a little at a time, and knead into a soft, smooth, and pliable dough.",
        "4) Knead the dough for 5-6 minutes until it becomes smooth and non-sticky.",
        "5) Cover the dough with a damp cloth and let it rest for 20-30 minutes.",
        "B) Preparing the Potato Filling:",
        "1) Boil the potatoes until fully cooked, then peel and mash them thoroughly while still warm (no lumps).",
        "2) Heat 1 teaspoon of oil in a small pan and add cumin seeds, letting them crackle.",
        "3) Add the grated ginger, chopped green chilies, and chopped onions (if using), and sauté for 2 minutes.",
        "4) Turn off the heat and add this tempering to the mashed potatoes.",
        "5) Add red chili powder, garam masala, coriander powder, amchur powder, and salt to the potatoes.",
        "6) Add the chopped coriander leaves and lemon juice if using.",
        "7) Mix everything thoroughly until all spices are well combined with the potatoes.",
        "8) Taste and adjust the seasoning - the filling should be well-spiced and flavorful.",
        "9) Divide the potato filling into 8-10 equal portions and roll them into balls. Set aside.",
        "C) Assembling and Cooking the Parathas:",
        "1) After the dough has rested, knead it once more for a minute and divide into 8-10 equal portions.",
        "2) Roll each dough portion into a smooth ball between your palms.",
        "3) Take one dough ball and flatten it slightly, then dust it with flour.",
        "4) Roll it out into a small circle of about 4 inches diameter using a rolling pin.",
        "5) Place one potato filling ball in the center of the rolled dough circle.",
        "6) Bring the edges of the dough together to cover the filling completely, pinching them at the top to seal.",
        "7) Flatten the stuffed ball gently with your palms, being careful not to let the filling break through.",
        "8) Dust the stuffed ball with flour on both sides.",
        "9) Gently roll it out into a circle of about 7-8 inches diameter, applying even pressure and rotating as you roll.",
        "10) If the filling breaks through while rolling, patch it with a pinch of dough and dust with flour.",
        "11) Heat a tawa or flat griddle over medium-high heat until hot.",
        "12) Carefully place the rolled paratha on the hot tawa.",
        "13) Cook for 1-2 minutes until you see small bubbles appearing on the surface.",
        "14) Flip the paratha and cook the other side for 1 minute.",
        "15) Apply ghee or butter generously on the cooked side.",
        "16) Flip again and apply ghee on the second side as well.",
        "17) Press gently with a spatula and cook until both sides have golden brown spots and the paratha is crispy.",
        "18) Remove from tawa and place on a plate.",
        "19) Repeat the process with remaining dough and filling portions.",
        "20) Serve hot aloo parathas with butter on top, yogurt, pickle, and green chutney.",
        "Serving Suggestions: Best enjoyed hot with fresh yogurt (dahi), mango pickle (achar), butter, green chutney, or tomato ketchup. A glass of lassi or buttermilk makes it a complete meal!",
        "Pro Tips:",
        "1) Make sure the potato filling is completely cool before stuffing to prevent the dough from becoming sticky",
        "2) Don't over-stuff the parathas or they'll be difficult to roll",
        "3)Roll gently and evenly to prevent the filling from breaking through",
        "4) Keep the heat at medium to ensure the paratha cooks through without burning",
        "5) You can make the dough and filling ahead of time and refrigerate them",
        "6) For softer parathas, apply ghee while cooking; for crispier ones, apply less ghee",
      ],
      prepTime: 25,
      difficulty: "Easy",
      category: "Breakfast",
      image: images / aloo - paratha.webp,
      createdAt: new Date().toISOString(),
    },

    // ⭐ NEW RECIPE 3
    {
      id: now() + 5,
      title: "Chocolate Milkshake",
      description:
        "A thick, creamy, and indulgent chocolate milkshake that's perfect for satisfying your sweet tooth. This rich and velvety drink is made with ice cream, milk, and chocolate, creating a delicious treat that's loved by kids and adults alike. Perfect for hot summer days or as a dessert drink!",
      ingredients: [
        "1) 3-4 scoops vanilla ice cream (about 2 cups)",
        "2) 1 cup chilled milk",
        "3) 3 tablespoons chocolate syrup or cocoa powder",
        "4) 2 tablespoons sugar (adjust to taste)",
        "5) 1/4 teaspoon vanilla extract",
        "6) 6-8 ice cubes (optional, for extra thickness)",
        "7) 2 tablespoons chocolate chips (optional)",
        "8) Whipped cream for topping",
        "9) Chocolate shavings or cocoa powder for garnish",
        "10) Chocolate syrup for drizzling",
        "11) Cherries for decoration (optional)",
      ],
      steps: [
        "1) Chill your serving glasses in the freezer for 10-15 minutes before making the milkshake for best results.",
        "2) If using cocoa powder instead of chocolate syrup, mix it with 2 tablespoons of warm milk to make a smooth paste first.",
        "3) Take a blender jar and add the vanilla ice cream scoops as the base.",
        "4) Pour the chilled milk into the blender with the ice cream.",
        "5) Add the chocolate syrup (or cocoa paste) to the blender.",
        "6) Add sugar according to your sweetness preference (adjust based on how sweet your chocolate syrup is).",
        "7) Add the vanilla extract for enhanced flavor.",
        "8) If you want a thicker, colder milkshake, add the ice cubes now.",
        "9) Add chocolate chips if using for extra chocolate flavor and texture.",
        "10) Close the blender lid tightly and blend on high speed for 30-45 seconds until smooth and creamy.",
        "11) Stop and check the consistency - if it's too thick, add a little more milk and blend again.",
        "12) If it's too thin, add another scoop of ice cream and blend until you reach desired consistency.",
        "13) Taste the milkshake and adjust sweetness if needed by adding more sugar or chocolate syrup.",
        "14) Remove the chilled glasses from the freezer.",
        "15) Drizzle chocolate syrup on the inside walls of the glasses for a decorative touch.",
        "16) Pour the chocolate milkshake into the prepared glasses, filling them about 3/4 full.",
        "17) Top each glass generously with whipped cream, creating a nice swirl on top.",
        "18) Drizzle more chocolate syrup over the whipped cream.",
        "19) Sprinkle chocolate shavings or dust with cocoa powder for garnish.",
        "20) Place a cherry on top if desired for a classic milkshake look.",
        "21) Serve immediately with a straw and a long spoon for the best experience.",
        "Serving Suggestions: Serve with cookies, brownies, or wafers on the side. Perfect as an after-dinner dessert or afternoon treat!",
        "Variations:",
        "1) Double Chocolate: Use chocolate ice cream instead of vanilla for extra richness",
        "2) Nutty Chocolate: Add 1 tablespoon peanut butter or Nutella",
        "3) Mint Chocolate: Add a few drops of peppermint extract",
        "4) Mocha Shake: Add 1 teaspoon instant coffee powder",
        "5) Oreo Chocolate: Add 3-4 crushed Oreo cookies while blending",
        "Pro Tips:",
        "1) Use good quality ice cream for the creamiest results",
        "2) Don't over-blend or the ice cream will melt too much",
        "3) For a healthier version, use frozen bananas instead of ice cream",
        "4) Make it extra special by rimming the glass with chocolate syrup and crushed cookies",
        "5) For adults, add a shot of chocolate liqueur or Irish cream",
      ],
      prepTime: 5,
      difficulty: "Easy",
      category: "Drinks",
      image: chocolate - milkshake.jpg,
      createdAt: new Date().toISOString(),
    },
  ];

  save(seed);
}

// rendering
function createCard(r) {
  const card = document.createElement("article");
  card.className = "card";
  // image
  if (r.image) {
    const wrap = document.createElement("div");
    wrap.className = "image";
    const img = document.createElement("img");
    img.src = r.image;
    img.alt = r.title;
    wrap.appendChild(img);
    card.appendChild(wrap);
  } else {
    const wrap = document.createElement("div");
    wrap.className = "image";
    // gradient rectangle as placeholder
    wrap.innerHTML = "";
    card.appendChild(wrap);
  }

  const h = document.createElement("h3");
  h.textContent = r.title;
  card.appendChild(h);
  const meta = document.createElement("div");
  meta.className = "meta";
  meta.innerHTML = `<span class="muted">${
    r.category || ""
  }</span><span class="badge ${
    r.difficulty ? r.difficulty.toLowerCase() : ""
  }">${r.difficulty || ""}</span>`;
  card.appendChild(meta);

  const desc = document.createElement("p");
  desc.className = "muted";
  desc.textContent = r.description || "";
  card.appendChild(desc);

  const actions = document.createElement("div");
  actions.className = "actions";
  const btnView = document.createElement("button");
  btnView.textContent = "View";
  btnView.classList.add("btn-view");
  btnView.onclick = () => openView(r.id);
  const btnEdit = document.createElement("button");
  btnEdit.textContent = "Edit";
  btnEdit.classList.add("btn-edit");
  btnEdit.onclick = () => openEdit(r.id);
  const btnDelete = document.createElement("button");
  btnDelete.textContent = "Delete";
  btnDelete.classList.add("btn-delete");
  btnDelete.onclick = () => handleDelete(r.id);
  actions.appendChild(btnView);
  actions.appendChild(btnEdit);
  actions.appendChild(btnDelete);
  card.appendChild(actions);

  return card;
}

function render() {
  const arr = load();
  const qText = (searchInput.value || "").trim().toLowerCase();
  const diff = difficultyFilter.value || "All";
  let filtered = arr.filter((r) => {
    if (qText && !(r.title || "").toLowerCase().includes(qText)) return false;
    if (diff !== "All" && r.difficulty !== diff) return false;
    return true;
  });
  listEl.innerHTML = "";
  if (!filtered.length) {
    const msg = document.createElement("div");
    msg.className = "muted";
    msg.textContent = "No recipes found.";
    listEl.appendChild(msg);
    return;
  }
  filtered.forEach((r) => listEl.appendChild(createCard(r)));
}

// modal helpers
function showModal() {
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}
function hideModal() {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  form.reset();
  previewImg.classList.add("hidden");
  formErrors.textContent = "";
  recipeId.value = "";
}

// open add
btnAdd.addEventListener("click", () => {
  formErrors.textContent = "";
  recipeId.value = "";

  // ⭐ REMOVE VIEW MODE CLASS FOR ADD MODE ⭐
  form.classList.remove("view-mode");

  modal.querySelector("#modalTitle").textContent = "Add Recipe";
  deleteBtn.classList.add("hidden");
  previewImg.classList.add("hidden");
  showModal();
});

// close modal by backdrop / close button / cancel
modal.addEventListener("click", (e) => {
  if (e.target === modalBackdrop) hideModal();
});
document.getElementById("modalClose").addEventListener("click", hideModal);
cancelBtn.addEventListener("click", hideModal);

// image handling: upload -> preview as data URL
imageFileI.addEventListener("change", () => {
  const f = imageFileI.files && imageFileI.files[0];
  if (!f) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    previewImg.src = e.target.result;
    previewImg.classList.remove("hidden");
    imageUrlI.value = "";
  };
  reader.readAsDataURL(f);
});
imageUrlI.addEventListener("input", () => {
  if (imageUrlI.value.trim()) {
    previewImg.src = imageUrlI.value.trim();
    previewImg.classList.remove("hidden");
    imageFileI.value = "";
  } else {
    previewImg.src = "";
    previewImg.classList.add("hidden");
  }
});

// validation
function validateForm() {
  const errs = [];
  if (!titleI.value.trim()) errs.push("Title required");
  const ingr = ingredientsI.value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!ingr.length) errs.push("At least one ingredient");
  const st = stepsI.value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  if (!st.length) errs.push("At least one step");
  if (!difficultyI.value) errs.push("Select difficulty");
  if (prepI.value && (isNaN(Number(prepI.value)) || Number(prepI.value) < 0))
    errs.push("Prep time must be a positive number");
  return errs;
}

// save form
form.addEventListener("submit", (ev) => {
  ev.preventDefault();
  formErrors.textContent = "";
  const errors = validateForm();
  if (errors.length) {
    formErrors.textContent = errors.join(". ");
    return;
  }

  const arr = load();
  const id = recipeId.value
    ? Number(recipeId.value)
    : Date.now() + Math.floor(Math.random() * 1000);
  // prefer uploaded preview (data URL) if present, otherwise image URL or null
  const imageVal =
    previewImg.src && !previewImg.classList.contains("hidden")
      ? previewImg.src
      : imageUrlI.value.trim() || null;

  const record = {
    id,
    title: titleI.value.trim(),
    description: descriptionI.value.trim(),
    ingredients: ingredientsI.value
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    steps: stepsI.value
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean),
    category: categoryI.value.trim() || "",
    difficulty: difficultyI.value,
    prepTime: prepI.value ? Number(prepI.value) : null,
    image: imageVal,
    updatedAt: new Date().toISOString(),
  };

  if (recipeId.value) {
    const idx = arr.findIndex((x) => x.id === Number(recipeId.value));
    if (idx >= 0) arr[idx] = { ...arr[idx], ...record };
  } else {
    arr.unshift(record);
  }
  save(arr);
  hideModal();
  render();
});

// view (read-only)
function openView(id) {
  const arr = load();
  const r = arr.find((x) => x.id === id);
  if (!r) return;

  recipeId.value = r.id;
  titleI.value = r.title;
  descriptionI.value = r.description || "";
  ingredientsI.value = (r.ingredients || []).join("\n");
  stepsI.value = (r.steps || []).join("\n");
  categoryI.value = r.category || "";
  difficultyI.value = r.difficulty || "";
  prepI.value = r.prepTime || "";

  if (r.image) {
    previewImg.src = r.image;
    previewImg.classList.remove("hidden");
  } else {
    previewImg.classList.add("hidden");
  }

  imageFileI.value = "";
  imageUrlI.value = r.image && !r.image.startsWith("data:") ? r.image : "";

  // ⭐ SHOW ONLY SLIDER IN VIEW MODE ⭐
  const slider = document.getElementById("viewSlider");
  slider.innerHTML = `
    <div class="slider-track">
      <div class="slide">
        <strong>Description</strong>
        ${r.description || "No description provided"}
      </div>
      <div class="slide">
        <strong>Ingredients</strong>
        ${(r.ingredients || []).join("<br>")}
      </div>
      <div class="slide">
        <strong>Steps</strong>
        ${(r.steps || []).map((step, i) => `${i + 1}. ${step}`).join("<br>")}
      </div>
    </div>
  `;

  // ⭐ ADD VIEW MODE CLASS TO HIDE FORM FIELDS ⭐
  form.classList.add("view-mode");

  setReadonly(true);
  deleteBtn.classList.remove("hidden");
  saveBtn.classList.add("hidden");
  modal.querySelector("#modalTitle").textContent = "View Recipe";
  showModal();
}

function setReadonly(flag) {
  [
    titleI,
    descriptionI,
    ingredientsI,
    stepsI,
    categoryI,
    difficultyI,
    prepI,
    imageFileI,
    imageUrlI,
  ].forEach((el) => {
    if (!el) return;
    el.readOnly = flag;
    if (el.tagName === "SELECT" || el.type === "file" || el.type === "number")
      el.disabled = flag;
  });
}

// edit
function openEdit(id) {
  const arr = load();
  const r = arr.find((x) => x.id === id);
  if (!r) return;

  recipeId.value = r.id;
  titleI.value = r.title;
  descriptionI.value = r.description || "";
  ingredientsI.value = (r.ingredients || []).join("\n");
  stepsI.value = (r.steps || []).join("\n");
  categoryI.value = r.category || "";
  difficultyI.value = r.difficulty || "";
  prepI.value = r.prepTime || "";

  if (r.image) {
    previewImg.src = r.image;
    previewImg.classList.remove("hidden");
  } else {
    previewImg.classList.add("hidden");
  }

  imageFileI.value = "";
  imageUrlI.value = r.image && !r.image.startsWith("data:") ? r.image : "";

  // ⭐ REMOVE VIEW MODE CLASS TO SHOW FORM FIELDS ⭐
  form.classList.remove("view-mode");

  setReadonly(false);
  deleteBtn.classList.add("hidden");
  saveBtn.classList.remove("hidden");
  modal.querySelector("#modalTitle").textContent = "Edit Recipe";
  showModal();
}

// delete
function handleDelete(id) {
  if (!confirm("Delete this recipe?")) return;
  const arr = load().filter((x) => x.id !== id);
  save(arr);
  hideModal();
  render();
}

// delete button (from modal view)
deleteBtn.addEventListener("click", () => {
  if (!recipeId.value) return;
  handleDelete(Number(recipeId.value));
});

// search & filter
searchInput.addEventListener("input", debounce(render, 180));
difficultyFilter.addEventListener("change", render);

// debounce helper
function debounce(fn, ms) {
  let t;
  return (...a) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...a), ms);
  };
}

// init
document.addEventListener("DOMContentLoaded", () => {
  seedIfEmpty();
  render();

  // 🔥 Set page title here
  document.title = "Recipe Manager — Cookify by Vinit";
});
