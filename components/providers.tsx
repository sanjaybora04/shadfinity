"use client"

import { ThemeProvider } from "next-themes"
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar"
import { AppSidebar } from "./sidebar"

export function Providers({ children }: { children: React.ReactNode }) {
  return (

    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableSystem
    >
      <SidebarProvider defaultOpen>
        <AppSidebar/>
        <SidebarTrigger className="sm:hidden absolute top-2 left-2"/>
        {children}
      </SidebarProvider>
    </ThemeProvider>
  )
}
