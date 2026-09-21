# Khalid Jamil | Portfolio

Personal portfolio of Khalid Jamil, a BCA graduate building a career as a SOC Analyst (L1).

**Live:** https://khalid-portfolio-org.vercel.app

Plain HTML, CSS and JavaScript. No framework, no build step.

## Features

- **Dark developer-tool design** with a single orange accent (`#f08c41`)
- **Cursor effects**: orange grid lines light up around the pointer in the hero, and cards get a spotlight glow that follows the mouse (disabled on touch devices)
- **Scroll progress line** at the top of the page
- **Triage practice widget**: four sample SOC alerts where you pick a verdict (escalate, close as benign, need more info) and see the usual reasoning. These are practice scenarios, not real incidents, and all IPs use documentation ranges
- **Sections**: Training, Skills, Projects, Education, Certifications, Contact
- **Responsive** layout and `prefers-reduced-motion` support

## Project structure

```
.
├── index.html                      # Page content and structure
├── style.css                       # All styles and design tokens
├── script.js                       # Pointer effects and triage widget
└── Khalid_Jamil_Resume_SOC_L1.pdf  # Resume (used by the Download button)
```

## Run locally

No install needed. Either open `index.html` in a browser, or serve the folder:

```bash
# Python
python3 -m http.server 8000

# or Node
npx serve .
```

Then visit http://localhost:8000.

## Customize

**Colors and fonts** live in `:root` at the top of `style.css`:

```css
--accent: #f08c41;
--accent-rgb: 240, 140, 65;   /* keep in sync with --accent */
--sans: "Darker Grotesque", "Geist", system-ui, sans-serif;
```

If you change the font family, load it in the `<head>` of `index.html` and re-check the font sizes in `style.css`, since fonts with a small x-height need larger sizes.

**Triage scenarios** are the `ALERTS` array in `script.js`. Each entry has a severity (`hi`, `md`, `lo`), alert details, the expected `answer` (`escalate` or `benign`) and a short `why`.

**Content** (training, skills, projects, education, certifications) is plain HTML in `index.html`.

## Before publishing

- [ ] Replace the LinkedIn link (`href="#"`) in the Contact section
- [ ] Add the Live and GitHub links for the Echo E-Commerce project
- [ ] Put `Khalid_Jamil_Resume_SOC_L1.pdf` in the same folder as `index.html`

## Deploy on Vercel

1. Push this folder to a GitHub repository.
2. Import the repository in Vercel.
3. Framework preset: **Other**. Leave the build command empty and the output directory as the root.
4. Deploy. Every push to the main branch redeploys automatically.

## Design credit

The dark, developer-tool look is inspired by the general style of blackbox.ai. No assets, logos or code were copied from that site.

## Contact

- Email: khalidjamil0777@gmail.com
- GitHub: https://github.com/khalidjamil0777
