import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
if (!container) {
    throw new Error('Target container is not a DOM element.');
}

const root = createRoot(container);
root.render(<App />);