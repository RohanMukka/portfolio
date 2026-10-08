
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/App';
import { isSoftwareRendering } from './src/lib/rendering';

// Without a graphics card the page's heavier effects stutter, so it runs in
// lite mode: see `[data-lite]` in index.css, Stage and GradientField.
if (isSoftwareRendering()) document.documentElement.dataset.lite = '';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
