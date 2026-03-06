# Vocentra Deploy Instructions

## 1. Local Demo (Development)

The fastest way to test and demo the frontend during development:

```bash
npm install
npm run dev
```

## 2. Production Build

If you need to ship a static version or integrate deeply with a Flask/Python backend, you can build the project statically:

```bash
npm run build
```

This generates a `dist/` folder. All assets in `dist/` are minified and optimized.

## 3. Integrating `dist/` with Python Backend

If you want to serve the built files natively via a Python server:

1. Copy the contents of `dist/assets` to your backend's `static/` directory.
2. Copy `dist/index.html`, `dist/upload.html`, and `dist/result.html` to your `templates/` directory.
3. Update the Python endpoints to render those newly built templates.

## 4. Environment Variables

If your API base URL changes depending on the environment:

1. Create a `.env` file containing `VITE_API_BASE_URL=https://api.vocentra.com`
2. Update `apiClient.js` to use `import.meta.env.VITE_API_BASE_URL || '/api'`
