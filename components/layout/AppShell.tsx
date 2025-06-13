// src/components/layout/AppShell.tsx
"use client";

import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger } from 'C:/Users/User/Downloads/src/components/ui/sidebar';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset, SidebarTrigger } from '../ui/sidebar';
// import { AppLogo } from 'C:/Users/User/Downloads/src/components/shared/AppLogo';
import { AppLogo } from '../shared/AppLogo';
// import { NAV_LINKS } from 'C:/Users/User/Downloads/src/constants/navigation';
import { NAV_LINKS } from '../../constants/navigation';
// import { Button } from 'C:/Users/User/Downloads/src/components/ui/button';
import { Button } from '../ui/button';
import { Menu } from 'lucide-react';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon" side="left" variant="sidebar" className="border-r">
        <SidebarHeader className="p-4 flex items-center justify-between h-16 border-b">
          <AppLogo />
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {NAV_LINKS
              .filter((item) => item?.href) // ✅ ensure item and item.href are not null
              .map((item) => {
                const isActive =
                  pathname &&
                  (pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href)));

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      variant="default"
                      size="default"
                      className="justify-start"
                    >
                      <Link href={item.href}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 shadow-sm">
          <div className="md:hidden">
            <SidebarTrigger asChild>
              <Button>
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SidebarTrigger>
          </div>
          <div className="flex-1">
            {/* Breadcrumbs or search could go here */}
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-muted/40 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}