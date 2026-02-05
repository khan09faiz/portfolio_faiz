## 👤 Author's Portfolio

**Mohammad Faiz Khan**  
AI/ML Engineer & Full-Stack Developer

- Email: khan09faiz@gmail.com
- GitHub: [@khan09faiz](https://github.com/khan09faiz)
- LinkedIn: [khan09faiz](https://www.linkedin.com/in/khan09faiz/)

A modern, performant portfolio website built with Next.js 15, React 19, and TypeScript. Features a cyberpunk-inspired glassmorphism design with smooth animations and responsive layouts.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan)](https://tailwindcss.com/)

## ✨ Features

### 🎨 Design
- **Cyberpunk Glassmorphism UI** - Terminal-inspired design with glassmorphic cards
- **Custom Theme** - Cyan (#00D9FF) primary color with dark mode
- **Smooth Animations** - Framer Motion powered transitions
- **Fully Responsive** - Mobile-first design that works on all devices

### 🛠️ Sections

- **Hero** - Animated typing effect, rotating roles, stats dashboard
- **Projects** - Filterable grid with detailed modal views
- **Skills** - 60+ technologies organized by category with proficiency bars
- **Timeline** - Career journey with work, education, and achievements
- **Contact** - EmailJS-powered form with validation

### 🏗️ Architecture

**JAMstack Approach** - No database or backend required:
- JSON files for static data (projects, skills, timeline)
- EmailJS for contact form (no server needed)
- Next.js Static Generation for fast performance
- Can be deployed to any CDN

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Configuration

1. **Update Personal Info** - Edit `lib/constants.ts`
2. **Add Projects** - Edit `src/data/projects.json`
3. **Add Skills** - Edit `src/data/skills.json`
4. **Add Timeline** - Edit `src/data/timeline.json`
5. **Setup EmailJS** - Setup emailjs

## 📦 Tech Stack

- **Framework:** Next.js 16.1.6 with App Router
- **UI Library:** React 19 with TypeScript
- **Styling:** Tailwind CSS with custom theme
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React + React Icons
- **Email:** EmailJS (no backend required)

## 📁 Project Structure

```
Me-myself-I/
├── app/                    # Next.js App Router
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── features/          # Hero, Projects, Skills, Timeline, Contact
│   └── ui/                # Button, Card, TechIcon, etc.
├── lib/
│   ├── constants.ts       # Site configuration
│   ├── types.ts           # TypeScript types
│   └── utils/             # Utility functions
├── src/data/              # JSON data files
│   ├── projects.json
│   ├── skills.json
│   └── timeline.json
└── docs/                  # Documentation
    ├── reference-analysis.md
    ├── implementation-plan.md
    └── emailjs-setup.md
```


## 🚀 Deployment

Deploy to Vercel (recommended):
```bash
git push origin main
# Connect repo in Vercel dashboard
```

Also works with: Netlify, GitHub Pages, AWS Amplify, Cloudflare Pages

## 👤 Author

**Mohammad Faiz Khan**  
AI/ML Engineer & Full-Stack Developer

- Email: khan09faiz@gmail.com
- GitHub: [@khan09faiz](https://github.com/khan09faiz)
- LinkedIn: [khan09faiz](https://www.linkedin.com/in/khan09faiz/)

