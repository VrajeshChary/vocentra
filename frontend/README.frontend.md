# Vocentra Frontend

This is the modernized React + Vite Multi-Page Application for the Vocentra Multimodal Video Intelligence platform.

## Setup & Installation

1. Ensure you have Node.js installed (v18+ recommended).
2. Run `npm install` inside this folder to install dependencies.

## Running Locally

To run the frontend locally with hot-module replacement (HMR) for development:

```bash
npm run dev
```

Navigate to `http://localhost:5173/` or `http://localhost:5173/upload.html`.

## Backend Mock vs Real Integration

Currently, the application is set up to use **Mock Responses** tailored for the demo (found in `src/mocks/sample_response.json`). This ensures the hackathon demo executes flawlessly even without a backend.

**To switch to the real backend:**

1. Open `src/services/apiClient.js`.
2. Uncomment the `axios` POST/GET calls inside `analyzeVideo` and `fetchResults`.
3. Ensure your backend is running and update the `API_BASE` variable to point to your backend URL (e.g., `http://localhost:5000/api`).

## Architecture Notes

- **Multi-Page App**: The app uses Vite's `rollupOptions` to serve three HTML entry points (`index.html`, `upload.html`, `result.html`), keeping the original layout completely intact.
- **Components**: Complex new features (Video Player, Timeline, Radar/Gauges) are contained within `src/components/`, injected seamlessly via `src/pages/`.
- **Styling**: Uses the original `theme.css` with CSS variables for glass morphism.
