import { FileCode, ScanLine, Settings } from 'lucide-react'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'
import { ModeToggle } from '@/components/mode-toggle.tsx'

const items = [
    {
        title: '扫描器',
        url: '/',
        icon: ScanLine,
    },
    {
        title: '模板',
        url: '/templates',
        icon: FileCode,
    },
    {
        title: '设置',
        url: '/setting/',
        icon: Settings,
    },
]

export function AppSidebar() {
    return (
        <Sidebar variant="inset" side="left">
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="flex items-center">
                <ModeToggle />
            </SidebarFooter>
        </Sidebar>
    )
}
