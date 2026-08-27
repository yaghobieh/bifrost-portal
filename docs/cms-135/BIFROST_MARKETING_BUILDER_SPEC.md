# Bifrost Marketing Builder — Elementor-parity build spec
_A brief for Cursor. Paste the "Prompt for Cursor" section at the bottom directly into chat/composer, or feed Cursor this whole file as context._

## 0. What this is
Rebuild the Bifrost "Marketing Pages" Stage plugin so it matches Elementor's actual interaction model, using **Bear UI** (bearui.com) as the component source instead of hand-rolled elements. Goal: an editor who has used Elementor should feel at home in under a minute.

## 1. Known gap — read before starting
I could not extract Bear UI's real component list or prop signatures (bearui.com/components is client-rendered; only page metadata was fetchable, not the docs body). **Do not invent Bear UI prop names.** Step 1 for Cursor is always: open the actual Bear UI package in this repo (or `node_modules/bear-ui` / wherever it's installed) and read the real exports and `.d.ts` / prop types before wiring anything up. Section 5 lists the components needed by *role* — match each role to whatever Bear UI actually exports under that name or a close synonym.

## 2. Panel layout — the Elementor-exact structure
Elementor's editor is **two panels + canvas**, not three-pane-with-inspector-on-the-right:

| Zone | Elementor behavior | What to build |
|---|---|---|
| **Left panel** | Default state: searchable widget library, grouped into collapsible categories (Basic, Pro, Site, General, Theme Elements). Selecting an element on canvas **replaces** the widget library with that element's settings (Content / Style / Advanced tabs). A "back" arrow returns to the widget library. | One panel component with two modes: `library` and `inspector`, swapped by selection state — not two separate fixed panels. |
| **Top bar of left panel** | Hamburger menu (Site Settings, Theme Builder, Templates, History, Keyboard Shortcuts, Exit to Dashboard), Structure/Navigator icon, Responsive breakpoint switcher, Undo/Redo, Preview, Publish/Update button. | Same icon row, same order. Breakpoint switcher shows Desktop/Tablet/Mobile (extend to your own breakpoints if you have more than 3). |
| **Canvas (center)** | Full-width live-rendered page. Hover outlines the section/column/widget under the cursor with a colored border + a small floating toolbar (drag handle, duplicate, delete) above it on hover — not just on click. | Match this: hover state ≠ selected state. Hover = thin outline + mini floating toolbar. Click/select = solid outline + left panel switches to inspector. |
| **Right side** | Nothing, in stock Elementor. (Pro adds a floating "Notes" panel, optional.) | Keep right panel empty/removed for true parity, or repurpose it only for something Elementor doesn't have (e.g., your AI suggestions) — see §6. |

**Decision needed from you:** keep AI suggestions on the right (a Bifrost addition Elementor doesn't have) or fold them into the left inspector under their own tab. Elementor-exact = no right panel at all.

## 3. Content tree / Navigator
Elementor's structural model, in order:
```
Section
  └─ Column (1 or more per section)
       └─ Widget (1 or more per column, or nested Inner Section)
```
Build the same three-level hierarchy. The **Navigator** (opened via the structure icon in the top bar, or `Ctrl/Cmd+I`) shows this tree as a collapsible outline overlaying the bottom-left of the canvas, with drag-to-reorder. Selecting a node in the Navigator selects it on canvas and vice versa.

## 4. Right-click context menu — exact Elementor item set
This is what Elementor actually shows (order matters, don't reshuffle):

**On a Section:**
Edit Section → Duplicate → Save as Global → Copy → Paste → Copy Style → Paste Style → Reset Style → **Delete**

**On a Column:**
Edit Column → Duplicate → Copy → Paste → Copy Style → Paste Style → Reset Style → **Delete**

**On a Widget:**
Edit `[Widget name]` → Duplicate → Copy → Paste Style → Reset Style → **Delete**

Rules to preserve:
- Destructive action (**Delete**) is always last, visually separated.
- **Paste** / **Paste Style** are shown but disabled (not hidden) when clipboard is empty — this is exactly the pattern we already used in the earlier Bifrost context-menu design, so that piece can carry over as-is.
- "Save as Global" only appears on Sections — this is what lets a section (e.g. your Split Hero) become a reusable template across pages, same concept as the "Save as reusable block" item we designed earlier. Keep that naming if you prefer it over Elementor's "Global"; the behavior is identical.

## 5. Widget/component inventory (map to Bear UI)
Group these the way Elementor groups its own panel, and go find the real Bear UI equivalent for each **role** below — do not assume the Bear UI component name matches 1:1:

**Basic**
- Heading, Text Editor (rich text), Image, Video, Button, Divider, Spacer, Icon, Icon Box, Icon List, Image Box, Google Maps, Icon Menu

**Layout / structure**
- Section (full-width row), Column, Inner Section, Container (flex/grid — Elementor's newer "Container" replaces Section+Column in flex mode; decide which model you're standardizing on)

**Forms / auth** *(this is where your Marketing Pages plugin already diverges from stock Elementor in a good way — keep these, they're your differentiator)*
- Credentials form, OAuth row, Testimonial quote

**Conversion**
- CTA band, Pricing table, Countdown, Progress bar/Stat strip, Gradient button (Bifrost-specific — keep)

**Site / dynamic**
- Site Logo, Site Title, Breadcrumbs, Post content blocks (skip these if Bifrost content isn't WP-style posts — swap for your own Bifrost content-model bindings instead)

For each, Cursor should produce a small manifest entry:
```ts
{
  id: 'heading',
  category: 'basic',
  label: 'Heading',
  icon: <BearUI icon name>,
  bearComponent: <actual Bear UI export, confirmed from source>,
  settingsSchema: { content: [...], style: [...], advanced: [...] } // see §7
}
```

## 6. Global color palette + right-click color editing
Elementor's "Global Colors" (Site Settings → Global Colors): 4 default named swatches (Primary, Secondary, Text, Accent) plus unlimited custom ones, all reusable across every widget's color pickers. Editing a global color updates every element using it, site-wide.

For Bifrost, seed the default palette with the tokens already established across your product (don't invent new ones):
```
Bridge Blue    #2951C4
Bridge Violet  #8A3FD4
Bridge Pink    #EA0A8E
Ink            #14161C
```
**Right-click color editing**, since you asked for it specifically: right-clicking any color swatch inside the Style tab (not the canvas — Elementor doesn't support right-click-to-recolor directly on canvas elements, only via their style-panel swatches) should open a small popover with:
- The current hex value, editable
- A "Save as global color" toggle — if on, this color becomes reusable and renaming it propagates everywhere it's used
- Recent colors row (last 8 used in this project)

This is a genuine Bifrost addition beyond stock Elementor (Elementor requires clicking the swatch, not right-clicking it) — flag it to your team as an intentional improvement, not a parity gap.

## 7. Per-widget settings schema (Content / Style / Advanced tabs)
Every widget in Elementor exposes exactly these three tabs when selected:
- **Content** — the widget's actual data (text, image src, link, form fields)
- **Style** — typography, color (via the global-palette picker in §6), spacing, borders, shadow, background
- **Advanced** — margin/padding (linked or per-side), responsive visibility (hide on desktop/tablet/mobile), CSS ID/class, custom CSS, motion effects (entrance animation)

Build this as one shared `<Tabs>` shell (Bear UI's tab component — confirm the real name) with a schema-driven form per widget type, not bespoke forms per widget — this is how Elementor scales to 90+ widgets without exploding its codebase, and it's how your `settingsSchema` from §5 should be consumed.

## 8. Responsive breakpoints
Elementor: Desktop → Tablet (≤1024px) → Mobile (≤767px) → (Pro adds Tablet Extra, Mobile Extra, Widescreen). Any style value can be overridden per breakpoint; the top-bar switcher changes which breakpoint you're editing, and unedited breakpoints inherit from the one above.

## 9. History & autosave
Ctrl/Cmd+Z undo stack visible as a list (top-bar History icon) showing a timestamped action log ("Added Section", "Edited Button text") — clicking any entry reverts to that point. Autosave runs in the background; a manual "Save Draft" / "Publish" pair sits in the top-right.

## 10. Prompt for Cursor
Paste this in:

> Read `/BIFROST_MARKETING_BUILDER_SPEC.md` in full before writing any code.
>
> First, open our actual Bear UI package and enumerate its real exported components and their prop types — do not use any component name from the spec's §5 as literal truth, it's a role description, not a confirmed API. Report back the mapping you find before generating UI.
>
> Then implement, in order: (1) the two-panel layout from §2 with library↔inspector swap-on-select, (2) the Section→Column→Widget tree from §3 with a Navigator overlay, (3) the right-click menu from §4 reusing our existing context-menu component if one exists in this repo, (4) the global color palette + right-click swatch editor from §6 seeded with the four Bifrost tokens, (5) the schema-driven Content/Style/Advanced tabs from §7, (6) responsive breakpoint switching from §8.
>
> Flag anywhere Bear UI is missing a component role entirely (e.g. no accordion, no color-picker primitive) instead of building a one-off — I'd rather add it to Bear UI properly than fork a duplicate inside the CMS.
