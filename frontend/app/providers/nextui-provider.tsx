'use client';

import { NextUIProvider } from '@nextui-org/react';

export function MyNextUIProvider({ children }: { children: React.ReactNode }) {
  return <NextUIProvider>{children}</NextUIProvider>;
}
