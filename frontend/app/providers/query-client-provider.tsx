'use client';

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider as OriginalQueryClientProvider } from '@tanstack/react-query';

export default function QueryClientProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return <OriginalQueryClientProvider client={queryClient}>{children}</OriginalQueryClientProvider>;
}
