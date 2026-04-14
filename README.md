# Sieracki Consulting Website

A three-page professional website for Sieracki Consulting — GIS mapping, environmental research, and spatial analysis.

## Pages

- **index.html** — Home / intro page
- **maps.html** — GIS map examples gallery
- **about.html** — About & contact
- **maps/** — Individual large-view pages for each map example (9 pages)

## File Structure

```
sieracki-consulting/
├── index.html
├── maps.html
├── about.html
├── style.css
├── main.js
├── README.md
└── maps/
    ├── terrain-hillshade-large.html
    ├── slope-classification-large.html
    ├── landcover-large.html
    ├── vegetation-ndvi-large.html
    ├── change-detection-large.html
    ├── watershed-large.html
    ├── floodplain-large.html
    ├── habitat-large.html
    └── soils-large.html
```

## Adding Your Map Images

1. Create an `images/` folder in the root directory
2. Add your map images (JPEG or PNG recommended, keep under ~500KB each for web)
3. In each `maps/*-large.html` file, replace the placeholder `<div>` with:
   ```html
   <img src="../images/your-map-filename.jpg" alt="Description of map">
   ```
4. In `maps.html`, replace each `.map-placeholder` `<div>` with a smaller thumbnail:
   ```html
   <img src="images/your-map-thumbnail.jpg" alt="Description">
   ```
   Thumbnails should be around 600–800px wide.

## Uploading to GitHub Pages

### Option 1: GitHub Web Interface
1. Go to your GitHub repository
2. Click "Add file" → "Upload files"
3. Drag all files/folders in, or use the file picker
4. Commit the changes
5. Go to Settings → Pages → set source to "Deploy from branch: main / root"

### Option 2: Git Command Line
```bash
cd /path/to/sieracki-consulting
git init
git add .
git commit -m "Initial site upload"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```
Then enable GitHub Pages in repo Settings → Pages.

## Contact Form

The contact form in `about.html` is currently a static front-end form. To make it functional:

- **Formspree** (free, easy): Replace the `onsubmit="handleSubmit(event)"` with a Formspree action, e.g.:
  ```html
  <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
  ```
- **Netlify Forms**: Add `data-netlify="true"` to the form tag if hosting on Netlify
- **EmailJS**: Free client-side email service, requires minor JS update

## Customization Notes

- Update contact email in `about.html` (currently `info@sierackiconsulting.com`)
- Update the copyright year in all footers as needed
- The hero background uses an Unsplash photo — replace with a local image if preferred:
  ```css
  /* In style.css, find .hero and replace the background-image URL */
  background: ..., url('images/hero-bg.jpg') center/cover no-repeat;
  ```
- Google Fonts (Playfair Display + Source Sans 3) load from Google's CDN — site requires internet connection to display correctly

## Tech Stack

Plain HTML, CSS, and vanilla JavaScript. No build tools, no frameworks, no dependencies to install. Works on all modern browsers.
