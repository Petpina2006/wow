# RC_CAR Educational Website — Design Brainstorm

## Reference
Educational robotics website for Royal University of Phnom Penh (RUPP) — RC Car projects with Arduino/ESP32.

---

## Three Stylistic Approaches

### Approach A — "Deep Space Lab"
A dark, immersive tech-lab aesthetic inspired by mission control centers and embedded systems dashboards. Deep navy + electric blue + cyan accents on near-black backgrounds. Glassmorphism panels float over subtle circuit-board textures.
**Probability: 0.07**

### Approach B — "Blueprint Engineering"
A light, technical blueprint aesthetic: white/light-gray backgrounds with strong blue structural lines, monospaced code accents, and engineering-drawing motifs. Clean, academic, and authoritative.
**Probability: 0.04**

### Approach C — "Neon Circuit"
A vibrant dark-mode design with neon green/cyan highlights, animated grid backgrounds, and a cyberpunk-meets-classroom feel. High contrast, energetic, and youthful.
**Probability: 0.02**

---

## Chosen Approach: A — "Deep Space Lab"

### Design Movement
Mission-Control Dark Tech — inspired by NASA control rooms, embedded systems IDEs, and modern developer dashboards.

### Core Principles
1. **Depth through layers** — glassmorphism cards float above dark gradient backgrounds with subtle blur and border glow.
2. **Electric blue as the signal color** — every interactive element, highlight, and CTA uses the same electric blue (#1E90FF / oklch(0.62 0.22 255)) to create a coherent visual language.
3. **Monospaced accents for code identity** — code blocks, pin labels, and technical values use JetBrains Mono to reinforce the engineering context.
4. **Motion as information** — animations communicate state (car moving, sensor pulsing, PID oscillating) rather than being decorative.

### Color Philosophy
- Background: `oklch(0.10 0.01 260)` — near-black with a cool blue undertone (space, depth)
- Surface: `oklch(0.16 0.015 260)` — dark navy for cards
- Border/Glass: `oklch(1 0 0 / 8%)` — very subtle white border for glass effect
- Primary: `oklch(0.62 0.22 255)` — electric blue (action, links, highlights)
- Accent: `oklch(0.75 0.18 195)` — cyan (sensor data, live values)
- Text: `oklch(0.92 0.005 260)` — near-white for readability
- Muted: `oklch(0.55 0.01 260)` — gray-blue for secondary text
- Gold: `oklch(0.78 0.15 85)` — for leader badges

### Layout Paradigm
Fixed left sidebar (64px collapsed / 240px expanded) + sticky top navbar + main scrollable content area. The sidebar uses icon-first navigation with Khmer labels on hover/expand. Content area uses asymmetric section layouts — never full-width centered columns.

### Signature Elements
1. **Glowing blue border cards** — cards with `border: 1px solid oklch(0.62 0.22 255 / 30%)` and a subtle `box-shadow: 0 0 20px oklch(0.62 0.22 255 / 15%)` glow.
2. **Circuit-trace dividers** — thin horizontal lines with a small animated dot traveling along them between sections.
3. **Monospaced data badges** — small pill badges showing pin numbers, distances, and values in JetBrains Mono.

### Interaction Philosophy
Every hover reveals more information. Cards lift and glow on hover. Sidebar expands smoothly. Simulation controls give immediate visual feedback. Code editor is always editable.

### Animation
- Page transitions: fade + slight upward slide (200ms ease-out)
- Card hover: translateY(-4px) + glow intensify (180ms ease-out)
- Sidebar expand: width transition 250ms cubic-bezier(0.23, 1, 0.32, 1)
- Simulation: requestAnimationFrame canvas loops
- Hero robot: floating animation (3s ease-in-out infinite)
- Stagger entrance: 60ms per card

### Typography System
- Display/Headings: **Battambang** (Khmer + Latin bold) — for page titles and hero text
- Body/UI: **Hanuman** (Khmer) + **Inter** (Latin) — for descriptions and UI labels
- Code: **JetBrains Mono** — for all code, pin labels, and technical values
- Scale: 12/14/16/20/24/32/48px

### Brand Essence
**RC_CAR by RUPP** — Cambodia's premier robotics learning platform, for engineering students who build the future with their hands. *Bold. Technical. Cambodian.*

### Brand Voice
Headlines are direct and empowering: "ស្វែងយល់ពីរថយន្ត RC ជាមួយ Arduino" ("Discover RC Cars with Arduino")
CTAs are action-first: "ចាប់ផ្តើមរៀន" ("Start Learning"), "សាកល្បងការក្លែងធ្វើ" ("Try Simulation")
No generic filler.

### Wordmark & Logo
RUPP shield emblem (gear + book motif) in electric blue on transparent background. Used in navbar top-left at 40px height.

### Signature Brand Color
Electric Blue — `oklch(0.62 0.22 255)` — the single ownable color across all interactive elements.

---

## Style Decisions
- Dark theme as default; light mode toggle available.
- Glassmorphism cards: `backdrop-blur-md bg-white/5 border border-white/10`.
- Sidebar always fixed, icons visible, labels on expand.
- All Khmer text uses Battambang for headings, Hanuman for body.
- Code editor uses dark theme (VS Code Dark+).
- Simulations run on HTML5 Canvas with requestAnimationFrame.
