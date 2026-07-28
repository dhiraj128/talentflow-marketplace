# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: find-jobs-visual-responsive.spec.ts >> Phase 14 — Automated Visual & Geometry Responsive Assertions on Find Jobs >> Find Jobs Page Layout & Input Geometry at 1366px
- Location: tests\find-jobs-visual-responsive.spec.ts:9:9

# Error details

```
Error: Input height at 1366px must be >= 40px

expect(received).toBeGreaterThanOrEqual(expected)

Expected: >= 40
Received:    25
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]:
          - link "T TalentFlow" [ref=e6] [cursor=pointer]:
            - /url: /
            - generic [ref=e7]: T
            - generic [ref=e8]: TalentFlow
          - navigation [ref=e9]:
            - link "Find Jobs" [ref=e10] [cursor=pointer]:
              - /url: /find-jobs
            - link "Freelancers" [ref=e11] [cursor=pointer]:
              - /url: /find-freelancers
            - link "Courses" [ref=e12] [cursor=pointer]:
              - /url: /find-courses
            - link "Find Talent" [ref=e13] [cursor=pointer]:
              - /url: /find-talent
        - generic [ref=e14]:
          - link "Sign In" [ref=e15] [cursor=pointer]:
            - /url: /sign-in
            - button "Sign In" [ref=e16]
          - link "Get Started" [ref=e17] [cursor=pointer]:
            - /url: /sign-up
            - button "Get Started" [ref=e18]
    - main [ref=e19]:
      - generic [ref=e20]:
        - generic [ref=e23]:
          - button "Jobs" [ref=e24]:
            - generic [ref=e25]:
              - img [ref=e26]
              - generic [ref=e29]: Jobs
            - img [ref=e30]
          - generic [ref=e32]:
            - img [ref=e33]
            - textbox "Job title, skill, or company" [ref=e36]
          - generic [ref=e38]:
            - img [ref=e39]
            - textbox "City, state, or remote" [ref=e42]
          - generic [ref=e43]:
            - button "Voice Search" [ref=e44]:
              - img
              - generic [ref=e45]: Voice Search
            - button "Search" [ref=e46]
        - generic [ref=e47]:
          - generic [ref=e48]:
            - heading "Find Your Next Role" [level=1] [ref=e49]
            - paragraph [ref=e50]: Browse thousands of job openings from top companies and find the perfect match for your career aspirations.
          - generic [ref=e51]:
            - complementary [ref=e52]:
              - generic [ref=e53]:
                - heading "Filters" [level=2] [ref=e54]:
                  - img [ref=e55]
                  - text: Filters
                - button "Clear all" [ref=e56]
              - generic [ref=e57]:
                - generic [ref=e58]:
                  - heading "Job Type" [level=3] [ref=e59]
                  - generic [ref=e60]:
                    - generic [ref=e61]:
                      - checkbox "Full-time" [ref=e62]
                      - checkbox [ref=e63]
                      - generic [ref=e64] [cursor=pointer]: Full-time
                    - generic [ref=e65]:
                      - checkbox "Part-time" [ref=e66]
                      - checkbox [ref=e67]
                      - generic [ref=e68] [cursor=pointer]: Part-time
                    - generic [ref=e69]:
                      - checkbox "Contract" [ref=e70]
                      - checkbox [ref=e71]
                      - generic [ref=e72] [cursor=pointer]: Contract
                    - generic [ref=e73]:
                      - checkbox "Freelance" [ref=e74]
                      - checkbox [ref=e75]
                      - generic [ref=e76] [cursor=pointer]: Freelance
                    - generic [ref=e77]:
                      - checkbox "Internship" [ref=e78]
                      - checkbox [ref=e79]
                      - generic [ref=e80] [cursor=pointer]: Internship
                - generic [ref=e81]:
                  - heading "Experience Level" [level=3] [ref=e82]
                  - generic [ref=e83]:
                    - generic [ref=e84]:
                      - checkbox [ref=e85]
                      - checkbox [ref=e86]
                      - generic [ref=e87] [cursor=pointer]: Entry Level
                    - generic [ref=e88]:
                      - checkbox [ref=e89]
                      - checkbox [ref=e90]
                      - generic [ref=e91] [cursor=pointer]: Mid Level
                    - generic [ref=e92]:
                      - checkbox [ref=e93]
                      - checkbox [ref=e94]
                      - generic [ref=e95] [cursor=pointer]: Senior Level
                    - generic [ref=e96]:
                      - checkbox "Director" [ref=e97]
                      - checkbox [ref=e98]
                      - generic [ref=e99] [cursor=pointer]: Director
                    - generic [ref=e100]:
                      - checkbox "Executive" [ref=e101]
                      - checkbox [ref=e102]
                      - generic [ref=e103] [cursor=pointer]: Executive
                - generic [ref=e104]:
                  - heading "Work Mode" [level=3] [ref=e105]
                  - generic [ref=e106]:
                    - generic [ref=e107]:
                      - checkbox "Remote" [ref=e108]
                      - checkbox [ref=e109]
                      - generic [ref=e110] [cursor=pointer]: Remote
                    - generic [ref=e111]:
                      - checkbox "On-site" [ref=e112]
                      - checkbox [ref=e113]
                      - generic [ref=e114] [cursor=pointer]: On-site
                    - generic [ref=e115]:
                      - checkbox "Hybrid" [ref=e116]
                      - checkbox [ref=e117]
                      - generic [ref=e118] [cursor=pointer]: Hybrid
                - generic [ref=e119]:
                  - heading "Salary Range" [level=3] [ref=e120]
                  - combobox [ref=e121]:
                    - generic [ref=e122]: any
                    - img: ▼
                  - textbox [ref=e123]: any
            - main [ref=e124]:
              - generic [ref=e125]:
                - paragraph [ref=e127]: Showing ... jobs
                - generic [ref=e128]:
                  - generic [ref=e129]: "Sort by:"
                  - combobox [ref=e130]:
                    - generic [ref=e131]: relevant
                    - img: ▼
                  - textbox [ref=e132]: relevant
    - contentinfo [ref=e138]:
      - generic [ref=e139]:
        - generic [ref=e140]:
          - generic [ref=e141]:
            - text: TalentFlow
            - paragraph [ref=e142]: Your Career Ecosystem — All in One Place. Connect with verified employers, freelance projects, and certified training programs.
            - paragraph [ref=e143]: Powered by TalentFlow Platform
          - generic [ref=e144]:
            - heading "Platform" [level=3] [ref=e145]
            - list [ref=e146]:
              - listitem [ref=e147]:
                - link "Find Jobs" [ref=e148] [cursor=pointer]:
                  - /url: /find-jobs
              - listitem [ref=e149]:
                - link "Freelancers" [ref=e150] [cursor=pointer]:
                  - /url: /find-freelancers
              - listitem [ref=e151]:
                - link "Training" [ref=e152] [cursor=pointer]:
                  - /url: /find-courses
              - listitem [ref=e153]:
                - link "Employers" [ref=e154] [cursor=pointer]:
                  - /url: /find-talent
          - generic [ref=e155]:
            - heading "Company" [level=3] [ref=e156]
            - list [ref=e157]:
              - listitem [ref=e158]:
                - link "About Us" [ref=e159] [cursor=pointer]:
                  - /url: /about
              - listitem [ref=e160]:
                - link "Blog" [ref=e161] [cursor=pointer]:
                  - /url: /blog
              - listitem [ref=e162]:
                - link "Career Resources" [ref=e163] [cursor=pointer]:
                  - /url: /careers
              - listitem [ref=e164]:
                - link "Contact" [ref=e165] [cursor=pointer]:
                  - /url: /contact
          - generic [ref=e166]:
            - heading "Legal" [level=3] [ref=e167]
            - list [ref=e168]:
              - listitem [ref=e169]:
                - link "Privacy Policy" [ref=e170] [cursor=pointer]:
                  - /url: /privacy
              - listitem [ref=e171]:
                - link "Terms & Conditions" [ref=e172] [cursor=pointer]:
                  - /url: /terms
              - listitem [ref=e173]:
                - link "Cookie Policy" [ref=e174] [cursor=pointer]:
                  - /url: /cookie
        - generic [ref=e175]:
          - paragraph [ref=e176]: TalentFlow Marketplace © 2026. All rights reserved.
          - generic [ref=e177]:
            - link "Twitter" [ref=e178] [cursor=pointer]:
              - /url: "#"
              - generic [ref=e179]: Twitter
              - img [ref=e180]
            - link "LinkedIn" [ref=e182] [cursor=pointer]:
              - /url: "#"
              - generic [ref=e183]: LinkedIn
              - img [ref=e184]
  - region "Notifications alt+T"
  - alert [ref=e186]
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
> 26 |         expect(inputBox.height, `Input height at ${width}px must be >= 40px`).toBeGreaterThanOrEqual(40);
     |                                                                               ^ Error: Input height at 1366px must be >= 40px
  27 |         expect(inputBox.width, `Input width at ${width}px must be >= 180px`).toBeGreaterThanOrEqual(180);
  28 |       }
  29 | 
  30 |       // 3. Search button geometry check
  31 |       const searchBtn = page.locator('button:has-text("Search")').first();
  32 |       await expect(searchBtn).toBeVisible();
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