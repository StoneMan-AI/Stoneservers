# PHOTO AI Landing Page

A modern landing page for PHOTO AI built with Next.js and Tailwind CSS.

## Features

- Responsive design
- Dark theme
- Interactive pricing toggle
- Modern UI components
- Optimized for performance

## Getting Started

### 方法一：使用安装脚本（推荐）

**Windows 用户：**
```bash
install.bat
```

**Mac/Linux 用户：**
```bash
chmod +x install.sh
./install.sh
```

### 方法二：手动安装

First, install the dependencies:

```bash
npm install
# or
yarn install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 如果遇到样式问题

如果页面样式显示异常，请确保：

1. 已安装所有依赖：`npm install`
2. Tailwind CSS 已正确配置
3. 重启开发服务器：`npm run dev`

## Tech Stack

- Next.js 14
- React 18
- Tailwind CSS
- Responsive Design

## Project Structure

```
├── pages/
│   ├── index.js          # Main landing page
│   └── _app.js           # App wrapper
├── styles/
│   └── globals.css       # Global styles
├── package.json
├── tailwind.config.js
└── next.config.js
```

## Sections

1. Navigation Header
2. Hero Section with CTA
3. AI Comparison Section
4. Customer Testimonials
5. Photo Packs Gallery
6. Pricing Plans
7. Footer with Links

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.