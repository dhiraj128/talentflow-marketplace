# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: find-jobs-visual-responsive.spec.ts >> Phase 14 — Automated Visual & Geometry Responsive Assertions on Find Jobs >> Find Jobs Page Layout & Input Geometry at 375px
- Location: tests\find-jobs-visual-responsive.spec.ts:9:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('button:has-text("Search")').first()
Expected: visible
Received: hidden
Timeout:  5000ms

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('button:has-text("Search")').first()
    14 × locator resolved to <button tabindex="0" type="button" data-slot="button" class="group/button shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-…>…</button>
       - unexpected value "hidden"

```

```yaml
- banner:
  - link "T":
    - /url: /
  - link "Get Started":
    - /url: /sign-up
    - button "Get Started"
  - button
- main:
  - button "Jobs"
  - textbox "Job title, skill, or company"
  - textbox "City, state, or remote"
  - button "Search"
  - heading "Find Your Next Role" [level=1]
  - paragraph: Browse thousands of job openings from top companies and find the perfect match for your career aspirations.
  - main:
    - button "Filters"
    - combobox: relevant
    - heading "No results found" [level=3]
    - paragraph: We couldn't find anything matching your current search criteria. Try adjusting your filters or keyword.
    - button "Browse All"
- contentinfo:
  - text: TalentFlow
  - paragraph: Your Career Ecosystem — All in One Place. Connect with verified employers, freelance projects, and certified training programs.
  - paragraph: Powered by TalentFlow Platform
  - heading "Platform" [level=3]
  - list:
    - listitem:
      - link "Find Jobs":
        - /url: /find-jobs
    - listitem:
      - link "Freelancers":
        - /url: /find-freelancers
    - listitem:
      - link "Training":
        - /url: /find-courses
    - listitem:
      - link "Employers":
        - /url: /find-talent
  - heading "Company" [level=3]
  - list:
    - listitem:
      - link "About Us":
        - /url: /about
    - listitem:
      - link "Blog":
        - /url: /blog
    - listitem:
      - link "Career Resources":
        - /url: /careers
    - listitem:
      - link "Contact":
        - /url: /contact
  - heading "Legal" [level=3]
  - list:
    - listitem:
      - link "Privacy Policy":
        - /url: /privacy
    - listitem:
      - link "Terms & Conditions":
        - /url: /terms
    - listitem:
      - link "Cookie Policy":
        - /url: /cookie
  - paragraph: TalentFlow Marketplace © 2026. All rights reserved.
  - link "Twitter":
    - /url: "#"
  - link "LinkedIn":
    - /url: "#"
- region "Notifications alt+T"
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const PROD_URL = 'https://talentflow-marketplace.vercel.app';
  4  | const VIEWPORTS = [320, 360, 375, 390, 412, 430, 768, 1024, 1280, 1366, 1440, 1920];
  5  | 
  6  | test.describe('Phase 14 — Automated Visual & Geometry Responsive Assertions on Find Jobs', () => {
  7  | 
  8  |   for (const width of VIEWPORTS) {
  9  |     test(`Find Jobs Page Layout & Input Geometry at ${width}px`, async ({ page }) => {
  10 |       await page.setViewportSize({ width, height: 900 });
  11 |       await page.goto(`${PROD_URL}/find-jobs`, { waitUntil: 'domcontentloaded' });
  12 |       await page.waitForTimeout(1000);
  13 | 
  14 |       // 1. Document overflow check
  15 |       const overflow = await page.evaluate(() => {
  16 |         return document.documentElement.scrollWidth - window.innerWidth;
  17 |       });
  18 |       expect(overflow, `Horizontal document overflow at ${width}px`).toBeLessThanOrEqual(5);
  19 | 
  20 |       // 2. Keyword input geometry check
  21 |       const keywordInput = page.locator('input[placeholder*="Job title"]').first();
  22 |       await expect(keywordInput).toBeVisible();
  23 |       const inputBox = await keywordInput.boundingBox();
  24 |       expect(inputBox, 'Keyword input bounding box missing').not.toBeNull();
  25 |       if (inputBox) {
  26 |         expect(inputBox.height, `Input height at ${width}px must be >= 40px`).toBeGreaterThanOrEqual(40);
  27 |         expect(inputBox.width, `Input width at ${width}px must be >= 180px`).toBeGreaterThanOrEqual(180);
  28 |       }
  29 | 
  30 |       // 3. Search button geometry check
  31 |       const searchBtn = page.locator('button:has-text("Search")').first();
> 32 |       await expect(searchBtn).toBeVisible();
     |                               ^ Error: expect(locator).toBeVisible() failed
  33 |       const btnBox = await searchBtn.boundingBox();
  34 |       expect(btnBox, 'Search button bounding box missing').not.toBeNull();
  35 |       if (btnBox) {
  36 |         expect(btnBox.height, `Search button height at ${width}px must be >= 40px`).toBeGreaterThanOrEqual(40);
  37 |       }
  38 | 
  39 |       // 4. Overlap check helper
  40 |       if (width >= 768 && inputBox && btnBox) {
  41 |         // On desktop, search button and input should not collide in top position
  42 |         const yOverlap = Math.abs(inputBox.y - btnBox.y);
  43 |         expect(yOverlap, `Vertical misalignment on desktop at ${width}px`).toBeLessThan(30);
  44 |       }
  45 |     });
  46 |   }
  47 | 
  48 | });
  49 | 
```