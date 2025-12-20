# GrowSuite CRM

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-4.4.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-06B6D4?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

GrowSuite is a modern, responsive, and feature-rich Customer Relationship Management (CRM) application built with the latest web technologies. It helps businesses manage their clients, projects, and communications in one place.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with dark/light mode support
- **Client Management**: Organize and track client information
- **Project Tracking**: Manage projects and tasks efficiently
- **Invoicing**: Generate and send professional invoices
- **Analytics**: Get insights into your business performance
- **Secure**: Built with security best practices

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **Icons**: Lucide Icons
- **Form Handling**: React Hook Form
- **State Management**: React Context API
- **Build Tool**: Vite

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/growsuite.git
   cd growsuite
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 Build

To create a production build:

```bash
npm run build
# or
yarn build
```

## 🧪 Testing

Run tests with:

```bash
npm test
# or
yarn test
```

## 🤝 Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) to get started.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/) for the amazing build tool
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS
- [Lucide Icons](https://lucide.dev/) for beautiful icons
- [Framer Motion](https://www.framer.com/motion/) for smooth animations

---

## React + TypeScript + Vite (Template Info)

This project was bootstrapped with Vite and includes the following official plugins:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) for SWC-based Fast Refresh

## 🛠 Development

### React Compiler

The React Compiler is enabled in this project. See the [official documentation](https://react.dev/learn/react-compiler) for more information.

> **Note**: The React Compiler might impact Vite's development and build performance.

### Code Style

This project uses ESLint and Prettier for code formatting and linting. The configuration follows the Airbnb JavaScript Style Guide with TypeScript support.

### Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
VITE_API_URL=your_api_url_here
VITE_APP_NAME=GrowSuite
# Add other environment variables as needed
```

## 📂 Project Structure

```
src/
├── assets/          # Static assets (images, fonts, etc.)
├── components/      # Reusable UI components
│   ├── landing/     # Landing page components
│   ├── ui/          # Base UI components (buttons, cards, etc.)
│   └── dashboard/   # Dashboard-specific components
├── config/          # Application configuration
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and helpers
├── pages/           # Page components
├── styles/          # Global styles and Tailwind configuration
└── types/           # TypeScript type definitions
```

## 🔍 Linting and Formatting

This project uses ESLint with TypeScript support. To run the linter:

```bash
npm run lint
# or
yarn lint
```

## 📝 Expanding the ESLint Configuration

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
