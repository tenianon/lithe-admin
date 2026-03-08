<div align="center">

# Lithe Admin

![Vue](https://img.shields.io/badge/Vue-3.5.29-42B883?style=for-the-badge&logo=vue.js)
![Naive UI](https://img.shields.io/badge/Naive_UI-2.44.1-75B93F?style=for-the-badge&logo=naiveui)
![Vite](https://img.shields.io/badge/Vite-7.3.1-646cff?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.2.1-4ABAFB?style=for-the-badge&logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-4377C1?style=for-the-badge&logo=typescript)

[预览地址(国内)](https://lithe-admin.havenovelgod.com) | [预览地址](https://lithe-admin.vercel.app)

[English](https://github.com/tenianon/lithe-admin/blob/main/README.en_US.md) | 简体中文

</div>

## 📃 简介

**Lithe Admin** 是一个轻盈而优雅的后台管理模板，基于 **`Vue3`** **`Naive UI`** **`Vite7`** **`TailwindCSS4`** **`TypeScript`** **`Pinia`** 构建，沿用折纸般的页面结构设计，轻量的业务依赖和低耦合代码配置，专为灵活拓展和个性化定制而打造，适用于快速搭建和渐进式迭代的后台管理系统

## ✨ 特性

- 🎨 **现代化设计** - 基于 Tailwind Color 配色方案，采用磨砂质感和纹理效果，​​提升视觉层次与主题表现力
- 🧩 **灵活主题定制** - 支持自定义颜色、主题、组件样式
- 🧭 **交互反馈效果** - 韵滑的过渡效果，交互体验更自然流畅
- 📱 **移动端响应式** - 还不错的响应式支持
- 📝 **代码规范** - 通过 ESLint 规范代码质量，Prettier 格式化代码风格
- 🎯 **TypeScript** - 完整的 TypeScript 支持，更好的类型提示与开发体验
- ⚡ **Vite** - 快速的开发服务器和构建工具

## 🚀 快速开始

### 环境要求

- **Node.js**: `^20.19.0` 或 `>=22.12.0`
- **包管理器**: `pnpm`、`npm`、`yarn`、`bun`

### 创建项目

```bash
# 使用 pnpm 创建项目
pnpm create lithe@latest

# 使用 npm 创建项目
npm create lithe@latest

# 使用 yarn 创建项目
yarn create lithe@latest

# 使用 bun 创建项目
bun create lithe@latest
```

### 安装依赖

```bash
# 使用 pnpm
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install

# 或使用 bun
bun install
```

### 开发模式

```bash
pnpm run dev
```

### 单元测试

```bash
pnpm run test:unit
```

### 构建生产版本

```bash
pnpm run build
```

### 预览生产版本

```bash
pnpm run preview
```

### 代码检查

```bash
# 检查类型
pnpm run type-check

# 检查代码质量
pnpm run lint:check

# 自动修复代码问题
pnpm run lint:fix

# 检查代码格式
pnpm run format:check

# 自动格式化代码
pnpm run format:fix
```

## 📦 图标

图标库使用 [Iconify](https://iconify.design)，使用方式如下：

```html
<!-- 使用 ph 前缀 -->
<span class="iconify ph--x"></span>

<!-- 直接使用 -->
<span class="icon-[fluent--data-area-32-regular]"></span>
```

上面的 `ph` 前缀需要在 `src/assets/base.css` 中进行配置，详细文档请参考 [Iconify Tailwind 4](https://iconify.design/docs/usage/css/tailwind/tailwind4)

```css
@plugin '@iconify/tailwind4' {
  prefixes: ph;
  scale: 1.2;
}
```
