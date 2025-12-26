# tranduy1dol

A minimalist, editorial-style personal website and blog built with [Next.js](https://nextjs.org), TypeScript, and Tailwind CSS.

## Features

- **Minimalist Design**: Clean typography-focused layout (Playfair Display & Sans-serif) with dark mode support
- **Editorial Style**: Headers and layouts inspired by print media
- **MDX Powered**: Write content in Markdown with `gray-matter` for frontmatter metadata
- **Dynamic Content**:
  - **Blog**: Tag filtering, search, and reading time calculation
  - **Books**: Reading list with star ratings and status
  - **Spotlight**: Featured projects grid
  - **Tech Stack**: Infinite marquee animation
- **Responsive**: Fully responsive design for mobile, tablet, and desktop
- **SEO Optimized**: Meta tags, semantic HTML, and proper heading hierarchy

## Tech Stack

- **Framework**: Next.js (Pages Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Icons**: React Icons
- **Content**: Markdown (remark/rehype)

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/tranduy1dol/tranduy1dol.github.io.git
    cd tranduy1dol.github.io
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run development server**:
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the site.

## Content Management

- **Blog Posts**: Add `.md` files to `_posts/`
- **Books**: Add `.md` files to `_books/`
- **Spotlight Projects**: Add `.md` files to `_content/spotlight/`

## Deployment

This project is configured for deployment on **GitHub Pages** via GitHub Actions.

- The workflow file is located at `.github/workflows/deploy.yml`.
- Pushes to the `main` branch automatically trigger a build and deploy.
