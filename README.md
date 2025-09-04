# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


## follow the step by step installation to download and install all the required extentions
npm create vite@latest my-project -- --template react
cd my-project
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p


## Add the paths to all of your template files in your tailwind.config.js file.
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

## Add the @tailwind directives for each of Tailwind’s layers to your ./src/index.css file.
@tailwind base;
@tailwind components;
@tailwind utilities;

npm run dev


## name of some extensions installed
npm install  axios # http client and state
            react-router-dom # for routing
            @tanstack/react-query # caching property data
            react-hook-form @hookform/resolvers yup # property listing , search and filters
            react-image-gallery # image handling
            react-dropzone # property image uploads
            @googlemaps/react-wrapper # for map intergration
