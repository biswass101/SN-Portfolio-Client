# Syed Nayeem Hossain Portfolio

Modern portfolio website for Syed Nayeem Hossain, built with React, Vite, TypeScript, and TanStack Router.

## Overview

This project showcases:

- Professional summary and hero section
- About section (skills, certifications, education, languages)
- Experience timeline and impact highlights
- Selected enterprise IT projects
- Contact channels and call-to-action

The UI uses animated transitions and section reveal effects for a polished browsing experience.

## Tech Stack

- React 19
- TypeScript
- Vite 7
- TanStack Router
- Tailwind CSS 4
- Framer Motion
- Lucide React icons
- Radix UI primitives (via reusable UI components)

## Project Structure

```text
src/
  components/       # Shared layout and UI components
  routes/           # File-based route pages
  assets/           # Images and static assets
  hooks/            # Custom React hooks
  lib/              # Utility helpers
  main.tsx          # App entry point
  router.tsx        # Router creation and error handling
  styles.css        # Global styles and design tokens
```

## Routes

- `/` Home
- `/about` About
- `/experience` Experience
- `/projects` Projects
- `/contact` Contact

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open the local URL shown in your terminal (typically `http://localhost:5173`).

## Available Scripts

- `npm run dev` Start Vite dev server
- `npm run build` Create production build
- `npm run build:dev` Build in development mode
- `npm run preview` Preview production build locally
- `npm run lint` Run ESLint checks
- `npm run format` Format code with Prettier

## Build and Preview

```bash
npm run build
npm run preview
```

Generated files are output to `dist/`.

## SEO and Metadata

Route-level metadata (title/description/Open Graph) is defined in route files under `src/routes/`.

The root shell (`src/routes/__root.tsx`) sets:

- Base page metadata
- Favicon
- Google Fonts
- Global app layout (background, navbar, footer)

## Customization

- Update personal details and content in route files under `src/routes/`
- Replace profile image in `src/assets/`
- Adjust visual styling and tokens in `src/styles.css`
- Update navigation/footer links in `src/components/Navbar.tsx` and `src/components/Footer.tsx`

## Deployment

This is a static Vite app. You can deploy the `dist/` output to:

- Vercel
- Netlify
- GitHub Pages
- Any static hosting provider

Typical deploy flow:

```bash
npm run build
```

Then publish the `dist/` directory.

## License

Private portfolio project.
