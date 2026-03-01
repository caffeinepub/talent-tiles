# Talent Tiles

## Current State
- Full-stack app with Motoko backend + React frontend
- Authentication flow: Login -> Register -> Dashboard (protected)
- Dashboard has sticky nav, distance/category filters, and a responsive grid of `CreatorTile` cards
- `CreatorTile` shows: photo section (cover image + distance badge + status badge), then below: avatar, name, neighborhood, view/bookmark counts
- Grid is 1 col mobile, 2 col sm/lg, 3 col xl

## Requested Changes (Diff)

### Add
- Category badge overlaid on the image (e.g. "Art", "Tech", "Music", "Fitness") — small pill near bottom-left of image, above the title
- Title overlay text on the image (bold title derived from creator name/bio headline)
- Contact and Share action buttons overlaid on the bottom of the image
- Distance/location info ("2.1 km away") shown as a small pill overlaid on the image bottom-left (already exists, needs to be part of the new bottom bar alongside category + buttons)
- Overlay gradient on the image (dark gradient from bottom to top so text is readable)
- Hover effect: card lifts with shadow, image scales slightly (already partial, needs polish)

### Modify
- `CreatorTile` component — redesigned to match the reference screenshot:
  - Large cover image with bottom dark gradient overlay
  - On the image overlay (bottom area, left-to-right):
    - Distance pill ("2.1km away" with pin icon) — bottom left
    - Category badge ("Art") — just above or next to distance
    - Title text (bold, white) just above category/distance area
    - "Process" / "Trusted" style status badges top-right (keep existing statusBadge)
    - Contact + Share buttons bottom-right area
  - Below image: white card area with avatar, name, location, view+like stats
- Grid breakpoints: 1 col mobile, 2 col tablet (sm), 3 col desktop (lg) — fix current xl-only 3-col to be lg
- Card visual: rounded-2xl, shadow, clean white background below image

### Remove
- Nothing removed; existing filters and nav remain intact

## Implementation Plan
1. Update `CreatorTile.tsx`:
   - Add dark bottom-to-top gradient overlay on image
   - Add title text overlay (use creator name as title or a crafted event/session title)
   - Add category badge overlay on image (pill, small, near title)
   - Add Contact + Share button row overlaid on image bottom
   - Distance pill stays bottom-left on image
   - Status badges (Process/Trusted style) stay top-right on image
   - Below image: keep avatar, name, neighborhood, add views + heart/like icon for stats
2. Update `ExtendedCreatorProfile` in `sampleCreators.ts` to add a `title` field (event/work title shown as image overlay)
3. Update `sampleCreators.ts` to add titles for all 12 creators (e.g. "Studio session – abstract series")
4. Fix grid columns in `DashboardPage.tsx`: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
5. Ensure hover effect: card `y: -4` lift + shadow intensify + image scale (framer motion + tailwind)
