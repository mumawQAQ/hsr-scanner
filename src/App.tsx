import './App.css'
import { ThemeProvider } from '@/components/providers/theme-provider.tsx'
import { Suspense } from 'react'
import { useRoutes } from 'react-router'
import routes from '~react-pages'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar.tsx'
import { AppSidebar } from '@/components/app-sidebar.tsx'
import { SetupProvider } from '@/components/providers/setup-provider.tsx'
import { ModalProvider } from '@/components/providers/modal-provider.tsx'
import { Toaster } from '@/components/ui/sonner'
import QueryClientProvider from '@/components/providers/query-client-provider.tsx'

function App() {
    return (
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <QueryClientProvider>
                <Toaster richColors />
                <SetupProvider>
                    <ModalProvider />
                    <Suspense>
                        <SidebarProvider defaultOpen={false}>
                            <AppSidebar />
                            <SidebarInset>
                                <main className="p-4">
                                    <SidebarTrigger />
                                    {useRoutes(routes)}
                                </main>
                            </SidebarInset>
                        </SidebarProvider>
                    </Suspense>
                </SetupProvider>
            </QueryClientProvider>
        </ThemeProvider>
    )
}

export default App
