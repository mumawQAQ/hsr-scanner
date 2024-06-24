import { NextUIProvider } from '@nextui-org/react';
import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import FloatingApp from '@/FloatingApp.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NextUIProvider>
      <FloatingApp />
    </NextUIProvider>
  </React.StrictMode>
);
