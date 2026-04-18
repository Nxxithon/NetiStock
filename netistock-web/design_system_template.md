# 🎨 Luxury Dark UI — Design System Template

> **วัตถุประสงค์**: เอกสารนี้เป็น template สำหรับสร้างเว็บใหม่ที่มีสไตล์การออกแบบ **Luxury Minimalist Dark/Light UI**
> ออกแบบมาให้ AI IDE อ่านแล้วนำไปสร้าง UI ได้ทันที โดยปรับเนื้อหาและสีให้เข้ากับโปรเจ็คใหม่ได้อิสระ

---

## 1. Tech Stack & Libraries

| Library | Version (ตัวอย่าง) | หน้าที่ |
|---|---|---|
| **Next.js** (App Router) | 16+ | Framework หลัก, ใช้ `app/` directory, file-based routing |
| **React** | 19+ | UI Library |
| **TypeScript** | 5+ | Type Safety |
| **Tailwind CSS** | v4 | Utility-first CSS — ใช้ `@import "tailwindcss"` แบบ v4 |
| **Framer Motion** | 12+ | Animation library สำหรับ page transitions, modal, stagger effects |
| **Lucide React** | latest | Icon set — minimalist line icons |
| **clsx** | latest | Conditional className utility |
| **tailwind-merge** | latest | ป้องกัน Tailwind class conflict |

### Utility Function สำคัญ: `cn()`
ทุกโปรเจ็คควรมี helper function นี้ไว้ใน `lib/utils.ts`:

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**ใช้ `cn()` แทน string concatenation** สำหรับการรวม className ที่มีเงื่อนไข

---

## 2. Typography (ฟอนต์)

ใช้ **Google Fonts 2 ตัว** แบ่งหน้าที่ชัดเจน:

| ฟอนต์ | CSS Variable | หน้าที่ | ลักษณะการใช้งาน |
|---|---|---|---|
| **Inter** | `--font-inter` → `font-sans` | Body text, labels, buttons, ข้อความทั่วไป | Clean, อ่านง่าย, modern sans-serif |
| **Syne** | `--font-syne` → `font-display` | Headings, Brand name, ชื่อสินค้า | โดดเด่น, geometric, ดูพรีเมียม |

### วิธีตั้งค่าใน Next.js (App Router)

```tsx
// layout.tsx
import { Inter, Syne } from "next/font/google";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const syne = Syne({ variable: "--font-syne", subsets: ["latin"] });

// ใส่ variable ลงใน <body>
<body className={cn(inter.variable, syne.variable, "font-sans")}>
```

### วิธีตั้งค่าใน Tailwind v4

```css
@theme {
  --font-sans: var(--font-inter), sans-serif;
  --font-display: var(--font-syne), sans-serif;
}
```

### Typography Scale & Conventions

| ประเภท | Tailwind Class | ตัวอย่างการใช้ |
|---|---|---|
| **Hero heading** (หน้าหลัก) | `font-display text-5xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tight` | พาดหัวขนาดใหญ่มาก, leading แน่น |
| **Section heading** | `font-display text-4xl` | ชื่อหมวด เช่น "Selected Exclusives" |
| **Card heading** | `font-display text-2xl` หรือ `text-xl` | ชื่อสินค้า, ชื่อ Modal |
| **Body text** | `font-sans text-sm leading-relaxed` | ข้อความอ่านทั่วไป |
| **Labels / Micro text** | `font-sans text-xs uppercase tracking-widest` หรือ `tracking-[0.3em]` | Label ฟอร์ม, หมวดหมู่, สถานะ |
| **Super micro text** | `font-sans text-[10px] uppercase tracking-widest` | ข้อความระดับ footnote, security notices |
| **Brand logo** | `font-display text-2xl` | ชื่อแบรนด์บน Navbar |

### กฎสำคัญ:
- **Labels ทุกตัว** ต้อง `uppercase tracking-widest` → ให้ความรู้สึก luxury
- **ฟอนต์ Display** ใช้สำหรับ heading เท่านั้น ห้ามใช้กับ body text
- **ฟอนต์ Sans** ใช้กับทุกอย่างยกเว้น heading

---

## 3. Color System (ระบบสี)

ใช้ระบบ **CSS Custom Properties** + **OKLCH color space** เพื่อให้เปลี่ยน theme ได้ง่าย

### 3.1 Token Names (ชื่อตัวแปร)

ไม่ว่าจะเป็นสีอะไร ใช้ชื่อ semantic ทุกครั้ง:

| Token | หน้าที่ | ตัวอย่าง Dark Mode | ตัวอย่าง Light Mode |
|---|---|---|---|
| `--color-background` | พื้นหลังทั้งหน้า | `oklch(0.12 0.01 50)` เทาเข้มอุ่น | `oklch(0.965 0.015 65)` ครีมอุ่น |
| `--color-foreground` | ตัวหนังสือหลัก | `oklch(0.96 0.01 50)` ขาวอุ่น | `oklch(0.18 0.03 50)` น้ำตาลเข้ม |
| `--color-primary` | สีหลัก (ปุ่ม, accent, highlight) | `oklch(0.75 0.12 75)` ทอง-ส้ม | `oklch(0.68 0.18 55)` ส้มอิฐ |
| `--color-primary-hover` | สี primary ตอน hover | สว่างขึ้น/เข้มขึ้นจาก primary | เข้มขึ้นจาก primary |
| `--color-primary-foreground` | ตัวหนังสือบนปุ่ม primary | เข้มมาก (ให้ contrast กับ primary) | ขาว/สว่างมาก |
| `--color-surface` | พื้นหลัง Card / Panel | เข้มกว่า background เล็กน้อย | สว่างกว่า background เล็กน้อย |
| `--color-surface-hover` | surface ตอน hover | สว่างขึ้นจาก surface | เข้มขึ้นจาก surface |
| `--color-muted` | พื้นหลังรอง (dividers ถ้าเป็น solid) | เทาปานกลาง | เทาอ่อนอุ่น |
| `--color-muted-foreground` | ข้อความรอง / placeholder | เทาอ่อน | น้ำตาลเทา |
| `--color-border` | เส้นขอบทั้งหมด | เทาเข้มบาง | เทาใสอุ่นบาง |
| `--color-glow` | Ambient glow effect | primary + opacity 15% | primary + opacity 20% |

### 3.2 โครงสร้าง CSS

```css
@import "tailwindcss";

@theme {
  --font-sans: var(--font-inter), sans-serif;
  --font-display: var(--font-syne), sans-serif;
}

@layer base {
  :root {
    /* === DARK MODE (Default) === */
    --color-background: oklch(0.12 0.01 50);     /* ตัวอย่าง: Warm Charcoal */
    --color-foreground: oklch(0.96 0.01 50);     /* ตัวอย่าง: Off-White Warm */
    --color-primary: oklch(0.75 0.12 75);        /* ตัวอย่าง: Gold-Orange */
    --color-primary-hover: oklch(0.85 0.10 75);
    --color-primary-foreground: oklch(0.12 0.01 50);
    --color-surface: oklch(0.16 0.02 50);
    --color-surface-hover: oklch(0.20 0.02 50);
    --color-muted: oklch(0.3 0.01 50);
    --color-muted-foreground: oklch(0.65 0.01 50);
    --color-border: oklch(0.25 0.01 50);
    --color-glow: oklch(0.75 0.12 75 / 0.15);

    background-color: var(--color-background);
    color: var(--color-foreground);
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                color 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* === LIGHT MODE === */
  .light {
    --color-background: oklch(0.965 0.015 65);
    --color-foreground: oklch(0.18 0.03 50);
    --color-primary: oklch(0.68 0.18 55);
    --color-primary-hover: oklch(0.58 0.20 55);
    --color-primary-foreground: oklch(0.98 0.01 65);
    --color-surface: oklch(0.975 0.012 65);
    --color-surface-hover: oklch(0.95 0.02 65);
    --color-muted: oklch(0.92 0.015 65);
    --color-muted-foreground: oklch(0.42 0.04 55);
    --color-border: oklch(0.87 0.025 65);
    --color-glow: oklch(0.68 0.18 55 / 0.20);
  }
}
```

### 3.3 วิธีใช้สีใน Tailwind Class

ทุกที่ที่ใช้สี ให้อ้างผ่าน CSS variable:

```
bg-[var(--color-background)]
text-[var(--color-foreground)]
border-[var(--color-border)]
text-[var(--color-primary)]
bg-[var(--color-surface)]
text-[var(--color-muted-foreground)]
```

**ห้าม hardcode สีลงไปตรงๆ** (ยกเว้น semantic colors อย่าง `text-red-500`, `text-green-500` สำหรับ error/success)

### 3.4 เทคนิคสร้าง "Warm" Theme

- Hue ทุกตัวอยู่ในช่วง **50–75** (warm amber-orange range)
- แม้แต่สี neutral (border, muted) ก็มี **hue tint** เดียวกับ primary → ทำให้ดู cohesive
- ถ้าอยากเปลี่ยนโทนสีเป็นสีอื่น เช่น น้ำเงิน → เปลี่ยน hue ทุกตัวไปที่ช่วง 240–260

---

## 4. Theme Switching (Dark/Light Mode)

### Pattern: Class-based switching ด้วย Context

```tsx
// AppProvider.tsx
type Theme = "dark" | "light";

// Toggle โดยเพิ่ม/ลบ class "light" ที่ <html> และ <body>
useEffect(() => {
  if (theme === "light") {
    document.documentElement.classList.add("light");
    document.body.classList.add("light");
  } else {
    document.documentElement.classList.remove("light");
    document.body.classList.remove("light");
  }
  localStorage.setItem("app-theme", theme);
}, [theme]);
```

### Toggle Button Pattern

```tsx
<button onClick={toggleTheme} className="p-2 hover:bg-[var(--color-surface)] rounded-full transition-colors">
  {theme === "dark"
    ? <Sun className="w-4 h-4 text-[var(--color-muted-foreground)]" />
    : <Moon className="w-4 h-4 text-[var(--color-muted-foreground)]" />}
</button>
```

---

## 5. Light Mode เพิ่มเติม (Warm Card Shadow & Accent)

```css
/* Card shadow สำหรับ Light Mode (สีอุ่น ไม่ใช่เทาดำ) */
.light .card-warm {
  box-shadow:
    0 1px 2px oklch(0.68 0.18 55 / 0.06),
    0 4px 12px oklch(0.68 0.18 55 / 0.08);
  border: 1px solid oklch(0.87 0.025 65);
}
.light .card-warm:hover {
  box-shadow:
    0 2px 4px oklch(0.68 0.18 55 / 0.08),
    0 8px 24px oklch(0.68 0.18 55 / 0.14);
}

/* Accent bar ซ้ายสำหรับ section */
.light .accent-bar {
  border-left: 3px solid oklch(0.68 0.18 55);
  padding-left: 1rem;
}

/* Selection highlight */
.light ::selection {
  background-color: oklch(0.68 0.18 55 / 0.30);
  color: oklch(0.18 0.03 50);
}
```

---

## 6. Global Enhancements (Scrollbar, Selection, Page Transition)

```css
/* Text selection */
::selection {
  background-color: var(--color-primary);
  color: var(--color-primary-foreground);
}

/* Custom scrollbar */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: var(--color-background); }
::-webkit-scrollbar-thumb { background: var(--color-muted); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--color-border); }

/* Page transition */
.page-transition {
  animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fade-in {
  from { opacity: 0; filter: blur(4px); transform: translateY(10px); }
  to { opacity: 1; filter: blur(0); transform: translateY(0); }
}
```

---

## 7. Animation System (Framer Motion)

### 7.1 Easing Curve มาตรฐาน

ใช้ **Smooth Deceleration** ทุกที่:
```
ease: [0.16, 1, 0.3, 1]
```
นี่คือ ease-out ที่ sharp ตอนเริ่ม แล้วชะลอ smooth → ให้ความรู้สึก premium

### 7.2 Animation Variants (Reusable)

```tsx
import { type Variants } from "framer-motion";

// Stagger Container — ใช้ครอบ children ที่จะ stagger
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

// Fade Up — ขยับขึ้น + fade in
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1, y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  },
};

// Fade Up with Blur — สำหรับหน้า Login / Hero ที่อยากได้เอฟเฟกต์ชัดเจนขึ้น
const fadeUpBlur: Variants = {
  hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
  show: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};
```

### 7.3 วิธีใช้ Stagger + Children

```tsx
<motion.div initial="hidden" animate="show" variants={staggerContainer}>
  <motion.h1 variants={fadeUp}>Heading</motion.h1>
  <motion.p variants={fadeUp}>Paragraph</motion.p>
  <motion.button variants={fadeUp}>CTA</motion.button>
</motion.div>
```

### 7.4 Modal / Popup Animation

```tsx
// Backdrop
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className="fixed inset-0 bg-black/60 backdrop-blur-sm"
/>

// Modal Content
<motion.div
  initial={{ scale: 0.95, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0.95, opacity: 0 }}
  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
  className="bg-[var(--color-surface)] border border-[var(--color-border)] p-8 shadow-2xl"
/>
```

### 7.5 Toast / Alert Popup Animation

```tsx
<motion.div
  initial={{ opacity: 0, y: 50, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95, y: 20 }}
  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
/>
```

### 7.6 Marquee / Scrolling Text

```tsx
<motion.div
  animate={{ x: ["0%", "-50%"] }}
  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
  className="flex whitespace-nowrap gap-12"
>
  {/* duplicate content 2x สำหรับ seamless loop */}
</motion.div>
```

### 7.7 Loading Spinner Pulse

```tsx
<motion.div
  animate={{ scale: [0.8, 1, 0.8], opacity: [0.3, 1, 0.3] }}
  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
/>
```

---

## 8. Component Patterns (รูปแบบ Component)

### 8.1 Navbar

**ลักษณะ:**
- `fixed top-0`, `h-20`, `bg-[var(--color-background)]/80 backdrop-blur`, `z-50`
- ขอบล่างเป็น gradient line: `bg-gradient-to-r from-transparent via-[var(--color-primary)]/40 to-transparent`
- Brand name ใช้ `font-display text-2xl text-[var(--color-primary)]`
- ปุ่ม action (cart, theme, lang) ใช้ icon ขนาด `w-4 h-4` หรือ `w-5 h-5`
- Cart badge เป็น `rounded-full bg-[var(--color-primary)]` ขนาดเล็กมากซ้อนบน icon

**โครงสร้าง:**
```
[Brand Logo]          [Theme Toggle] [Lang Toggle] [Cart Icon] [Sign Out]
```

### 8.2 Promotion Bar (ด้านบนสุด)

- `fixed top-0`, `h-8`, `bg-[var(--color-primary)]`, `z-[60]` (สูงกว่า Navbar)
- ข้อความเลื่อนแบบ marquee ด้วย Framer Motion
- ข้อความ: `text-[10px] uppercase tracking-[0.3em]`

### 8.3 Hero Section

- `h-[60vh]` หรือใหญ่กว่า, `flex flex-col justify-end`
- มี **ambient glow** ลอยอยู่: `rounded-full bg-[var(--color-primary)] opacity-10 blur-[120px]`
- Subtitle: เส้นนำ `h-px w-12 bg-primary` + text `uppercase tracking-[0.2em] text-xs`
- Title: `font-display text-5xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tight`
- ทุกอย่าง stagger animate เข้ามา

### 8.4 Product Card

**โครงสร้าง:**
```
┌──────────────────────────┐
│  [Image: aspect-[4/5]]   │  ← มี gradient overlay บน+ล่าง
│  Category label (top-left)│
│  SKU label (bottom-left)  │
│                           │
│  ── Hover Overlay ──      │  ← bg-black/40, แสดง 2 ปุ่ม
│  [View Details] [Add Cart]│
├──────────────────────────┤
│  Product Name    Price    │  ← font-display + font-sans
│  Stock info               │
└──────────────────────────┘
```

**สไตล์สำคัญ:**
- Card: `bg-[var(--color-surface)] rounded-sm overflow-hidden card-warm`
- Hover effect: `hover:scale-[1.03] hover:z-10 transition-all duration-500`
- Image: `object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700`
- Gradient overlay: `bg-gradient-to-b from-black/60 to-transparent` (top) + `bg-gradient-to-t from-black/60 to-transparent` (bottom)
- Hover buttons: `bg-white text-black` / `border border-white text-white`

### 8.5 Modal / Dialog

**สไตล์:**
- Backdrop: `bg-black/60 backdrop-blur-sm`
- Content: `bg-[var(--color-surface)] border border-[var(--color-border)] p-8 shadow-2xl`
- **ไม่มี border-radius** (sharp corners = luxury feel)
- Close button: `absolute top-4 right-4`, icon `X`
- Heading: `font-display text-2xl`
- Labels: `text-xs uppercase tracking-widest text-[var(--color-muted-foreground)]`

### 8.6 Form Inputs

**สไตล์:**
- **Border-bottom only**: `bg-transparent border-b border-[var(--color-border)] py-3 outline-none focus:border-[var(--color-primary)] transition-colors`
- Label อยู่ข้างบน: `text-xs uppercase tracking-widest text-[var(--color-muted-foreground)]`
- มี icon ทางซ้าย (optional): `absolute left-0 top-1/2 -translate-y-1/2`
- Textarea ใช้ full border: `border border-[var(--color-border)] p-4`
- Focus state: เปลี่ยนสี border → primary + เปลี่ยนสี label → primary (ผ่าน `group-focus-within`)

### 8.7 Buttons

| ประเภท | Tailwind Class |
|---|---|
| **Primary CTA** | `bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary-hover)] py-4 uppercase tracking-widest text-xs` |
| **Outlined** | `border border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]` |
| **Ghost** | `text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors` |
| **Primary Outlined (Login CTA)** | `border border-[var(--color-primary)] bg-[var(--color-primary)] hover:bg-transparent hover:text-[var(--color-primary)]` → reverses on hover |

**กฎ:**
- ปุ่มทุกตัว `uppercase tracking-widest text-xs font-sans`
- ไม่มี `rounded` (sharp corners) ยกเว้น icon buttons ใช้ `rounded-full`
- Spinner ในปุ่ม: `w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin`

### 8.8 Alert / Toast Popup

**ลักษณะ:**
- `fixed bottom-8 left-1/2 -translate-x-1/2 z-[99999]`
- `bg-[var(--color-surface)]/80 backdrop-blur-xl border border-[var(--color-border)] shadow-2xl`
- มี icon แยกตาม type: `success` (Check, สีเขียว), `error` (AlertCircle, สีแดง), `info` (Info, สี primary)
- Title: `text-xs uppercase tracking-widest font-medium`
- Message: `text-sm text-[var(--color-muted-foreground)] leading-relaxed`
- Auto-close 4 วินาที
- Animate เข้ามาจากล่างด้วย Framer Motion

### 8.9 Loading Screen

- `fixed inset-0 z-[9999] bg-[var(--color-background)]`
- มี ambient glow ตรงกลาง: `w-[40vw] h-[40vw] rounded-full bg-primary opacity-5 blur-[120px]`
- Logo/Symbol ตรงกลางที่ pulse + spin animation
- ข้อความ: `uppercase tracking-[0.3em] text-xs text-primary`

### 8.10 Admin Sidebar

- `fixed inset-y-0 left-0 w-72`
- `bg-[var(--color-surface)] border-r border-[var(--color-border)]`
- Brand header: `font-display text-2xl text-primary` + sub-label `text-[10px] uppercase tracking-widest`
- Nav item active: `bg-[var(--color-primary)]/10 text-[var(--color-primary)]`
- Nav item inactive: `text-[var(--color-muted-foreground)] hover:bg-[var(--color-surface-hover)]`
- Mobile: slide-in ด้วย translate-x + backdrop overlay

---

## 9. Layout Patterns (รูปแบบ Layout)

### 9.1 Responsive Padding
```
px-8 md:px-16 lg:px-24
p-8 md:p-16 lg:p-24
```

### 9.2 Login / Auth Layout (Asymmetric Split)
```
grid min-h-screen lg:grid-cols-[1.2fr_1fr]
```
- ฝั่งซ้าย: Visual branding + Hero text (ซ่อนบน mobile)
- ฝั่งขวา: Form

### 9.3 Product Grid
```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16
```

### 9.4 Cart Layout (Content + Sidebar)
```
flex flex-col lg:flex-row gap-16
```
- ฝั่งซ้าย: `flex-1` → Cart items
- ฝั่งขวา: `w-full lg:w-96 shrink-0` → Sticky summary

### 9.5 Checkout / Profile Layout (Centered)
```
max-w-2xl w-full mx-auto  (narrow)
max-w-4xl w-full mx-auto  (wide)
```

### 9.6 Admin Layout (Sidebar + Main)
```
flex h-screen overflow-hidden
```
- Sidebar: `w-72 fixed`
- Main: `flex-1 h-screen overflow-y-auto`

---

## 10. Ambient Effects (Glow & Polish)

### Background Glow
ใช้ `div` ลอยขนาดใหญ่ที่ blur สูงมาก:
```tsx
<div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[var(--color-glow)] blur-[120px] pointer-events-none" />
```

### Image Gradient Overlays
```tsx
{/* Top gradient */}
<div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
{/* Bottom gradient */}
<div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
```

### Navbar Bottom Gradient Line
```tsx
<div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--color-primary)]/40 to-transparent" />
```

---

## 11. Design Principles (หลักการ)

1. **Sharp Corners (ไม่ใช้ rounded)** — Card, Modal, Button ทุกตัวเป็นเหลี่ยม → ให้ feel เหมือน editorial magazine / luxury brand
2. **Mono-hue Palette** — ทุกสีในระบบ (ตั้งแต่ background ถึง border) มี hue ใกล้เคียงกัน → ดู cohesive
3. **Uppercase + Wide Tracking** — Label และ micro text ทุกตัว `uppercase tracking-widest` → ดู high-end
4. **Minimalist but Rich** — หน้าไม่รก แต่มี depth จาก shadows, gradients, blur effects
5. **Motion = Luxury** — ทุก element เข้ามาด้วย animation, ไม่มีอะไรปรากฏทันที
6. **Backdrop Blur** — Navbar, Modal backdrop, Toast ทุกตัวใช้ `backdrop-blur` เพื่อ depth
7. **Responsive ตั้งแต่แรก** — ทุก layout พิจารณา mobile/tablet/desktop
8. **Dark Mode First** — Design หลักเป็น dark mode, light mode เป็น variant

---

## 12. สรุป Quick Reference

```
ฟอนต์ Body:     Inter (font-sans)
ฟอนต์ Heading:  Syne (font-display)
Icon:           Lucide React
Animation:      Framer Motion
CSS:            Tailwind CSS v4
Color Space:    OKLCH
Theme:          CSS Variables + class toggle
Easing:         [0.16, 1, 0.3, 1]
ปุ่ม/Card:      ไม่มี rounded (sharp corners)
Label style:    uppercase tracking-widest text-xs
สี:             Semantic tokens (--color-xxx)
```

> **Note:** ค่าสีทั้งหมดในเอกสารนี้เป็น **ตัวอย่าง** (warm gold-orange theme)
> คุณสามารถเปลี่ยน hue ใน OKLCH ให้เป็นสีที่ต้องการได้เลย
> เพียงแค่รักษา lightness/chroma ratio ที่ใกล้เคียงกัน
