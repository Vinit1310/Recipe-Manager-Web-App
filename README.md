# 🍽️ Recipe Manager — Cookify by Vinit

A simple and elegant **frontend-only Recipe Manager Web App** built using **HTML, CSS, and JavaScript** with full CRUD operations, image upload, slider-based recipe viewer, and LocalStorage persistence.

---

## 🚀 Features

- Add, edit, view, and delete recipes
- Upload recipe image (Base64) or use image URL
- Search recipes by title
- Filter recipes by difficulty
- Slider-based recipe viewer (Description → Ingredients → Steps)
- Fully responsive layout
- All data stored in browser using **LocalStorage**
- No backend required

---

## ▶️ How to Run the App

This is a **100% frontend project**, so no installation is required.

1. Download or clone the repository:
   ```bash
   git clone <your-repo-url>
   ```
2. Open the project folder
3. Double-click **index.html**
4. The app will open instantly in your browser

✔ No server  
✔ No Node  
✔ No dependencies

---

## 📁 Project Structure

```
RECIPE MANAGER WEB APP/
│
├── index.html # Main UI page
├── style.css # All app styling (responsive layout, forms, cards)
├── app.js # Main JavaScript file (CRUD, UI, LocalStorage)
│
├── images/ # All recipe images used in seed data
│ ├── aloo-paratha.webp
│ ├── bread-omlette.png
│ ├── bread-omlette.webp
│ ├── chicken_fry.jpg
│ ├── Chicken-Tikka-Masala.jpg
│ ├── chocolate-milkshake.jpg
│ ├── Eggs fry masala.jpeg
│ ├── masala dosa.jpg
│ ├── Masala-Omelette.jpg
│ ├── paneer-butter-masala.webp
│ └── veg-pulao.jpg
│
├── JS/ # All JavaScript modules
│ ├── app.js # Global script (rendering, interactions, CRUD)
│
│
└── README.md # Project documentation
```

---

## 🗂️ LocalStorage Data Structure

All recipes are stored under the key:

```
recipes
```

This key contains an **array of recipe objects**.

### Recipe Object Example

```json
{
  "id": 17373123,
  "title": "Masala Omelette",
  "description": "A quick spicy breakfast dish.",
  "ingredients": ["2 eggs", "1 green chilli", "2 tbsp onion", "Salt to taste"],
  "steps": ["Beat the eggs", "Mix chopped veggies", "Cook on medium flame"],
  "category": "Breakfast",
  "difficulty": "Easy",
  "prepTime": 10,
  "image": "data:image/jpeg;base64,... OR https://example.com/photo.jpg",
  "createdAt": "2024-01-01T10:00:00.000Z",
  "updatedAt": "2024-01-01T10:00:00.000Z"
}
```

### Notes:

- `image` can be Base64 (uploaded) or a URL
- `ingredients` and `steps` are stored as separate arrays
- `id` is auto-generated
- Editing a recipe updates the original object

---

## 📌 Assumptions & Limitations

### ✔ Assumptions

- Browser supports LocalStorage
- JavaScript is enabled
- User adds reasonable image sizes
- User understands data is saved locally on their device

### ❗ Limitations

- No backend → data does **not sync across devices**
- Clearing cache or LocalStorage removes all recipes
- LocalStorage (5MB limit) may fill up with many Base64 images
- Invalid image URLs may not load due to CORS
- No authentication or user accounts

---

## 🐞 Known Issues

(Updated — old issues fixed)

❌ Auto-numbering issue for steps — **RESOLVED**

❌ Favicon not rendering — **FIXED**

❌ Theme toggle did not affect navbar — **FIXED**

❌ Card UI minor alignment shifts — **FIXED**
**These issues do not break the app but may appear:**

1. **Form fields show during view mode** — CSS may need minor tweaks
2. **Slider height increases for long content**
3. **Accessibility warnings** if labels do not contain `for=""`

---

## 🛠️ Tech Stack

- **HTML5**
- **CSS3**
- **JavaScript (ES6+)**
- **LocalStorage**

---

## ❤️ Author

**Vinit Phadtare**

---
