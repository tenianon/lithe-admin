<div align="center">

# Lithe Admin

![Vue](https://img.shields.io/badge/Vue-3.5.32-42B883?style=for-the-badge&logo=vue.js)
![Naive UI](https://img.shields.io/badge/Naive_UI-2.44.1-75B93F?style=for-the-badge&logo=naiveui)
![Vite](https://img.shields.io/badge/Vite-8.0.8-646cff?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2.2-4ABAFB?style=for-the-badge&logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0.3-4377C1?style=for-the-badge&logo=typescript)

[Preview](https://lithe-admin.vercel.app)

[📖Documentation](https://lithe-admin-docs.vercel.app)

English | [简体中文](https://github.com/tenianon/lithe-admin/blob/main/README.md)

</div>

## 📃 Introduction

**Lithe Admin** is a lightweight and elegant admin template built with **`Vue 3`**, **`Naive UI`**, **`Vite 8`**, **`Tailwind CSS 4`**, **`TypeScript 6`**, and **`Pinia`**. It adopts an origami-style page structure, keeps business dependencies light and configuration loosely coupled, and is designed for flexible extension, personalization, and fast iteration of admin systems.

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
- **Package Manager**: `pnpm`, `npm`, `yarn`, `bun`

### Create project (recommend)

```bash
# Using pnpm
pnpm create lithe@latest

# Using npm
npm create lithe@latest

# Using yarn
yarn create lithe@latest

# Using bun
bun create lithe@latest
```
Currently available are:

- Lithe Admin (default demo version)
- [Lithe Admin lite](https://github.com/tenianon/lithe-admin/tree/lite) (simplified version, with only basic pages)


### Install Dependencies

```bash
# Using pnpm
pnpm install

# Using npm
npm install

# Using yarn
yarn install

# Using bun
bun install
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
# Check types
pnpm type-check

# Lint check
pnpm lint:check

# Lint fix
pnpm lint:fix

# Format check
pnpm format:check

# Format fix
pnpm format:fix
```
