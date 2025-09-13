<div align="center">

# Lithe Admin

![Vue](https://img.shields.io/badge/Vue-3.5.18-42B883?style=for-the-badge&logo=vue.js)
![Naive UI](https://img.shields.io/badge/Naive_UI-2.43.0-75B93F?style=for-the-badge&logo=naiveui)
![Vite](https://img.shields.io/badge/Vite-7.0.11-646cff?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.11-4ABAFB?style=for-the-badge&logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.0-4377C1?style=for-the-badge&logo=typescript)

[Preview](https://lithe-admin.vercel.app)

English | [简体中文](https://github.com/tenianon/lithe-admin/blob/main/README.md)

</div>

## 📃 Introduction

**Lithe Admin** is a lightweight and elegant admin template built with **`Vue 3`**, **`Naive UI`**, **`Vite 7`**, **`Tailwind CSS 4`**, **`TypeScript`**, and **`Pinia`**. It adopts an origami-style page structure, features minimal business dependencies and low-coupled configuration, and is crafted for flexible extension and personalization—ideal for rapidly bootstrapping and progressively iterating admin systems.

## ✨ Features

- 🎨 **Modern Design** - Based on the Tailwind Color palette, utilizing frosted glass and texture effects to enhance visual hierarchy and theme expressiveness
- 🧩 **Flexible Theming** - Customize colors, themes, and component styles
- 🧭 **Interaction Feedback** - Smooth transitions for a natural, fluid experience
- 📱 **Responsive** - Solid mobile responsiveness
- 📝 **Code Quality** - ESLint for linting and Prettier for formatting
- 🎯 **TypeScript** - Full typing support for better DX
- ⚡ **Vite** - Fast dev server and build tool

## 🚀 Getting Started

### Requirements

- **Node.js**: `^20.19.0` or `>=22.12.0`
- **Package Manager**: `pnpm` (recommended), or `npm`, or `yarn`

### Create project

```bash
# Using pnpm (recommended)
pnpm create lithe@latest
```
```bash
# Or npm
npm create lithe@latest
```
```bash
# Or yarn
yarn create lithe@latest
```

### Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or npm
npm install

# Or yarn
yarn install
```

### Development

```bash
pnpm dev
```

### Unit Tests

```bash
pnpm test:unit
```

### Build for Production

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

### Lint & Format

```bash
# Lint check
pnpm lint:check

# Lint fix
pnpm lint:fix

# Format check
pnpm format:check

# Format fix
pnpm format:fix
```

## 📦 Icons

This project uses [Iconify](https://iconify.design). Usage examples:

```html
<!-- Using the `ph` prefix -->
<span class="iconify ph--x"></span>

<!-- Direct usage -->
<span class="iconify-[fluent--data-area-32-regular]"></span>
```

The `ph` prefix needs to be configured in `src/assets/base.css`. Refer to the official docs: [Iconify Tailwind 4](https://iconify.design/docs/usage/css/tailwind/tailwind4)

```css
@plugin "@iconify/tailwind4" {
  prefixes: ph;
  prefix: 'iconify';
  scale: 1.2;
}
```
