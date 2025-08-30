<div align="center">

# Lithe Admin

![Vue](https://img.shields.io/badge/Vue-3.5.18-42B883?style=for-the-badge&logo=vue.js)
![Naive UI](https://img.shields.io/badge/Naive_UI-2.42.0-75B93F?style=for-the-badge&logo=naiveui)
![Vite](https://img.shields.io/badge/Vite-7.0.11-646cff?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1.11-4ABAFB?style=for-the-badge&logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.0-4377C1?style=for-the-badge&logo=typescript)

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
- **包管理器**: `pnpm` (推荐) 或 `npm` 或 `yarn`

### 克隆项目

```bash
git clone https://github.com/tenianon/lithe-admin.git
```

### 精简版

分支地址 [lite](https://github.com/tenianon/lithe-admin/tree/lite)，**精简版**不包含路由页面，只保留了页面基本架构

```bash
git clone -b lite https://github.com/tenianon/lithe-admin.git
```

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 开发模式

```bash
pnpm dev
```

### 单元测试

```bash
pnpm test:unit
```

### 构建生产版本

```bash
pnpm build
```

### 预览生产版本

```bash
pnpm preview
```

### 代码检查

```bash
# 检查代码质量
pnpm lint:check

# 自动修复代码问题
pnpm lint:fix

# 检查代码格式
pnpm format:check

# 自动格式化代码
pnpm format:fix
```

## 📦 图标

图标库使用 [Iconify](https://iconify.design)，使用方式如下：

```html
<!-- 使用 ph 前缀 -->
<span class="iconify ph--x"></span>

<!-- 直接使用 -->
<span class="iconify-[fluent--data-area-32-regular]"></span>
```

上面的 `ph` 前缀需要在 `src/assets/base.css` 中进行配置，详细文档请参考 [Iconify Tailwind 4](https://iconify.design/docs/usage/css/tailwind/tailwind4)

```css
@plugin "@iconify/tailwind4" {
  prefixes: ph;
  prefix: 'iconify';
  scale: 1.2;
}
```
