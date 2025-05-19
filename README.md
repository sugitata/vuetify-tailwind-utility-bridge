# vuetify-tailwind-bridge

**Tailwind CSS plugin** that brings Vuetify-style utility classes to your project.  
Enables Figma design token alignment, Tailwind auto-completion, and incremental migration from Vuetify to Tailwind.

A Tailwind CSS plugin that provides Vuetify-like utility classes — for autocomplete support and progressive migration from Vuetify to Tailwind.

## ✨ Purpose

This package is designed with **two main use cases**:

### 1. Autocomplete support for Vuetify utility classes in VSCode

- Enables Tailwind CSS IntelliSense (autocomplete) for Vuetify utility classes like `.ma-1`, `.text-primary`, `.elevation-4`, etc.
- This does **not require Tailwind CSS to be installed in your project.**
- This was the **original motivation** behind creating this plugin — enabling autocomplete even in a Vuetify-only project.

#### 🛠 Recommended VSCode settings

Add the following to your `.vscode/settings.json`:

```json
{
  "tailwindCSS.includeLanguages": {
    "vue": "html",
    "plaintext": "html"
  },
  "editor.quickSuggestions": {
    "strings": true
  }
}
```

## ✨ Features

- 🔧 Provides Vuetify-style utility classes (`.d-flex`, `.ma-2`, `.rounded-lg`, etc.)
- 🎨 Maps Vuetify design tokens to Tailwind utility conventions
- 🧩 Enables Tailwind IntelliSense / autocomplete in VSCode
- 📦 Lightweight and framework-agnostic plugin
- 🪜 Perfect for incremental migration from Vuetify to Tailwind

## Unsupported Features

- RTL mode
- Expand css variables (e.g. `var(–v-hover-opacity);`)

---

## 📦 Installation

```bash
npm install vuetify-tailwind-bridge
```

---

## 🛠 Usage

```ts
// tailwind.config.ts
import { vuetifyPlugin } from 'vuetify-tailwind-bridge';

export default {
  content: ['./src/**/*.{vue,js,ts}'],
  corePlugins: {
    preflight: false,
    // Disable built-in spacing, borderRadius, etc if needed
  },
  plugins: [vuetifyPlugin()],
};
```

---

## 🧩 Supported Utilities (WIP)

### Display

```html
.d-flex .d-block .d-none .d-inline .d-inline-flex
```

### Flex

```html
.flex-column .justify-center .align-end .flex-nowrap
```

### Spacing

```html
.ma-1 .pa-2 .mt-3 .pl-0
```

### Border Radius

```html
.rounded .rounded-0 .rounded-lg .rounded-circle
```

> More utilities coming soon!

---

## 🚀 Use Case

- Bring **Tailwind-class auto-completion** to Vuetify-based components
- Use it as a **design token bridge** between Vuetify and Figma
- **Gradually refactor** Vuetify components into Tailwind

---

## 📄 License

MIT
