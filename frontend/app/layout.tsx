'use client';
import './globals.css';
import React from 'react';
import { MyNextUIProvider } from '@/app/providers/nextui-provider';
import { Toaster } from 'react-hot-toast';
import { ModalProvider } from '@/app/providers/modal-provider';
import QueryClientProvider from '@/app/providers/query-client-provider';
import { Setup } from '@/app/components/setup';

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
        <Setup />
        <ModalProvider />
      </QueryClientProvider>
    </MyNextUIProvider>
    </body>
    </html>
  );
}
