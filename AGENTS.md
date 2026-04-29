# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` or `yarn dev`
- **Build for production**: `npm run build` or `yarn build`
- **Export static site**: `npm run export` or `yarn export` (runs build then export)
- **Generate sitemap**: `npm run sitemap` or `yarn sitemap`
- **Start production server**: `npm run start` or `yarn start`
- **Lint code**: `npm run lint` or `yarn lint`
- **Run tests**: No test script is currently configured. To add testing, consider installing a testing framework like Jest or Vitest and adding a test script to package.json.

## Code Architecture & Structure

This is a Next.js 14 application using the App Router structure.

### Key Directories & Files

- **`app/`**: Main application directory using Next.js App Router
  - `layout.tsx`: Root layout defining shared UI (header, footer, sidebar) and metadata
  - `page.tsx`: Homepage component
  - `postdetails/[slug]/`: Dynamic route for individual posts
  - `privacypolicy/page.tsx`: Static privacy policy page
  - `components/`: Reusable React components (Navbar, Header, Footer, Sidebar, etc.)
  - `providers/`: Context providers (likely for theme, auth, etc.)
  - `globals.css`: Global Tailwind CSS styles and custom properties

- **`pages/`**: Legacy Pages Router directory (used for API routes)
  - `api/hello.ts`: Example API endpoint
  - `api/sitemap.ts`: Sitemap generation API endpoint

- **`lib/`**: Utility functions and database interactions
  - `db.ts`: Database functions for fetching posts, categories, etc.
  - `blob.ts`: Vercel Blob storage utilities
  - `auth.ts`: Authentication configuration (NextAuth)
  - `gtag.js`: Google Analytics tracking implementation

- **`public/`**: Static assets (images, favicons, robots.txt, sitemap.xml)
  - Contains PDF thumbnails, SVGs, and verification files

- **Configuration Files**
  - `next-sitemap.config.js`: Sitemap generation configuration
  - `tsconfig.json`: TypeScript configuration
  - `postcss.config.js`: PostCSS/Tailwind configuration
  - `package.json`: Dependencies and scripts

### Data Flow

1. Data is fetched in `app/layout.tsx` using functions from `lib/db.ts`
2. These functions interact with Vercel Postgres (`@vercel/postgres`)
3. Layout passes data as props to child components via `children`
4. Components like `CategoriesSideBar`, `RandomPosts`, `RightSide` consume this data
5. Individual post pages (`app/postdetails/[slug]/page.tsx`) fetch specific post data

### Styling

- Uses Tailwind CSS via `globals.css`
- Custom CSS variables defined in `:root` for light/dark mode
- Flowbite component library integrated for additional UI components
- Dark mode support via media queries in `globals.css`

### Important Notes

- The application uses Next.js 14 with the App Router (`app/` directory)
- Authentication is handled via NextAuth.js (`next-auth` package)
- Database interactions use Vercel Postgres
- Advertising is implemented via Google AdSense (adsbygoogle scripts)
- Analytics via Google Tag Manager and Google Analytics 4
- The project exports as a static site by default (`next export`)