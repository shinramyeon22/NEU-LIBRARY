<p align="center">
  <a href="https://gen-lang-client-0632857640.web.app" target="_blank">
    <img src="https://img.shields.io/badge/🚀%20Launch%20App-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Launch App" height="40"/>
  </a>
  &nbsp;&nbsp;&nbsp;
  <a href="https://github.com/shinramyeon22/NEU-LIBRARY" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-View%20Source-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" height="40"/>
  </a>
</p>

<h1 align="center">NEU MOA (Memoranda of Agreement Tracker)</h1>

<p align="center">
  Single-page application for monitoring, maintaining, and auditing Memoranda of Agreement (MOAs) at New Era University.<br/>
  Built with React, Vite, Firebase Authentication, Firestore, and Tailwind CSS.
  <br/><br/>
  <strong>Live Deployment:</strong> 
  <a href="https://gen-lang-client-0632857640.web.app">https://gen-lang-client-0632857640.web.app</a>
</p>

<br/>

## Features
- Google Sign-in restricted to @neu.edu.ph accounts
- Role-based access (Admin / Maintainer / Viewer)
- Create, view, update, and archive MOAs
- Audit trail / change history logging
- Encrypted environment variables workflow for team collaboration
- Firebase Hosting deployment ready

# React + TypeScript + Vite

## Deploying to Firebase

See the Firebase Hosting deployment guide: [docs/firebase-deploy.md](docs/firebase-deploy.md).

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
