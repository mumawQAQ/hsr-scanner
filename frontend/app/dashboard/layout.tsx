import React from 'react';
import Navbar from '@/app/components/navbar';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-2">{children}</div>
    </div>
  );
}
