# COSMOS — Astronomy Website

A responsive, single-page astronomy website built with HTML, CSS and vanilla JavaScript.

## Run locally
1. Extract the ZIP file.
2. Open the `cosmos-astronomy` folder in VS Code.
3. Open `index.html` in your browser, or use the VS Code **Live Server** extension.

## Included features
- Responsive navigation and mobile menu
- Hero section and destination cards
- Astro gallery with category filters and image modal
- Interactive planet explorer
- NASA Astronomy Picture of the Day integration
- Five-question cosmic quiz with score and feedback

## Project structure
```text
cosmos-astronomy/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── README.md
```

## NASA API note
The APOD widget currently uses NASA's public `DEMO_KEY` for testing. For regular use, request your own key at https://api.nasa.gov/ and replace `DEMO_KEY` in `js/script.js`. Do not expose a private API key in a public repository; for a production project, route requests through a small backend.

## Images
The sample gallery uses remotely hosted Unsplash images as visual placeholders. Check each image's licence and replace them with appropriately credited images before publishing. NASA image and media resources: https://images.nasa.gov/

## Customisation
- Change colors and typography in `css/style.css` under `:root`.
- Add gallery cards in `index.html` using the existing `.gallery-item` pattern.
- Add or edit planet information in the `planets` object in `js/script.js`.
- Edit quiz questions in the `questions` array in `js/script.js`.
