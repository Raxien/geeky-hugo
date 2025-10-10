# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **Vandipety**, a Hugo-based travel blog built with the Geeky Hugo theme. The site documents Paolo, Sara, Olimpia (dog), and Sakè's (cat) travels around the world in a camper van. The blog is written in Italian and deployed on Netlify.

## Key Technologies

- **Hugo**: Static site generator (minimum version 0.145.0, extended version required)
- **Theme**: Geeky Hugo (located in `themes/geeky-hugo/`)
- **Bootstrap 5**: CSS framework
- **JavaScript**: Terser for minification, Fuse.js for search, Mark.js for highlighting

## Development Commands

### Local Development
```bash
# From the exampleSite directory (production site)
cd exampleSite
hugo server --disableFastRender --themesDir ../themes --theme geeky-hugo --gc
```

### Build
```bash
# Production build
hugo --minify --gc
```

### JavaScript Minification
```bash
# Minify JavaScript assets
npm run minify
```

## Project Structure

### Content Architecture
- **Primary site content**: `exampleSite/content/` (the actual production site)
  - `blog/` - All blog posts (main content section)
  - Static pages: `contact.md`, `gears.md`, `expanses.md`, `books.md`, etc.
- **Root content**: `content/` - Contains test/development content only

### Configuration Structure
- **Root config**: `config.toml` (deprecated/legacy)
- **Active config**: `exampleSite/config/_default/`
  - `config.toml` - Main Hugo configuration
  - `params.toml` - Site parameters (logos, social links, widgets, analytics)
  - `menus.toml` - Navigation menus (main, footer, destinations hierarchy)
  - `plugins.toml` - External JS libraries (Fuse.js, Mark.js)

### Theme Structure
The site uses a custom Hugo theme located in `themes/geeky-hugo/`:
- **Layouts**: `themes/geeky-hugo/layouts/`
  - `_default/` - Base templates (baseof.html, single.html, list.html, etc.)
  - `partials/` - Reusable components (head.html, header.html, footer.html, etc.)
  - `shortcodes/` - Custom Hugo shortcodes (carousel, gmap, omap, youtube2, card, etc.)
  - `index.html` - Homepage template
- **Assets**: `themes/geeky-hugo/assets/`
  - `scss/` - Sass/SCSS stylesheets
  - `js/` - JavaScript files
  - `css/` - Compiled CSS
- **Data**: `themes/geeky-hugo/data/`
  - `guides.json` - Guide data
  - `consent.yaml` - Cookie consent configuration

### Deployment
- **Production**: Deployed via Netlify
- **Build command**: Defined in `netlify.toml` for root theme and `exampleSite/netlify.toml` for example site
- **Publish directory**: `exampleSite/public` (for theme), `public` (for exampleSite)
- **Hugo version**: 0.145.0

## Important Configuration Details

### Site Configuration
- **Base URL**: https://www.vandipety.it
- **Language**: Italian (it-IT)
- **Main sections**: `blog`
- **Pagination**: 20 posts per page
- **Summary length**: 20 words
- **Write stats**: Enabled (generates `hugo_stats.json`)

### Services & Analytics
- **Google Analytics**: ID `G-E9L2CG2NZ6`
- **Disqus comments**: Shortname `vandipety-it`
- **Search**: Enabled using Fuse.js

### Custom Features
- **AI Summary**: Enabled (`ai_summary_enabled = true`)
- **Widgets**: Sidebar includes youtube-widgets, guida, newsletter, recommended-posts
- **Cookie consent**: Enabled with 7-day expiration
- **Custom shortcodes**: Extensive collection for images, maps, carousels, YouTube embeds, etc.

## Content Guidelines

### Blog Posts
- All posts are in `exampleSite/content/blog/`
- Posts are in Markdown format with YAML frontmatter
- Content focuses on travel destinations, van life, and travel guides
- Categories organized by continent and country

### Navigation Structure
The site has a hierarchical navigation with destinations grouped by:
- **Europa** (Europe): Multiple countries including Italy, France, Spain, Russia, etc.
- **Asia**: Armenia, South Korea, Japan, Iraq, Turkey
- **Africa**: Morocco, Mauritania, Senegal

## Custom Shortcodes

The theme provides many custom shortcodes for enhanced content:
- `{{< image >}}` - Image handling with optimization
- `{{< carousel >}}` - Image carousels
- `{{< gmap >}}` / `{{< omap >}}` - Map embeds (Google/OpenStreetMap)
- `{{< youtube2 >}}` - YouTube embeds
- `{{< card >}}` - Content cards
- `{{< button >}}` - Styled buttons
- `{{< center >}}` / `{{< bold >}}` - Text formatting
- `{{< indice >}}` - Table of contents
- `{{< chart >}}` - Data charts
- `{{< blogFooter >}}` - Blog post footers

## Working with This Codebase

### Making Changes
1. **Content changes**: Edit files in `exampleSite/content/`
2. **Configuration changes**: Modify files in `exampleSite/config/_default/`
3. **Theme customization**: Override theme files by creating matching files in root `layouts/` or `assets/`
4. **Menu updates**: Edit `exampleSite/config/_default/menus.toml`

### Theme Development
- Theme source is in `themes/geeky-hugo/`
- To customize theme behavior, create override files in root directories rather than modifying theme files directly
- The theme uses Hugo's template lookup order, so root files override theme files

### Testing
- Always test changes locally with `npm run dev` or `hugo server`
- Check that `hugo_stats.json` is properly generated (used for PurgeCSS/optimization)
- Verify navigation and search functionality after changes

### Deployment Considerations
- The site uses `writeStats = true` for CSS optimization
- Resource caching is configured with 720h maxAge
- Images are set to 90% quality
- All outputs (HTML, JSON, RSS) are minified
- Security headers are configured in `netlify.toml`
