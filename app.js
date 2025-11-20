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
      description: "Quick breakfast with eggs and bread.",
      ingredients: [
        "4 slices bread",
        "4 eggs",
        "1 small onion",
        "1 small tomato",
        "salt & pepper",
        "1 tbsp butter",
      ],
      steps: [
        "Beat eggs with salt & pepper",
        "Mix onion & tomato into eggs",
        "Heat pan, pour mix",
        "Place bread on top, cook",
        "Serve hot",
      ],
      prepTime: 10,
      difficulty: "Easy",
      category: "Breakfast",
      image: null,
      createdAt: new Date().toISOString(),
    },

    {
      id: now() + 1,
      title: "Masala Omelette",
      description: "Spicy omelette",
      ingredients: ["3 eggs", "Onion", "Chilli"],
      steps: ["Chop", "Beat", "Cook"],
      prepTime: 8,
      difficulty: "Easy",
      category: "Breakfast",
      image: null,
      createdAt: new Date().toISOString(),
    },

    {
      id: now() + 2,
      title: "Vegetable Pulao",
      description: "Aromatic rice",
      ingredients: ["Rice", "Veg", "Spices"],
      steps: ["Saute", "Add rice", "Cook"],
      prepTime: 35,
      difficulty: "Medium",
      category: "Lunch",
      image: null,
      createdAt: new Date().toISOString(),
    },

    // ⭐ NEW RECIPE 1
    {
      id: now() + 3,
      title: "Paneer Butter Masala",
      description: "Rich, creamy and restaurant-style paneer curry.",
      ingredients: ["Paneer", "Butter", "Tomato", "Cream", "Spices"],
      steps: ["Blend tomato", "Cook with spices", "Add paneer", "Simmer"],
      prepTime: 30,
      difficulty: "Medium",
      category: "Dinner",
      image: null,
      createdAt: new Date().toISOString(),
    },

    // ⭐ NEW RECIPE 2
    {
      id: now() + 4,
      title: "Aloo Paratha",
      description: "Stuffed Indian flatbread with spiced potato filling.",
      ingredients: ["Wheat flour", "Potatoes", "Spices", "Butter"],
      steps: [
        "Prepare dough",
        "Make potato stuffing",
        "Fill & roll",
        "Cook on tawa",
      ],
      prepTime: 25,
      difficulty: "Easy",
      category: "Breakfast",
      image: null,
      createdAt: new Date().toISOString(),
    },

    // ⭐ NEW RECIPE 3
    {
      id: now() + 5,
      title: "Chocolate Milkshake",
      description: "Thick, chocolaty shake perfect for summer.",
      ingredients: ["Milk", "Ice cream", "Cocoa powder", "Sugar"],
      steps: ["Add all items", "Blend until smooth", "Serve chilled"],
      prepTime: 5,
      difficulty: "Easy",
      category: "Drinks",
      image: null,
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

  // ⭐⭐⭐ CLEAN SLIDER CONTENT (WITHOUT TITLE, CATEGORY, DIFFICULTY) ⭐⭐⭐
  const slider = document.getElementById("viewSlider");
  slider.innerHTML = `
    <div class="slider-track">
      <div class="slide">
        <strong>Description</strong><br>${r.description || ""}
      </div>
      <div class="slide">
        <strong>Ingredients</strong><br>${(r.ingredients || []).join("<br>")}
      </div>
      <div class="slide">
        <strong>Steps</strong><br>${(r.steps || []).join("<br>")}
      </div>
    </div>
  `;
  // ⭐⭐⭐ SLIDER ADDED END ⭐⭐⭐

  // set form to readonly
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
