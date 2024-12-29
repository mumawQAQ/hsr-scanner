'use client';
import './globals.css';
import React from 'react';
import { MyNextUIProvider } from '@/app/providers/nextui-provider';
import { Toaster } from 'react-hot-toast';
import { ModalProvider } from '@/app/providers/modal-provider';
import QueryClientProvider from '@/app/providers/query-client-provider';

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body>
    <MyNextUIProvider>
      <QueryClientProvider>
        {children}
        <Toaster position={'bottom-center'} toastOptions={{
          duration: 1000,
        }} />
        <ModalProvider />
      </QueryClientProvider>
    </MyNextUIProvider>
    </body>
    </html>
  );
}
