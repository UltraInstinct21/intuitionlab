---
name: Superr
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#594137'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#8d7165'
  outline-variant: '#e1bfb2'
  surface-tint: '#a23f00'
  primary: '#a23f00'
  on-primary: '#ffffff'
  primary-container: '#ff6f1e'
  on-primary-container: '#5b2000'
  inverse-primary: '#ffb595'
  secondary: '#725a42'
  on-secondary: '#ffffff'
  secondary-container: '#fbdabb'
  on-secondary-container: '#775e46'
  tertiary: '#625d59'
  on-tertiary: '#ffffff'
  tertiary-container: '#a09a95'
  on-tertiary-container: '#36322e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbcc'
  primary-fixed-dim: '#ffb595'
  on-primary-fixed: '#351000'
  on-primary-fixed-variant: '#7c2e00'
  secondary-fixed: '#feddbe'
  secondary-fixed-dim: '#e1c1a3'
  on-secondary-fixed: '#291806'
  on-secondary-fixed-variant: '#58432c'
  tertiary-fixed: '#e9e1db'
  tertiary-fixed-dim: '#ccc5c0'
  on-tertiary-fixed: '#1e1b18'
  on-tertiary-fixed-variant: '#4a4642'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Bricolage Grotesque
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  display-md:
    fontFamily: Bricolage Grotesque
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.2'
    letterSpacing: -0.03em
  headline-sm:
    fontFamily: Bricolage Grotesque
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-bold:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  xxl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
---

## Brand & Style

This design system captures the nostalgic, tactile warmth of a schoolyard notebook, elevated for a modern digital context. The brand personality is playful, studious, and unpretentious. It avoids the clinical coldness of typical software in favor of a "handmade" digital aesthetic.

The style is a blend of **Soft-Brutalism** and **Tactile Minimalism**. It utilizes high-contrast outlines and a limited, punchy palette to create a structured but expressive environment. Key visual identifiers include chunky, lowercase-driven typography, asymmetrical layouts that mimic a scrapbook, and "sticker" decorative elements that break the grid to provide moments of delight and emphasis.

## Colors

The palette is centered on the contrast between a warm, paper-like canvas and vibrant "marker" accents.

- **Paper Canvas (#fdfbf9):** The primary background color, providing a low-strain, tactile base.
- **Cocoa Ink (#2b1a07):** Used for all body text and primary iconography to maintain a softer look than pure black.
- **Marker Orange (#ff6f1e):** The primary action and emphasis color. It should feel like it was drawn on the page.
- **Dew Drop (#f7efe9):** A secondary surface color used for grouping elements or subtle backgrounds.
- **Midnight Outline (#171717):** Used for thin, 1px - 1.5px borders to define structure.
- **Decorative Accents:** Blue, pink, and green are reserved for "stickers"—non-functional decorative punctuations or secondary status indicators.

## Typography

The typographic hierarchy relies on a strong contrast between the expressive, chunky display face and the technical, clean UI face.

- **Headlines:** Use **Bricolage Grotesque** (as a proxy for the requested rounded-serif aesthetic). All headlines and display text must be set in **lowercase**. This is a non-negotiable brand rule to maintain the "notebook" vibe.
- **UI & Labels:** Use **Geist**. Its monospaced-influenced proportions provide a "noted" feel that complements the handwriting-adjacent display type while ensuring maximum legibility for functional data.
- **Line Height:** Body text uses a generous 1.6x line height to simulate the spacing of a ruled notebook.

## Layout & Spacing

The layout is **Asymmetric and Editorial**. It rejects perfect symmetry in favor of balanced visual weight. 

- **The Grid:** A 12-column fluid grid for desktop, but with intentionally varied column spans. For example, a main content block may take 7 columns while a "sticker" or sidebar takes 4, leaving a 1-column gap to create "breathing room."
- **Margins:** Large outer margins (64px+) on desktop create a "page on a desk" effect.
- **Asymmetry:** Shift elements slightly off-center or use varying heights for adjacent cards to mimic papers laid out on a table.
- **Mobile:** Transition to a single-column layout with 16px side margins, maintaining large vertical gaps (48px) between sections.

## Elevation & Depth

This design system avoids realistic shadows and deep blurs. Depth is achieved through layering and hard "sticker" shadows.

- **Tonal Layering:** Most depth is implied by stacking **Dew Drop** surfaces on top of **Paper Canvas** backgrounds.
- **Outline-Only Depth:** Use thin (1px) **Midnight Outline** (#171717) for all containers. 
- **Hard Shadows:** Instead of soft ambient blurs, use a "Hard Offset" shadow for buttons and active cards. The shadow should be a solid color (Cocoa Ink) at 10-20% opacity, offset 2px down and 2px right, with 0px blur. 
- **Matte Finish:** Surfaces should be 100% opaque. Avoid glassmorphism or transparency to maintain the physical paper metaphor.

## Shapes

Shapes are rounded and friendly, reinforcing the "schoolyard" feel.

- **Cards:** Use a consistent **12px** corner radius.
- **Buttons:** Use a more aggressive **20px** (or fully pill-shaped) radius to make them feel "squishy" and inviting.
- **Stickers:** Decorative stickers use a tighter **4px** radius or custom organic shapes (circles, stars, or notched rectangles) to look like they were cut out by hand.
- **Borders:** Every container must have a visible 1px border in **Midnight Outline**.

## Components

- **Buttons:** Filled with **Marker Orange** with **Cocoa Ink** text. On hover, apply a 2px offset "hard shadow." Text is always lowercase.
- **Cards:** Background in **Dew Drop** or **Paper Canvas**. 1px border. No soft shadows. Use asymmetric padding (e.g., more padding at the bottom than the top) for an editorial look.
- **Input Fields:** Thick bottom border or a full 1px outline. Use **Geist** for input text. Placeholders should be in a 40% opacity version of Cocoa Ink.
- **Chips/Labels:** Small, pill-shaped elements using the **Sticker** colors (Blue/Pink/Green). These should look like labels stuck onto the page.
- **Lists:** Items separated by a thin horizontal line mimicking a notebook's ruling. Use Marker Orange for bullets or checkboxes.
- **Checkboxes:** Squared with 4px radius. When checked, the fill is Marker Orange with a hand-drawn style "x" or checkmark in Cocoa Ink.
- **Stickers:** Non-interactive decorative elements. Place them overlapping the corners of cards or in white spaces.