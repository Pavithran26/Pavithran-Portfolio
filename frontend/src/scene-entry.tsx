import React from 'react';
import { createRoot } from 'react-dom/client';
import { Scene } from './Scene';
import './style.css';

const rootEl = document.getElementById('root');
if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <Scene />
    </React.StrictMode>
  );
}
