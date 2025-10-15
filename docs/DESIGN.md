# TaskFlow Design System

This document captures the design principles and UI patterns used across TaskFlow. It ensures consistency, accessibility, and a clean modern look throughout pages and components.

## Principles

- Clarity over flash: minimal visual noise, purposeful accents.
- Consistency: same spacing, radii, and type scale across pages.
- Accessibility by default: keyboard focus, color contrast, and screen reader hints.
- Responsive first: layouts scale gracefully from mobile to desktop.
- Feedback matters: loading, error, and empty states are explicit and unobtrusive.

## Foundations

### Color tokens (from CSS variables)

- background: `var(--background)` — base page background
- surface: `var(--surface)` — cards/sections subtle contrast
- surface-alt: `var(--surface-alt)` — further separation for UI blocks
- foreground: `var(--foreground)` — primary text
- foreground-secondary: `var(--foreground-secondary)` — secondary text
- border: `var(--border)` — dividers and input borders
- accent: `var(--accent)` / `--accent-foreground` — primary brand action
- destructive: `var(--destructive)` — error states and critical actions

These tokens are mapped into Tailwind (`tailwind.config.ts`) so you can use them as `bg-background`, `text-foreground`, `border-border`, `bg-surface`, `text-secondary`, `bg-accent`, etc.

### Typography

- Family: Inter (system fallbacks). Loaded in `globals.css` and `app/layout.tsx`.
- Headings: bold, tight tracking on brand, moderate line-height.
- Body: comfortable line-height (1.6).
- Page titles: `text-3xl`–`text-4xl` depending on context.
- Section titles: `text-xl`–`text-2xl`.
- Labels/captions: `text-sm` / `text-xs`.

### Spacing & Radii

- Spacing scale: Tailwind default with emphasis on `4, 6, 8` steps (16/24/32px).
- Radii: use rounded-full for inputs/buttons (pill style) and rounded-2xl for containers.
- Section containers: generous padding (p-6 / p-8) on desktop.

### Elevation

- Prefer flat UI. Avoid heavy shadows.
- If separation is needed, use subtle contrast with `bg-card/60` or `bg-surface` and thin borders (`border-border`).

## Components

### Inputs (Text/Password)

- Structure: label (text-sm, medium) above input.
- Style: `rounded-full border border-border bg-background` with internal icon when helpful.
- Focus: `focus:border-accent focus:ring-4 focus:ring-accent/10`. No outline removal without a replacement.
- Placeholder color: `placeholder-foreground-secondary`.

### Password Visibility Toggle

- Small icon button aligned right inside the input.
- Accessible name toggles between "Show password" / "Hide password".

### Buttons

- Primary: `rounded-full bg-accent text-accent-foreground` with hover `bg-accent/90`.
- Disabled: `opacity-60` and `cursor-not-allowed`.
- Focus: `focus:ring-2 focus:ring-accent focus:ring-offset-2`.

### Alerts (Error/Success)

- Error: `rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive`.
- Use `aria-live="assertive"` region in forms to announce errors.

### Links

- Accent links use `text-accent hover:underline`.

## Patterns

### Authentication Layout (Login)

- Split layout on desktop (`lg:grid-cols-2`).
- Left: brand (logo + name) anchored top-left, then the form container.
- Right: colored surface background with a soft accent glow and a flat screenshot that blends into the page.
- Mobile: right panel hides; form becomes full width.

### Loading States

- Buttons: show spinner icon + text (e.g., Loader2) and disable.
- Sections: skeletons or subtle shimmer placeholders when feasible; otherwise small "Loading…" text with `aria-live="polite"`.

### Error States

- Form submission errors: stacked alert above fields, announced via aria-live.
- Inline errors (optional): small text under input in `text-destructive`.

### Empty States

- Provide a short friendly message and a primary next action.
- Keep it lightweight and consistent with section typography.

### Responsive Rules

- Mobile-first: single-column stacking, comfortable touch targets.
- Desktop: introduce grid columns, increase padding, and reveal right-side hero or secondary panels.

## Composition Examples

### Form Block

- Container: `rounded-2xl bg-card/60 p-6 sm:p-8` (no border when blending with page).
- Label + Input (with icon): see Inputs above.
- Actions row: remember-me checkbox (text-xs) + forgot link (text-xs, accent).
- Submit: pill primary button.

### Section/Card

- `rounded-2xl bg-surface p-6` for neutral content blocks.
- Use section header with title + optional actions on the right.

## Accessibility Checklist

- Every interactive control is keyboard reachable.
- Focus states are clearly visible.
- Landmark structure: header/nav/main where applicable.
- Error and loading announcements use `aria-live`.
- Sufficient contrast for text (WCAG AA where possible).

## Theming & Future Enhancements

- Dark mode: consider a dark color token set later (e.g., `prefers-color-scheme: dark`).
- Grid background option for hero sections: subtle grid overlay via CSS; keep it low-contrast.
- Image optimization: use Next `<Image>` with `placeholder="blur"` via static import once assets are verified; fallback to `<img>` if needed.

---

Use this document as the source of truth while implementing new pages and components so the experience stays coherent and professional.
