# Tourblog

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Copy the `firebase.config.example.js` file to `firebase.js`
3. Replace the placeholder values in `firebase.js` with your actual Firebase credentials
4. Make sure `firebase.js` is in your `.gitignore` file to prevent committing sensitive credentials

## Getting Firebase Credentials

1. Go to your Firebase Console
2. Select your project
3. Click on the gear icon (⚙️) next to "Project Overview" to open project settings
4. Under "Your apps", find your web app or create a new one
5. Copy the configuration object and replace the values in your `firebase.js` file

## Security Note

Never commit your actual Firebase credentials to version control. Always use the example configuration file as a template and keep your real credentials in a local file that's excluded from git.

(yes, really)
